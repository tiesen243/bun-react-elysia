'use client'

import * as React from 'react'

import type { Options, SessionResult } from '@/server/auth/types'
import { api } from '@/lib/api'

type Provider = 'credentials' | keyof Options['providers']

type SessionContextValue = {
  signIn: <TProvider extends Provider>(
    provider: TProvider,
    ...args: TProvider extends 'credentials'
      ? [options: { email: string; password: string }]
      : [options?: { redirectTo: string }]
  ) => Promise<TProvider extends 'credentials' ? string : undefined>
  signOut: () => Promise<void>
  refresh: (token?: string) => Promise<void>
} & (
  | { status: 'loading'; session: SessionResult }
  | {
      status: 'authenticated'
      session: { user: NonNullable<SessionResult['user']>; expires: Date }
    }
  | { status: 'unauthenticated'; session: { expires: Date } }
)

const SessionContext = React.createContext<SessionContextValue | undefined>(
  undefined,
)

function useSession(): SessionContextValue {
  const ctx = React.use(SessionContext)
  if (!ctx) throw new Error('useSession must be used within a SessionProvider')
  return ctx
}

function SessionProvider({
  children,
  session: initialSession,
}: Readonly<{ children: React.ReactNode; session?: SessionResult }>) {
  const hasInitialSession = initialSession !== undefined
  const [isLoading, setIsLoading] = React.useState(!hasInitialSession)
  const [session, setSession] = React.useState<SessionResult>(() => {
    if (hasInitialSession) return initialSession
    return { expires: new Date() }
  })

  const status = React.useMemo(() => {
    if (isLoading) return 'loading' as const
    return session.user
      ? ('authenticated' as const)
      : ('unauthenticated' as const)
  }, [session, isLoading])

  const fetchSession = React.useCallback(
    async (token?: string): Promise<void> => {
      setIsLoading(true)
      try {
        const { data, error } = await api.auth.get({
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (error) throw new Error(`Failed to fetch session: ${error.status}`)

        setSession(data)
      } catch (error) {
        console.error('Error fetching session:', error)
        setSession({ expires: new Date() })
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const signIn = React.useCallback(
    async <TProvider extends Provider>(
      provider: TProvider,
      ...args: TProvider extends 'credentials'
        ? [options: { email: string; password: string }]
        : [options?: { redirectTo: string }]
    ): Promise<TProvider extends 'credentials' ? string : undefined> => {
      if (provider === 'credentials') {
        try {
          const { data, error } = await api.auth['sign-in'].post(
            args[0] as { email: string; password: string },
          )
          if (error) throw new Error(error.value.message)
          await fetchSession(data.token)
          return data.token as TProvider extends 'credentials'
            ? string
            : undefined
        } catch (error) {
          console.error('Sign in error:', error)
          throw error
        }
      } else {
        const redirectTo =
          (args[0] as { redirectTo?: string } | undefined)?.redirectTo ?? '/'
        window.location.href = `/api/auth/${provider}?redirect_to=${encodeURIComponent(redirectTo)}`
        return undefined as TProvider extends 'credentials' ? string : undefined
      }
    },
    [fetchSession],
  )

  const signOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await api.auth['sign-out'].post()
      if (error) throw new Error(`Sign out failed: ${error.status}`)
      setSession({ expires: new Date() })
      window.location.reload()
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }, [])

  // Fetch initial session if not provided
  React.useEffect(() => {
    if (hasInitialSession) return
    void fetchSession()
  }, [fetchSession, hasInitialSession])

  // Memoize the context value to prevent unnecessary re-renders
  const value = React.useMemo(
    () =>
      ({
        session,
        status,
        signIn,
        signOut,
        refresh: fetchSession,
      }) as SessionContextValue,
    [session, status, signIn, signOut, fetchSession],
  )

  return <SessionContext value={value}>{children}</SessionContext>
}

export { useSession, SessionProvider }
