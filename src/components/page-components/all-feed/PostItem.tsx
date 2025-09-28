"use client";

import Image from "next/image";
import { Bookmark, Heart, Share , Eye} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PostItem as PostItemType } from "../../../lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {ShareButton} from  "../../common/ShareButton";
import {
  selectIsPostLiked,
  selectPostLikes,
} from "@/features/actions-like-post/likePostSelectors";
import {
  selectIsBookmarked,
  selectBookmarks,
} from "@/features/actions-bookmark-post/bookmarkPostSelectors";
import { useAppSelector } from "@/redux/hooks";

export function getSafeUrl(url?: string): string | null {
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
        (e.currentTarget as HTMLImageElement).src = fallbackUrl;
      }}
      
    />
  );
}

interface PostItemProps {
  item: PostItemType;
  relatedPosts?: PostItemType[];
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onShare?: (id: string) => void;
  onClick?: (item: PostItemType) => void; // 👈 change here

}

export function PostItem({ item,relatedPosts, onLike, onBookmark, onShare, onClick }: PostItemProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!item) return null;

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

  const safeUrl = getSafeUrl(item.url);
  let hostname = "";
  if (safeUrl) {
    hostname = new URL(safeUrl).hostname.replace(/^www\./, "");
  }

  return (
    <div
      className="bg-blue border border-gray-200 rounded-xl shadow-md p-3 max-w-3xl mx-auto w-full cursor-pointer"
      onClick={() => onClick?.(item)} // 👈 whole card clickable
    >
      {/* User (should NOT trigger ImagePostDetail) */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/profile/${item.id}`);
        }}
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
      {/* Title + PostType */}
      <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
        <h3 className="text-base sm:text-lg font-bold">{item.title}</h3>
        {item.postType && item.videothumb && (
          <span className="w-full sm:w-28 h-48 sm:h-28 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
            <img
              src={item.videothumb}
              alt="Preview Missing"
              className="w-full h-full object-cover"
            />
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="flex-1 text-sm text-gray-700 leading-tight break-words">
          {item.description}
          {safeUrl && (
            <span className="block text-[10px] text-blue-500 underline break-words mt-1">
              {hostname}
              {safeUrl.includes("/") &&
                ` › ${safeUrl.split("/").filter(Boolean).slice(-1)[0]}`}
            </span>
          )}
        </div>

        {item.postType === "images" &&
          (item.images?.[0]?.url || item.links_or_images?.[0]) && (
            <div className="w-full sm:w-28 h-48 sm:h-28 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
              <Image
                src={
                  item.images?.[0]?.url ||
                  item.links_or_images?.[0] ||
                  "/placeholder.svg"
                }
                alt={item.title || "Post Image"}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          )}
      </div>

      {/* Action Buttons (don’t trigger ImagePostDetail) */}
      <div className="flex flex-wrap gap-4 text-gray-600 text-xs mt-3">
        <Button
          variant="outline"
          className="gap-1 rounded-full border-gray-300 hover:bg-gray-100 flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            session ? onBookmark?.(item.id) : router.push("/login");
          }}
        >
          <div className="flex items-center gap-1 text-gray-500">
            <Eye className="h-3 w-3" />
            <span>{item.viewcount ?? 0}</span>
          </div>
        </Button>
            <div onClick={(e) => e.stopPropagation()}>
               <ShareButton
                title={item.title}
                url={safeUrl || window.location.href}
              />
            </div>
       
      </div>
      {relatedPosts && relatedPosts.length > 0 && (
  <div className="mt-3 border-t pt-2">
    <p className="text-xs text-gray-500 mb-2">Related Posts</p>
    <div className="flex flex-wrap gap-2">
      {relatedPosts.slice(0, 3).map((rp) => (
        <Button
          key={rp.id}
          variant="outline"
          size="sm"
          className="rounded-full text-xs"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/posts/${rp.id}`);
          }}
        >
          {rp.title.length > 20 ? rp.title.slice(0, 20) + "…" : rp.title}
        </Button>
      ))}
    </div>
  </div>
)}
    </div>
    
  );
}


