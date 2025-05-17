import { eq } from 'drizzle-orm'
import { t } from 'elysia'

import { createElysia } from '@/server/api/elysia'
import { posts } from '@/server/db/schema'

export const postRouter = createElysia({ prefix: '/post' })
  .get('/', ({ db }) =>
    db.query.posts.findMany({ orderBy: (t, { desc }) => desc(t.createdAt) }),
  )
  .post(
    '/create',
    async ({ session, db, body }) => {
      await db.insert(posts).values({ ...body, authorId: session.user.id })
      return true
    },
    {
      body: t.Object({ title: t.String(), content: t.String() }),
      protected: true,
    },
  )
  .delete(
    '/remove/:id',
    async ({ db, params }) => {
      await db.delete(posts).where(eq(posts.id, params.id))
      return true
    },
    { protected: true },
  )
