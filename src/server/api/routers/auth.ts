import { generateCodeVerifier, generateState } from 'arctic'
import { t } from 'elysia'

import { createElysia } from '@/server/api/elysia'
import { authOptions } from '@/server/auth/config'
import {
  createSession,
  getOrCreateUserFromOAuth,
  invalidateToken,
  verifyCredentials,
} from '@/server/auth/core/queries'

export const authRouter = createElysia({ prefix: '/auth' })
  .get('/', ({ session }) => session)
  .get(
    '/:provider',
    ({ params, status, query, cookie, redirect }) => {
      const provider =
        authOptions.providers[
          params.provider as keyof typeof authOptions.providers
        ]
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!provider)
        return status(404, {
          error: `Provider ${params.provider} is not supported`,
        })

      const state = generateState()
      const codeVerifier = generateCodeVerifier()
      const authorizationUrl = provider.createAuthorizationURL(
        state,
        codeVerifier,
      )

      cookie.auth_state.set({
        value: state,
        ...authOptions.cookieOptions,
      })
      cookie.code_verifier.set({
        value: codeVerifier,
        ...authOptions.cookieOptions,
      })
      cookie.redirect_to.set({
        value: query.redirect_to,
        ...authOptions.cookieOptions,
      })

      return redirect(authorizationUrl.toString())
    },
    {
      query: t.Object({
        redirect_to: t.String({ default: '/' }),
      }),
      cookie: t.Cookie({
        auth_state: t.Optional(t.String()),
        code_verifier: t.Optional(t.String()),
        redirect_to: t.Optional(t.String()),
      }),
    },
  )
  .get(
    '/:provider/callback',
    async ({ params, cookie, query, status, redirect }) => {
      const provider =
        authOptions.providers[
          params.provider as keyof typeof authOptions.providers
        ]
      const { code, state } = query
      const storedState = cookie.auth_state.value
      const storedCode = cookie.code_verifier.value
      const redirectTo = cookie.redirect_to.value

      if (state !== storedState) return status(400, { error: 'Invalid state' })
      const userData = await provider.fetchUserData(code, storedCode)
      const user = await getOrCreateUserFromOAuth({
        ...userData,
        provider: params.provider,
      })
      const { sessionToken, expires } = await createSession(user.id)
      cookie[authOptions.cookieKey]?.set({
        ...authOptions.cookieOptions,
        value: sessionToken,
        expires,
      })
      cookie.auth_state.remove()
      cookie.code_verifier.remove()
      cookie.redirect_to.remove()

      return redirect(redirectTo)
    },
    {
      query: t.Object({ code: t.String(), state: t.String() }),
      cookie: t.Cookie({
        auth_token: t.Optional(t.String()),
        auth_state: t.String(),
        code_verifier: t.String(),
        redirect_to: t.String(),
      }),
    },
  )
  .post(
    '/sign-in',
    async ({ body, cookie }) => {
      const { sessionToken, expires } = await verifyCredentials(body)
      cookie[authOptions.cookieKey]?.set({
        ...authOptions.cookieOptions,
        value: sessionToken,
        expires,
      })
      return true
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
    },
  )
  .post('/sign-out', async ({ cookie, headers }) => {
    const token =
      cookie[authOptions.cookieKey]?.value ??
      headers.Authorization?.replace('Bearer ', '') ??
      ''
    if (token) await invalidateToken(token)
    cookie[authOptions.cookieKey]?.remove()
    return true
  })
