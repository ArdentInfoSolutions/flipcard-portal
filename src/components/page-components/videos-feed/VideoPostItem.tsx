import Image from "next/image"
import { Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PostItem as PostItemType } from "../../../lib/types"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"
import { selectIsPostLiked, selectPostLikes } from "@/features/actions-like-post/likePostSelectors"
import { selectBookmarks, selectIsBookmarked } from "@/features/actions-bookmark-post/bookmarkPostSelectors"

interface VideoPostItemProps {
  post: PostItemType
  onLike?: (id: string) => void
  onBookmark?: (id: string) => void
}

export function VideoPostItem({ post, onLike, onBookmark }: VideoPostItemProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const isLiked = useAppSelector((state) => selectIsPostLiked(state, post.id, post.isLiked ?? false));
  const likes = useAppSelector((state) => selectPostLikes(state, post.id, post.likes ?? 0));
  
  const isBookmarked = useAppSelector((state) => selectIsBookmarked(state, post.id, post.isBookmarked ?? false));
  const bookmarks = useAppSelector((state) => selectBookmarks(state, post.id, post.bookmarks ?? 0));
  
  const handleAction = (action: () => void) => {
    if (session) {
      console.log("Action:", action)
      action()
    } else {
      router.push("/login")
    }
  }

  const handleLike = () => {
    console.log("Like:", post.id);
    onLike?.(post.id);
  };

  const handleBookmark = () => {
    console.log("Bookmark:", post.id);
    onBookmark?.(post.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      {post.images && post.images.length > 0 && (
        <div className="relative aspect-video">
          <Image
            src={post.images[0].url || "/placeholder.svg"}
            alt={post.images[0].title || `Image for ${post.title}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <div className="p-4 flex-grow">
        <div className="flex items-center mb-2">
          <Image
            src={post.userLogo || "/placeholder.svg"}
            alt={post.userName}
            width={40}
            height={40}
            className="rounded-full mr-2"
          />
          <span className="font-semibold">{post.userName}</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-sm text-gray-700 mb-2">{post.description || post.promo}</p>
      </div>
      <div className="p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(handleLike)}
          className={post.isLiked ? "text-red-500" : "text-gray-500"}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
          {likes}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleAction(handleBookmark)}
          className={post.isBookmarked ? "text-blue-500" : "text-gray-500"}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "text-blue-500 fill-blue-500" : "text-gray-400"}`} />
          {bookmarks}
        </Button>
      </div>
    </div>
  )
}

