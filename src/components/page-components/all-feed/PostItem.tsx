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

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-3 max-w-3xl mx-auto">
      {/* User Info */}
      <div
        onClick={handleProfileClick}
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 select-none mb-2"
      >
        <UserAvatar
          userLogo={item.photo || item.userLogo}
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

      {/* Title & Post Type */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-bold">{item.title}</h3>
        {item.postType && (
          <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
            {item.postType}
          </span>
        )}
      </div>


      {/* Content */}
      <div className="flex gap-4 items-start mb-2">
        <div className="flex-1 text-gray-700 text-2 leading-tight">
          {item.description}
          {safeUrl && (
            <a
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[8px] text-blue-500 underline break-all"
            >
              {hostname}
              {safeUrl.includes("/") &&
                ` › ${safeUrl.split("/").filter(Boolean).slice(-1)[0]}`}
            </a>
          )}
        </div>

        {(item.postType === "images" || item.postType === "videos") &&
          (item.images?.[0]?.url || item.links_or_images?.[0]) && (
            <div className="w-28 h-28 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 self-start">
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

      {/* Categories (only for web post type) */}
      {item.postType === "web" && (item.categories?.length ?? 0) > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.categories?.map((cat, i) => (
            <span
              key={i}
              className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 text-gray-600 text-xs mt-2">
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

// "use client";

// import Image from "next/image";
// import { Bookmark, Heart, Share } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import type { PostItem as PostItemType } from "../../../lib/types";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import {
//   selectIsPostLiked,
//   selectPostLikes,
// } from "@/features/actions-like-post/likePostSelectors";
// import {
//   selectIsBookmarked,
//   selectBookmarks,
// } from "@/features/actions-bookmark-post/bookmarkPostSelectors";
// import { useAppSelector } from "@/redux/hooks";

// // Util: safely convert to valid URL or return null
// function getSafeUrl(url?: string): string | null {
//   if (!url) return null;
//   try {
//     return new URL(url.startsWith("http") ? url : `https://${url}`).href;
//   } catch {
//     return null;
//   }
// }

// function UserAvatar({
//   userLogo,
//   userName,
//   size = 40,
// }: {
//   userLogo?: string;
//   userName: string;
//   size?: number;
// }) {
//   const fallbackUrl = `https://i.pravatar.cc/${size}?u=${encodeURIComponent(userName)}`;
//   return (
//     <Image
//       src={userLogo || fallbackUrl}
//       alt={userName}
//       width={size}
//       height={size}
//       className="rounded-full object-cover"
//       onError={(e) => {
//         console.warn("UserAvatar image failed, using fallback");
//         (e.currentTarget as HTMLImageElement).src = fallbackUrl;
//       }}
//       unoptimized={false}
//     />
//   );
// }

// interface PostItemProps {
//   item: PostItemType;
//   onLike?: (id: string) => void;
//   onBookmark?: (id: string) => void;
//   onShare?: (id: string) => void;
// }

// export function PostItem({ item, onLike, onBookmark, onShare }: PostItemProps) {
//   const { data: session } = useSession();
//   const router = useRouter();

//   if (!item) {
//     console.error("PostItem: item prop is missing or null!");
//     return null;
//   }

//   const isLiked = useAppSelector((state) =>
//     selectIsPostLiked(state, item.id, item.isLiked ?? false)
//   );
//   const likes = useAppSelector((state) =>
//     selectPostLikes(state, item.id, item.likes ?? 0)
//   );

//   const isBookmarked = useAppSelector((state) =>
//     selectIsBookmarked(state, item.id, item.isBookmarked ?? false)
//   );
//   const bookmarks = useAppSelector((state) =>
//     selectBookmarks(state, item.id, item.bookmarks ?? 0)
//   );

//   const handleAction = (action: () => void) => {
//     if (session) {
//       action();
//     } else {
//       router.push("/login");
//     }
//   };

//   const handleProfileClick = () => {
//     router.push(`/profile/${item.id}`);
//   };

//   const handleLike = () => onLike?.(item.id);
//   const handleBookmark = () => onBookmark?.(item.id);
//   const handleShare = () => onShare?.(item.id);

//   const safeUrl = getSafeUrl(item.url);
//   let hostname = "";
//   if (safeUrl) {
//     hostname = new URL(safeUrl).hostname.replace(/^www\./, "");
//   }

//   const isWebPost = !item.images?.[0]?.url && !item.links_or_images?.[0];

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl shadow-md p-3 max-w-3xl mx-auto ">
//       {/* User Info */}
//       <div
//         onClick={handleProfileClick}
//         className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 select-none mb-2"
//       >
//         <UserAvatar
//           userLogo={item.photo || item.userLogo}
//           userName={item.userName ?? "User"}
//           size={36}
//         />

//         <div>
//           <p className="font-semibold text-xs">{item.userName}</p>
//           {item.createdAt && (
//             <p className="text-[10px] text-gray-500">
//               {new Date(item.createdAt).toLocaleDateString()}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Title */}
//       <h3 className="text-xl font-bold mb-1">{item.title}</h3>

//       {/* Content */}
//       <div className="flex gap-4 items-start mb-2">
//         <div className="flex-1 text-gray-700 text-2 leading-tight">
//           {item.description}
//           {safeUrl && (
//             <a
//               href={safeUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="block  text-[8px] text-blue-500 underline break-all"
//             >
//               {hostname}
//               {safeUrl.includes("/") &&
//                 ` › ${safeUrl.split("/").filter(Boolean).slice(-1)[0]}`}
//             </a>
//           )}
//         </div>
       


       
//         {(item.postType === "images" || item.postType === "videos") &&
//           (item.images?.[0]?.url || item.links_or_images?.[0]) && (
//             <div className="w-28 h-28 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 self-start">
//               <Image
//                 src={
//                   item.images?.[0]?.url || item.links_or_images?.[0] || "/placeholder.svg"
//                 }
//                 alt={item.title || "Post Image"}
//                 width={128}
//                 height={128}
//                 className="w-full h-full object-cover"
//                 unoptimized
//               />
//             </div>
//           )}

//       </div>

//       {/* Actions */}
//       <div className="flex gap-4 text-gray-600 text-xs">
//         <Button
//           variant="outline"
//           className="gap-1 rounded-full border-gray-300 hover:bg-gray-100 flex items-center"
//           onClick={() => handleAction(handleLike)}
//         >
//           <Heart
//             className={`h-3 w-3 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`}
//           />
//           <span>{likes}</span>
//         </Button>

//         <Button
//           variant="outline"
//           className="gap-1 rounded-full border-gray-300 hover:bg-gray-100 flex items-center"
//           onClick={() => handleAction(handleBookmark)}
//         >
//           <Bookmark
//             className={`h-3 w-3 ${isBookmarked ? "text-blue-500 fill-blue-500" : "text-gray-400"}`}
//           />
//           <span>{bookmarks}</span>
//         </Button>

//         <Button
//           variant="outline"
//           className="gap-1 rounded-full border-gray-300 hover:bg-gray-100 flex items-center"
//           onClick={() => handleAction(handleShare)}
//         >
//           <Share className="h-3 w-3 text-gray-400" />
//           Share
//         </Button>
//       </div>
//     </div>
//   );
// }

