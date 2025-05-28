



"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import {PostItem} from "./PostItem";
import { WebItemsSkeleton } from "../skeletons/web-items-skeleton";
import { likePost } from "@/features/actions-like-post/likePostThunks";
import { bookmarkPost } from "@/features/actions-bookmark-post/bookmarkPostThunks";

export interface PostItemType {
  id: string;
  title: string;
  url: string;
  description: string;
  userName: string;
  userLogo: string; // ✅ Now always a string
  images?: { url: string; title?: string }[];
  showIn?: "images" | "videos";
  postType?: "web" | "images" | "videos" | "pages";
  links_or_images?: { url: string; title?: string }[];
  likes: number;
  isLiked: boolean;
  bookmarks: number;
  isBookmarked: boolean;
  promo?: boolean;
  categories?: string[];
  pages?: any[];
  videos?: any[];
  createdAt?: string;
}

export function PostItemFeed() {
  const dispatch = useAppDispatch();
  const [postItems, setPostItems] = useState<PostItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const res = await fetch("/api/postitem");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data: PostItemType[] = await res.json();

        const mappedData: PostItemType[] = data.map((post) => {
          let url = "";
          let images: { url: string; title?: string }[] = [];
          let pages: any[] = [];
          let videos: any[] = [];
          let likes = 0;
          let isLiked = false;
          let isBookmarked = false;
          let createdAt = "";

          if (post.postType === "web") {
            url = post.links_or_images?.[0]?.url || "";
          } else if (post.postType === "images") {
            images = post.links_or_images || [];
          } else if (post.postType === "videos") {
            videos = post.links_or_images || [];
          } else if (post.postType === "pages") {
            pages = post.links_or_images || [];
          }

          if ("likes" in post) likes = post.likes;
          if ("isLiked" in post) isLiked = post.isLiked;
          if ("isBookmarked" in post) isBookmarked = post.isBookmarked;
          if ("createdAt" in post) createdAt = post.createdAt || "";

          return {
            ...post,
            url,
            images,
            pages,
            videos,
            likes,
            isLiked,
            isBookmarked,
            createdAt,
            userLogo: post.userLogo ?? "", // ✅ Always provide string fallback
            promo: !!post.promo,
            showIn:
              post.postType === "images"
                ? "images"
                : post.postType === "videos"
                  ? "videos"
                  : undefined,
          };
        });

        setPostItems(mappedData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <WebItemsSkeleton />;
  if (error)
    return (
      <div className="w-full max-w-3xl mx-auto p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );

  return (
    <div className="w-full max-w-3xl mx-auto divide-y">
      {postItems.map((item) => (
        <PostItem
          key={item.id}
          item={{
            ...item,
            userLogo: item.userLogo ?? "/placeholder.svg", // ✅ fallback for TS type safety
            images: item.images
              ? item.images.map((img, idx) => ({
                  id: idx,
                  url: img.url,
                  title: img.title !== undefined && img.title !== null ? img.title : null,
                }))
              : undefined,
            showIn:
              item.showIn === "images"
                ? "images"
                : item.showIn === "videos"
                ? "videos"
                : "web", // Always provide a valid value
            createdAt: item.createdAt ?? "", // Ensure createdAt is always a string
            promo: typeof item.promo === "boolean" ? String(item.promo) : item.promo, // Convert boolean to string if needed
            links_or_images: item.links_or_images
              ? item.links_or_images.map((l) => typeof l === "string" ? l : l.url)
              : undefined, // Ensure links_or_images is string[]
          }}
          onLike={() => dispatch(likePost(item.id))}
          onBookmark={() => dispatch(bookmarkPost(item.id))}
          onShare={() => console.log("Share:", item.id)}
        />
      ))}
    </div>
  );
    
}




// "use client"

// import { useEffect } from "react"
// import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
// import { fetchAllPostsFeed } from "../../../features/feed/feedThunks"
// import { selectPostItems, selectFeedLoading, selectFeedError } from "../../../features/feed/feedSelectors"
// import { PostItem } from "./PostItem"
// import { WebItemsSkeleton } from "../skeletons/web-items-skeleton"
// import { likePost } from "@/features/actions-like-post/likePostThunks"
// import { bookmarkPost } from "@/features/actions-bookmark-post/bookmarkPostThunks"

// export function PostItemFeed() {
//   const dispatch = useAppDispatch()
//   const postItems = useAppSelector(selectPostItems)
//   const loading = useAppSelector(selectFeedLoading)
//   const error = useAppSelector(selectFeedError)

//   useEffect(() => {
//     dispatch(fetchAllPostsFeed())
//   }, [dispatch])

//   if (loading) {
//     <WebItemsSkeleton />
//   }

//   if (error) {
//     return (
//       <div className="w-full max-w-3xl mx-auto p-4">
//         <div className="text-red-500">Error: {error}</div>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full max-w-3xl mx-auto divide-y">
//       {postItems.map((item) => (
//         <PostItem
//           key={item.id}
//           item={item}
//           onLike={(id) => dispatch(likePost(id))}
//           onBookmark={(id) => dispatch(bookmarkPost(id))}
//           onShare={(id) => console.log("Share:", id)}
//         />
//       ))}
//     </div>
//   )
// }

