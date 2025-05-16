import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'

import { handlers } from '@server/auth'
import { postRouter } from '@server/routes/post'

export const server = new Elysia({ prefix: '/api' })
  .use(cors())
  .all('/auth/*', ({ request }) => {
    const { GET, POST } = handlers
    if (request.method === 'GET') return GET(request)
    if (request.method === 'POST') return POST(request)
  })
  .use(postRouter)

export type Server = typeof server
