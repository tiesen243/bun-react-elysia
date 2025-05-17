import { type } from 'arktype'
import { XIcon } from 'lucide-react'

import type { posts } from '@/server/db/schema'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { usePost } from '@/hooks/use-post'

export function IndexPage() {
  const { posts } = usePost()

  return (
    <main className="container grid max-w-xl gap-4 py-4">
      <CreatePost />
      <h1 className="text-2xl font-bold">Posts</h1>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  )
}

const CreatePost: React.FC = () => {
  const { addPost } = usePost()
  const form = useForm({
    schema: type({ title: 'string>1', content: 'string>1' }),
    defaultValues: { title: '', content: '' },
    submitFn: addPost,
    onSuccess: () => {
      form.reset()
    },
  })

  return (
    <Form form={form}>
      <FormField
        name="title"
        render={(field) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl {...field}>
              <Input />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="content"
        render={(field) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl {...field}>
              <Input />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button disabled={form.isPending}>Create</Button>
    </Form>
  )
}

const PostCard: React.FC<{
  post: typeof posts.$inferSelect
}> = ({ post }) => {
  const { deletePost } = usePost()

  return (
    <Card key={post.id}>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.createdAt.toString()}</CardDescription>
        <CardAction>
          <Button onClick={() => deletePost(post.id)}>
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>

      <CardFooter>{post.content}</CardFooter>
    </Card>
  )
}
