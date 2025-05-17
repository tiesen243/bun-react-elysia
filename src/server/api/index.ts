import { createElysia } from '@/server/api/elysia'
/* Router Imports */
import { authRouter } from '@/server/api/routers/auth'
import { postRouter } from '@/server/api/routers/post'

export const server = createElysia({ prefix: '/api' })
  .onBeforeHandle(({ headers, session }) => {
    console.log(
      '>>> Elysia Request from',
      headers['x-elysia-source'] ?? 'unknown',
      'by',
      session.user?.name ?? 'anonymous',
    )
  })
  .get('/health', () => 'ok')
  .use(authRouter)
  .use(postRouter)
  .compile()

export type Server = typeof server
