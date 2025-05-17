import type { ElysiaConfig } from 'elysia'
import Elysia from 'elysia'

import { authOptions } from '@/server/auth/config'
import { db } from '@/server/db'
import { validateToken } from '../auth/core/queries'

export const createElysia = <TPrefix extends string>(
  options?: ElysiaConfig<TPrefix>,
) =>
  new Elysia({
    ...options,
    aot: true,
  })
    .derive(async ({ cookie, headers }) => {
      const token =
        cookie[authOptions.cookieKey]?.value ??
        headers.Authorization?.replace('Bearer ', '') ??
        ''
      const session = await validateToken(token)

      return { db, session }
    })
    .macro({
      protected: () => {
        return {
          resolve: ({ session, status }) => {
            if (!session?.user) return status('Unauthorized')
            return { session: { ...session, user: session.user } }
          },
        }
      },
    })
