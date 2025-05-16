import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card'
import { api } from '@client/lib/api'
import { Button } from './ui/button'

export const PostCard: React.FC<{
  post: {
    id: string
    title: string
    content: string
    author: string
    createdAt: Date
  }
}> = ({ post }) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationKey: ['post', 'remove'],
    mutationFn: async (_: React.MouseEvent) => {
      const { data, error } = await api.post.remove({ id: post.id }).delete()
      if (error) throw new Error('Failed to delete post')
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['post', 'all'] })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>
          {post.author} - {new Date(post.createdAt).toLocaleDateString()}
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            onClick={mutate}
            disabled={isPending}
          >
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <p>{post.content}</p>
      </CardContent>
    </Card>
  )
}

export const PostCardSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="w-1/2 animate-pulse rounded-sm bg-current">
        &nbsp;
      </CardTitle>
      <CardDescription className="w-2/3 animate-pulse rounded-sm bg-current">
        &nbsp;
      </CardDescription>
      <CardAction className="size-9 animate-pulse rounded-sm bg-current" />
    </CardHeader>

    <CardContent className="flex flex-col gap-1">
      <p className="w-full animate-pulse rounded-sm bg-current">&nbsp;</p>
      <p className="w-full animate-pulse rounded-sm bg-current">&nbsp;</p>
      <p className="w-full animate-pulse rounded-sm bg-current">&nbsp;</p>
    </CardContent>
  </Card>
)
