import { desc, eq } from 'drizzle-orm'
import Elysia from 'elysia'

import { auth } from '@server/auth'
import { db } from '@server/db'
import { posts, users } from '@server/db/schema'

export const postRouter = new Elysia({ prefix: '/post' })
  .get('/all', async () => {
    const postList = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        author: users.name,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt))

    return { posts: postList }
  })
  .post('/create', async ({ request, body, status }) => {
    const session = await auth(request)
    if (!session.user) return status('Unauthorized')
    const { title, content } = body as { title: string; content: string }

    await db.insert(posts).values({
      title,
      content,
      authorId: session.user.id,
    })

    return { message: 'Post created successfully' }
  })
  .delete('/remove/:id', async ({ request, params: { id }, status }) => {
    const session = await auth(request)
    if (!session.user) return status('Unauthorized')

    await db.delete(posts).where(eq(posts.id, id))
    return { message: 'Post deleted successfully' }
  })
