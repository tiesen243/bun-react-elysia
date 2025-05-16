import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card'

export const PostCard: React.FC<{
  post: {
    id: string
    title: string
    content: string
    author: string
    createdAt: Date
  }
}> = ({ post }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>{post.content}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export const PostCardSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="w-1/2 animate-pulse bg-current">&nbsp;</CardTitle>
      <CardDescription className="h-12 w-full animate-pulse bg-current" />
    </CardHeader>
  </Card>
)
