import { t } from 'elysia'

import { createElysia } from '@/server/api/elysia'
import { posts } from '@/server/db/schema'

export const postRouter = createElysia({ prefix: '/post' })
  .get('/', (ctx) => ctx.db.query.posts.findMany())
  .post(
    '/',
    async (ctx) => {
      await ctx.db
        .insert(posts)
        .values({ ...ctx.body, authorId: ctx.session.user.id })
      return true
    },
    {
      body: t.Object({ title: t.String(), content: t.String() }),
      protected: true,
    },
  )
