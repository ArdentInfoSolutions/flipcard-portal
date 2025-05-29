"use client";

import Image from "next/image";
import { Bookmark, Heart, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PostItem as PostItemType } from "../../../lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  selectIsPostLiked,
  selectPostLikes,
} from "@/features/actions-like-post/likePostSelectors";
import {
  selectIsBookmarked,
  selectBookmarks,
} from "@/features/actions-bookmark-post/bookmarkPostSelectors";
import { useAppSelector } from "@/redux/hooks";

// Util: safely convert to valid URL or return null
function getSafeUrl(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).href;
  } catch {
    return null;
  }
}

function UserAvatar({
  userLogo,
  userName,
  size = 40,
}: {
  userLogo?: string;
  userName: string;
  size?: number;
}) {
  const fallbackUrl = `https://i.pravatar.cc/${size}?u=${encodeURIComponent(userName)}`;
  return (
    <Image
      src={userLogo || fallbackUrl}
      alt={userName}
      width={size}
      height={size}
      className="rounded-full object-cover"
      onError={(e) => {
        console.warn("UserAvatar image failed, using fallback");
        (e.currentTarget as HTMLImageElement).src = fallbackUrl;
      }}
      unoptimized={false}
    />
  );
}

interface PostItemProps {
  item: PostItemType;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onShare?: (id: string) => void;
}

