import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

export function IndexPage() {
  const queryClient = useQueryClient()

  const posts = useQuery({
    queryKey: ['post', 'all'],
    queryFn: async () => {
      const { data, error } = await api.post.get()
      if (error) throw error.value
      return data
    },
  })

  const addPost = useMutation({
    mutationKey: ['post', 'create'],
    mutationFn: api.post.post,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['post', 'all'] }),
  })

  return (
    <main className="container">
      <Button
        className="mb-4"
        onClick={() => {
          addPost.mutate({
            title: 'Hello World',
            content: 'This is a test post',
          })
        }}
        disabled={addPost.isPending}
      >
        {addPost.isPending ? 'Creating...' : 'Create Post'}
      </Button>

      <pre className="bg-secondary max-h-[400px] max-w-md overflow-auto rounded-sm p-4">
        {JSON.stringify(posts.data, null, 2)}
      </pre>
    </main>
  )
}
