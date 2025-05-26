import Image from "next/image"
import { Bookmark, Heart, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PostItem as PostItemType } from "../../../lib/types"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  selectIsPostLiked,
  selectPostLikes,
} from "@/features/actions-like-post/likePostSelectors"
import {
  selectIsBookmarked,
  selectBookmarks,
} from "@/features/actions-bookmark-post/bookmarkPostSelectors"
import { useAppSelector } from "@/redux/hooks"

interface PostItemProps {
  item: PostItemType
  onLike?: (id: string) => void
  onBookmark?: (id: string) => void
  onShare?: (id: string) => void
}

export function PostItem({ item, onLike, onBookmark, onShare }: PostItemProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const isLiked = useAppSelector((state) =>
    selectIsPostLiked(state, item.id, item.isLiked ?? false)
  )
  const likes = useAppSelector((state) =>
    selectPostLikes(state, item.id, item.likes ?? 0)
  )

  const isBookmarked = useAppSelector((state) =>
    selectIsBookmarked(state, item.id, item.isBookmarked ?? false)
  )
  const bookmarks = useAppSelector((state) =>
    selectBookmarks(state, item.id, item.bookmarks ?? 0)
  )

  const handleAction = (action: () => void) => {
    if (session) {
      action()
    } else {
      router.push("/login")
    }
  }

  const handleProfileClick = () => {
    router.push(`/profile/${item.id}`)
  }

  const handleLike = () => onLike?.(item.id)
  const handleBookmark = () => onBookmark?.(item.id)
  const handleShare = () => onShare?.(item.id)

  let hostname = ""
  try {
    hostname = new URL(item.url).hostname.replace("www.", "")
  } catch {
    hostname = ""
  }

  if (!item) return null

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="p-4">
        {/* Profile */}
        <div
          onClick={handleProfileClick}
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
        >
          <Image
            src={item.userLogo || "/placeholder.svg"}
            alt={item.userName || "User"}
            width={32}
            height={32}
            className="rounded-full object-cover"
            unoptimized={false} // Use optimization for internal or whitelisted images
          />
          <span className="font-medium text-sm">
            {item.userName || "Unknown"}
          </span>
        </div>

        {/* Content + Image */}
        <div className="flex gap-4 mt-4">
          {/* Text Left */}
          <div className="flex-1">
            <h3 className="text-base font-semibold mb-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {item.title}
              </a>
            </h3>
            {item.description && (
              <p className="text-sm text-gray-700 mb-2">{item.description}</p>
            )}
            {hostname && (
              <div className="text-xs text-gray-500">
                {hostname}
                {item.url.includes("/")
                  ? ` › ${item.url.split("/").filter(Boolean).slice(-1)[0]}`
                  : ""}
              </div>
            )}
          </div>

          {/* Right Side Image */}
          {item.images?.length > 0 && (
            <div className="w-32 h-32 shrink-0 ml-auto rounded-md overflow-hidden shadow-md">
              <Image
                src={item.images[0].url || "/placeholder.svg"}
                alt={item.images[0].title || "Preview"}
                width={128}
                height={128}
                className="object-cover"
                unoptimized={false} // optimize if domain is allowed, else true
                placeholder="blur"
                blurDataURL="/placeholder.svg" // small blurred placeholder while loading
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 pt-4">
          <Button
            variant="outline"
            className="gap-2 rounded-full border-gray-300 hover:bg-gray-100"
            onClick={() => handleAction(handleLike)}
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
                }`}
            />
            {likes}
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-full border-gray-300 hover:bg-gray-100"
            onClick={() => handleAction(handleBookmark)}
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked ? "text-blue-500 fill-blue-500" : "text-gray-400"
                }`}
            />
            {bookmarks}
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-full border-gray-300 hover:bg-gray-100"
            onClick={() => handleAction(handleShare)}
          >
            <Share className="h-4 w-4 text-gray-400" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}




// import Image from "next/image"
// import { Bookmark, Check, Heart, MoreVertical, Share } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import type { PostItem as PostItemType } from "../../../lib/types"
// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { selectIsPostLiked, selectPostLikes } from "@/features/actions-like-post/likePostSelectors"
// import { selectIsBookmarked, selectBookmarks } from "@/features/actions-bookmark-post/bookmarkPostSelectors"
// import { useAppSelector } from "@/redux/hooks"

// interface PostItemProps {
//   item: PostItemType
//   onLike?: (id: string) => void
//   onBookmark?: (id: string) => void
//   onShare?: (id: string) => void
// }

