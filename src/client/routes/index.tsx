import { useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import { PostCard, PostCardSkeleton } from '@client/components/post-card'
import { Button } from '@client/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from '@client/components/ui/form'
import { Input } from '@client/components/ui/input'
import { Typography } from '@client/components/ui/typography'
import { useSession } from '@client/hooks/use-session'
import { api } from '@client/lib/api'

export function IndexPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['post', 'all'],
    queryFn: async () => {
      const { data, error } = await api.post.all.get()
      if (error) throw error.value
      return data
    },
  })

  const form = useForm({
    schema: z.object({ title: z.string().min(1), content: z.string().min(1) }),
    defaultValues: { title: '', content: '' },
    submitFn: async (values) => {
      const { data, error, response } = await api.post.create.post(values)
      console.log(response)

      if (error) throw new Error(error.value)
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['post', 'all'] })
      form.reset()
    },
  })

  return (
    <main className="container max-w-2xl py-4">
      <Typography variant="h1" className="text-center">
        Create
        <span className="text-[#46120d] dark:text-[#a96249]"> Yuki </span>
        Bun
      </Typography>

      <Typography className="text-center text-lg">
        A type-safe fullstack framework for building web applications.
      </Typography>

      <AuthShowcase />

      <section className="mt-4 flex flex-col gap-4">
        <h2 className="sr-only">Posts List Section</h2>

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

          <Button>Create Post</Button>
        </Form>

        {isLoading
          ? Array.from({ length: 5 }, (_, i) => <PostCardSkeleton key={i} />)
          : data?.posts.map((post) => <PostCard key={post.id} post={post} />)}
      </section>
    </main>
  )
}

const AuthShowcase: React.FC = () => {
  const { status, session, signIn, signOut } = useSession()

  return (
    <section className="mt-4 flex flex-col gap-4">
      <h2 className="sr-only">Authenticating Section</h2>

      {status === 'loading' && <Typography variant="h3">Loading...</Typography>}

      {status === 'unauthenticated' && (
        <Button onClick={() => signIn('google')}>Login</Button>
      )}

      {status === 'authenticated' && (
        <div className="flex justify-between">
          <Typography variant="h3">Welcome, {session.user.name}</Typography>
          <Button variant="secondary" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      )}
    </section>
  )
}
