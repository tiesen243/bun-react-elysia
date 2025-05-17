import { t } from 'elysia'

import { createElysia } from '@/server/api/elysia'
import { db } from '@/server/db'
import { posts } from '@/server/db/schema'

export const postRouter = createElysia({ prefix: '/post' })
  .get('/', async () => {
    return db.query.posts.findMany()
  })
  .post(
    '/',
    async ({ body }) => {
      await db.insert(posts).values(body)
      return true
    },
    { body: t.Object({ title: t.String(), content: t.String() }) },
  )
