import { e } from '@/server/elysia'
import { postRouter } from '@/server/routers/post'

export const server = e({ prefix: '/api' })
  .get('/health', () => 'ok')
  .use(postRouter)
  .compile()

export type Server = typeof server
