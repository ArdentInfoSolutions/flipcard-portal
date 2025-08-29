"use client";

import Image from "next/image";
import { Bookmark, Heart, Share } from "lucide-react";
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
        (e.currentTarget as HTMLImageElement).src = fallbackUrl;
      }}
      
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
    <div className="bg-blue border border-gray-200 rounded-xl shadow-md p-3 max-w-3xl mx-auto w-full">
      {/* User */}
      <div
        onClick={() => router.push(`/profile/${item.id}`)}
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 select-none mb-2"
      >
        
        <UserAvatar userLogo={item.photo || item.userLogo} userName={item.userName ?? "User"} size={36} />
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
        <h3 className="text-base sm:text-lg font-bold">
          {safeUrl ? ( 
          <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {item.title}
          </a>
          ): (
          <span>{item.title}</span>
          )}
          </h3>
        {item.postType && (item.videothumb != "") && (
          <span className="w-full sm:w-28 h-48 sm:h-28 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
            
            <img 
            src= {item.videothumb}
            alt="Preview Missing"
            width={128}
            height={128}
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
            <a
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[10px] text-blue-500 underline break-words mt-1"
            >
              {hostname}
              {safeUrl.includes("/") &&
                ` › ${safeUrl.split("/").filter(Boolean).slice(-1)[0]}`}
            </a>
          )}
        </div>

        {(item.postType === "images" ) &&
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

      {/* Tags */}
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

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 text-gray-600 text-xs mt-3">
        

        <Button
          variant="outline"
          className="gap-1 rounded-full border-gray-300 hover:bg-gray-100 flex items-center"
          onClick={() => session ? onBookmark?.(item.id) : router.push("/login")}
        >
          <Bookmark className={`h-3 w-3 ${isBookmarked ? "text-blue-500 fill-blue-500" : "text-gray-400"}`} />
          <span>{bookmarks}</span>
        </Button>

        <ShareButton
                        title={item.title}
                        url={window.location.href}
                        />
      </div>
    </div>
  );
}

