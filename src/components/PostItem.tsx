import Image from "next/image"
import { Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PostItem as PostItemType } from "../lib/types"

interface PostItemProps {
  post: PostItemType
  onLike?: (id: string) => void
  onBookmark?: (id: string) => void
}

export function PostItem({ post, onLike, onBookmark }: PostItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-4 flex-grow">
        <div className="flex items-center mb-2">
          <Image
            src={post.userAvatar || "/placeholder.svg"}
            alt={post.username}
            width={40}
            height={40}
            className="rounded-full mr-2"
          />
          <span className="font-semibold">{post.username}</span>
        </div>
        <p className="text-sm text-gray-700 mb-2">{post.content}</p>
      </div>
      {post.images.length > 0 && (
        <Image
          src={post.images[0] || "/placeholder.svg"}
          alt={`Post image`}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike?.(post.id)}
          className={post.isLiked ? "text-red-500" : "text-gray-500"}
        >
          <Heart className="mr-2 h-4 w-4" />
          {post.likesCount}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onBookmark?.(post.id)}
          className={post.isBookmarked ? "text-blue-500" : "text-gray-500"}
        >
          <Bookmark className="mr-2 h-4 w-4" />
          {post.bookmarksCount}
        </Button>
      </div>
    </div>
  )
}