export function PostItem({ item, onLike, onBookmark, onShare }: PostItemProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!item) {
    console.error("PostItem: item prop is missing or null!");
    return null;
  }

  const isLiked = useAppSelector((state) =>
    selectIsPostLiked(state, item.id, item.isLiked ?? false)
  );
  const likes = useAppSelector((state) =>
    selectPostLikes(state, item.id, item.likes ?? 0)
  );

  const isBookmarked = useAppSelector((state) =>
    selectIsBookmarked(state, item.id, item.isBookmarked ?? false)
  );
  const bookmarks = useAppSelector((state) =>
    selectBookmarks(state, item.id, item.bookmarks ?? 0)
  );

  const handleAction = (action: () => void) => {
    if (session) {
      action();
    } else {
      router.push("/login");
    }
  };

  const handleProfileClick = () => {
    router.push(`/profile/${item.id}`);
  };

  const handleLike = () => onLike?.(item.id);
  const handleBookmark = () => onBookmark?.(item.id);
  const handleShare = () => onShare?.(item.id);

  const safeUrl = getSafeUrl(item.url);
  let hostname = "";
  if (safeUrl) {
    hostname = new URL(safeUrl).hostname.replace(/^www\./, "");
  }

  const isWebPost = !item.images?.[0]?.url && !item.links_or_images?.[0];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-3 max-w-3xl mx-auto space-y-2">
      {/* User Info */}
      <div
        onClick={handleProfileClick}
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 select-none"
      >
        <UserAvatar
          userLogo={item.userLogo}
          userName={item.userName ?? "User"}
          size={36}
        />
        <div>
          <p className="font-semibold text-xs">{item.userName}</p>
          {item.createdAt && (
            <p className="text-[10px] text-gray-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold">{item.title}</h3>

      {/* Content */}
      <div className="flex gap-4 items-start">
        <div className="flex-1 text-gray-700 text-l leading-tight">
          {item.description}
          {safeUrl && (
            <a
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-1 text-[9px] text-blue-500 underline break-all"
            >
              {hostname}
              {safeUrl.includes("/") &&
                ` › ${safeUrl.split("/").filter(Boolean).slice(-1)[0]}`}
            </a>
          )}
        </div>

        {!isWebPost && (item.images?.[0]?.url || item.links_or_images?.[0]) && (
          <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
            <Image
              src={
                item.images?.[0]?.url || item.links_or_images?.[0] || "/placeholder.svg"
              }
              alt={item.title || "Post Image"}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 text-gray-600 text-xs">
        <Button
          variant="outline"
          className="gap-1 rounded-full border-gray-300 hover:bg-gray-100 flex items-center"
          onClick={() => handleAction(handleLike)}
        >
          <Heart
            className={`h-3 w-3 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`}
          />
          <span>{likes}</span>
        </Button>

        <Button
          variant="outline"
          className="gap-1 rounded-full border-gray-300 hover:bg-gray-100 flex items-center"
          onClick={() => handleAction(handleBookmark)}
        >
          <Bookmark
            className={`h-3 w-3 ${isBookmarked ? "text-blue-500 fill-blue-500" : "text-gray-400"}`}
          />
          <span>{bookmarks}</span>
        </Button>

        <Button
          variant="outline"
          className="gap-1 rounded-full border-gray-300 hover:bg-gray-100 flex items-center"
          onClick={() => handleAction(handleShare)}
        >
          <Share className="h-3 w-3 text-gray-400" />
          Share
        </Button>
      </div>
    </div>
  );
}


// "use client"
// import Image from "next/image"
// import { Bookmark, Heart, Share } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import type { PostItem as PostItemType } from "../../../lib/types"
// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import {
//   selectIsPostLiked,
//   selectPostLikes,
// } from "@/features/actions-like-post/likePostSelectors"
// import {
//   selectIsBookmarked,
//   selectBookmarks,
// } from "@/features/actions-bookmark-post/bookmarkPostSelectors"
// import { useAppSelector } from "@/redux/hooks"


// interface PostItemProps {
//   item: PostItemType
//   onLike?: (id: string) => void
//   onBookmark?: (id: string) => void
//   onShare?: (id: string) => void
// }

// export function PostItem({ item, onLike, onBookmark, onShare }: PostItemProps) {
//   const { data: session } = useSession()
//   const router = useRouter()

//   const isLiked = useAppSelector((state) =>
//     selectIsPostLiked(state, item.id, item.isLiked ?? false)
//   )
//   const likes = useAppSelector((state) =>
//     selectPostLikes(state, item.id, item.likes ?? 0)
//   )
//   const showImagePreview = item.showIn === "images" || item.showIn === "videos";

//   const isBookmarked = useAppSelector((state) =>
//     selectIsBookmarked(state, item.id, item.isBookmarked ?? false)
//   )
//   const bookmarks = useAppSelector((state) =>
//     selectBookmarks(state, item.id, item.bookmarks ?? 0)
//   )

//   const handleAction = (action: () => void) => {
//     if (session) {
//       action()
//     } else {
//       router.push("/login")
//     }
//   }

//   const handleProfileClick = () => {
//     router.push(`/profile/${item.id}`)
//   }
//   console.log(item);

//   const handleLike = () => onLike?.(item.id)
//   const handleBookmark = () => onBookmark?.(item.id)
//   const handleShare = () => onShare?.(item.id)

//   let hostname = ""
//   try {
//     hostname = new URL(item.url).hostname.replace("www.", "")
//   } catch {
//     hostname = ""
//   }

//   if (!item) return null


//   // return (
//   //   <div className="w-32 h-32 shrink-0 ml-auto rounded-md overflow-hidden shadow-md">
//   //     <Image
//   //       src={item.images && item.images.length > 0 && item.images[0].url ? item.images[0].url : "/placeholder.svg"}
//   //       alt={item.images && item.images.length > 0 ? (item.images[0].title || "Preview") : "Placeholder"}
//   //       width={128}
//   //       height={128}
//   //       className="object-cover"
//   //       placeholder="blur"
//   //       blurDataURL="/placeholder.svg"
//   //     />
//   //   </div>
//   // )
  

//   return (
    
    
//     <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
//       <div className="p-4">
//         {/* Profile */}
//         <div
//           onClick={handleProfileClick}
//           className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
//         >
//           <Image
//             src={item.userLogo || "/placeholder.svg"}
//             alt={item.userName || "User"}
//             width={32}
//             height={32}
//             className="rounded-full object-cover"
//             unoptimized={false} // Use optimization for internal or whitelisted images
//           />
//           <span className="font-medium text-sm">
//             {item.userName}
//           </span>
//         </div>

//         {/* Content + Image */}
//         <div className="flex gap-4 mt-4 items-start p-4 bg-white rounded-lg shadow border hover:shadow-md transition">
//           {/* Text Content */}
//           <div className="flex-1">
//             <h3 className="text-base font-semibold mb-1">
//               <a
//                 href={item.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:underline"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {item.title}
//               </a>
//             </h3>

//             {item.description && (
//               <p className="text-sm text-gray-700 mb-2">{item.description}</p>
//             )}

//             {hostname && (
//               <div className="text-xs text-gray-500">
//                 {hostname}
//                 {item.url.includes("/") &&
//                   ` › ${item.url.split("/").filter(Boolean).slice(-1)[0]}`}
//               </div>
//             )}
//           </div>

//           {/* Image Preview — render only if valid */}
//           {item.images?.[0]?.url || item.links_or_images?.[0] ? (
//             <div className="w-32 h-32 shrink-0 rounded-lg overflow-hidden border border-gray-200">
//               <Image
//                 src={item.images?.[0]?.url || item.links_or_images?.[0] || "/placeholder.svg"}
//                 alt={item.title || "Post Image"}
//                 width={128}
//                 height={128}
//                 className="w-full h-full object-cover"
//                 unoptimized
//               />
//             </div>
//           ) : null}
//         </div>


//         {/* Actions */}
//         <div className="flex items-center gap-6 pt-4">
//           <Button
//             variant="outline"
//             className="gap-2 rounded-full border-gray-300 hover:bg-gray-100"
//             onClick={() => handleAction(handleLike)}
//           >
//             <Heart
//               className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
//                 }`}
//             />
//             {likes}
//           </Button>
//           <Button
//             variant="outline"
//             className="gap-2 rounded-full border-gray-300 hover:bg-gray-100"
//             onClick={() => handleAction(handleBookmark)}
//           >
//             <Bookmark
//               className={`h-4 w-4 ${isBookmarked ? "text-blue-500 fill-blue-500" : "text-gray-400"
//                 }`}
//             />
//             {bookmarks}
//           </Button>
//           <Button
//             variant="outline"
//             className="gap-2 rounded-full border-gray-300 hover:bg-gray-100"
//             onClick={() => handleAction(handleShare)}
//           >
//             <Share className="h-4 w-4 text-gray-400" />
//             Share
//           </Button>
          
//         </div>
//       </div>
//     </div>
//   )

  
// }


