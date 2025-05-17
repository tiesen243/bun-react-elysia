import type { ElysiaConfig } from 'elysia'
import Elysia from 'elysia'

import { auth } from '@/server/auth'
import { db } from '@/server/db'

export const createElysia = <TPrefix extends string>(
  options?: ElysiaConfig<TPrefix>,
) =>
  new Elysia({
    ...options,
    aot: true,
  })
    .derive(async ({ request }) => {
      const session = await auth(request)
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