// export function PostItem({ item, onLike, onBookmark, onShare }: PostItemProps) {
//   const hostname = new URL(item.url).hostname.replace("www.", "")
//   const { data: session } = useSession()
//   const router = useRouter()
  
//   const isLiked = useAppSelector((state) => selectIsPostLiked(state, item.id, item.isLiked ?? false));
//   const likes = useAppSelector((state) => selectPostLikes(state, item.id, item.likes ?? 0));

//   const isBookmarked = useAppSelector((state) => selectIsBookmarked(state, item.id, item.isBookmarked ?? false));
//   const bookmarks = useAppSelector((state) => selectBookmarks(state, item.id, item.bookmarks ?? 0));

//   const handleAction = (action: () => void) => {
//     if (session) {
//       console.log("Action:", action)
//       action()
//     } else {
//       router.push("/login")
//     }
//   }

//   const handleProfileClick = (id: string) => {
//     router.push(`/profile/${id}`); // Passing ID as a query parameter
//   };

//    // Like handler
//    const handleLike = () => {
//      console.log("Like:", item.id);
//     onLike?.(item.id);
//   };

//   const handleBookmark = () => {
//     console.log("Bookmark:", item.id);
//     onBookmark?.(item.id);
//   };


//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       <div className="p-4">
//         <div className="flex items-center justify-between mb-2">
//           <div
//             onClick={() => handleProfileClick(item.id)} // Passing ID as a query parameter
//             className="flex items-center cursor-pointer hover:bg-gray-100">
//             {/* <Avatar className="h-20 w-20">
//                 <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
//                 <AvatarFallback>{user.name[0]}</AvatarFallback>
//             </Avatar> */}
//             <Image
//               src={item.userLogo || "/placeholder.svg"}
//               alt={item.userName}
//               width={32}
//               height={32}
//               className="rounded-full mr-2"
//             />
//             <span className="font-medium text-sm">{item.userName}</span>
//           </div>
//           {/* <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="h-8 w-8">
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => handleAction(() => onLike?.(item.id))}>
//                 {item.isLiked ? "Unlike" : "Like"}
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => handleAction(() => onBookmark?.(item.id))}>
//                 {item.isBookmarked ? "Remove Bookmark" : "Bookmark"}
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => handleAction(() => console.log("Share:", item.id))}>
//                 Share
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu> */}
//         </div>
//         <div className="flex gap-4">
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
//               <a
//                 href={item.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:underline"
//               >
//                 {item.title}
//               </a>
//               {/* <Check className="h-4 w-4 text-blue-500" /> */}
//             </h3>
//             <p className="text-sm text-gray-600 mb-2">{item.description}</p>
//             <div className="text-xs text-gray-500">
//               {hostname} › {item.url.split("/").filter(Boolean).slice(-1)[0]}
//             </div>
//           </div>
//           {item.showIn === "images" && item.images && (
//             <div className="w-24 h-24">
//               <Image
//                 src={item.images[0].url || "/placeholder.svg"}
//                 alt={item.images[0].title || `Image for ${item.title}`} 
//                 width={96}
//                 height={96}
//                 className="object-cover rounded-md"
//               />
//             </div>
//           )}
//           {item.showIn === "videos" && item.images && (
//             <div className="w-24 h-24">
//               <Image
//                 src={item.images[0].url || "/placeholder.svg"}
//                 alt={item.images[0].title || `Image for ${item.title}`} 
//                 width={96}
//                 height={96}
//                 className="object-cover rounded-md"
//               />
//             </div>
//           )}
//         </div>
//         {/* Action Buttons */}
//       <div className="flex items-start gap-10 pt-4">
//         <Button
//           variant="outline"
//           className="gap-2 rounded-full border-gray-300 hover:bg-gray-100"
//           onClick={() => handleAction(handleLike)}
//         >
//           <Heart className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
//           {likes}
//         </Button>
//         <Button
//           variant="outline"
//           className="gap-2 rounded-full border-gray-300 hover:bg-gray-100"
//           onClick={() => handleAction(handleBookmark)}
//         >
//           <Bookmark className={`h-4 w-4 ${isBookmarked ? "text-blue-500 fill-blue-500" : "text-gray-400"}`} />
//           {bookmarks}
//         </Button>
//         <Button
//           variant="outline"
//           className="gap-2 rounded-full border-gray-300 hover:bg-gray-100"
//           onClick={() => handleAction(() => onShare?.(item.id))}
//         >
//           <Share className="h-4 w-4 text-gray-400" />
//           {"Share" }
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }

