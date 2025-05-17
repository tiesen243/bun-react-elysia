import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/lib/api'

export const usePost = () => {
  const queryClient = useQueryClient()
  const queryKey = ['post', 'all']

  const posts = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await api.post.get()
      if (error) throw error.value
      return data
    },
  })

  const addPost = useMutation({
    mutationKey: ['post', 'create'],
    mutationFn: async (values: { title: string; content: string }) => {
      const { response } = await api.post.create.post(values)
      if (!response.ok) toast.error(response.statusText)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  const deletePost = useMutation({
    mutationKey: ['post', 'delete'],
    mutationFn: async (id: string) => {
      const { response } = await api.post.remove({ id }).delete()
      if (!response.ok) toast.error(response.statusText)
    },

    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  return {
    posts: posts.data ?? [],
    isLoading: posts.isLoading,
    addPost: addPost.mutateAsync,
    deletePost: deletePost.mutateAsync,
    isDeleting: deletePost.isPending,
  }
}
