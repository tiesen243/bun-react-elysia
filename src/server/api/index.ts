import { createElysia } from '@/server/api/elysia'
import { postRouter } from '@/server/api/routers/post'

export const server = createElysia({ prefix: '/api' })
  .get('/health', () => 'ok')
  .use(postRouter)
  .compile()

export type Server = typeof server
