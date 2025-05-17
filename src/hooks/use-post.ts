import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
    mutationFn: api.post.create.post,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  const deletePost = useMutation({
    mutationKey: ['post', 'delete'],
    mutationFn: (id: string) => api.post.remove({ id }).delete(),
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
