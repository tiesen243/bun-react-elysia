import { createElysia } from '@/server/api/elysia'
import { postRouter } from '@/server/api/routers/post'
import { handlers } from '@/server/auth'

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
  .all('/auth/*', ({ request }) => {
    const { GET, POST } = handlers
    if (request.method === 'GET') return GET(request)
    if (request.method === 'POST') return POST(request)
  })
  .use(postRouter)
  .compile()

export type Server = typeof server
