import { t } from 'elysia'

import { e } from '../elysia'
import { posts } from './db.json' with { type: 'json' }

// Define the type of a post
interface Post {
  id: number
  title: string
  content?: string
}

// Make sure posts array is properly typed
const typedPosts = posts as Post[]
let nextId =
  typedPosts.length > 0 ? Math.max(...typedPosts.map((p) => p.id)) + 1 : 1

export const postRouter = e({ prefix: '/post' })
  // Create a post
  .post(
    '/',
    ({ body }) => {
      const post: Post = {
        id: nextId++,
        title: body.title,
        content: body.content,
      }
      typedPosts.push(post)
      return { success: true, post }
    },
    { body: t.Object({ title: t.String(), content: t.String() }) },
  )

  // Get all posts
  .get('/', () => {
    return typedPosts
  })

  // Get post by id
  .get('/:id', ({ params }) => {
    const id = parseInt(params.id)
    const post = typedPosts.find((p) => p.id === id)

    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    return post
  })

  // Delete post
  .delete('/:id', ({ params }) => {
    const id = parseInt(params.id)
    const postIndex = typedPosts.findIndex((p) => p.id === id)

    if (postIndex === -1) {
      return new Response('Post not found', { status: 404 })
    }

    const deleted = typedPosts.splice(postIndex, 1)[0]
    return { success: true, deleted }
  })
