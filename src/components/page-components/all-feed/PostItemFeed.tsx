"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { PostItem } from "./PostItem";
import { WebItemsSkeleton } from "../skeletons/web-items-skeleton";
import { likePost } from "@/features/actions-like-post/likePostThunks";
import { bookmarkPost } from "@/features/actions-bookmark-post/bookmarkPostThunks";

export interface PostItemType {
  id: string;
  title: string;
  url: string;
  description: string;
  userName: string;
  userLogo: string;
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
          const postType = post.postType; // ✅ use camelCase property as defined in PostItemType
          let url = "";
          let images: { url: string; title?: string }[] = [];
          let pages: any[] = [];
          let videos: any[] = [];
          let likes = post.likes ?? 0;
          let isLiked = post.isLiked ?? false;
          let isBookmarked = post.isBookmarked ?? false;
          let createdAt = post.createdAt ?? "";

          if (postType === "web") {
            url = post.links_or_images?.[0]?.url || "";
          } else if (postType === "images") {
            images = post.links_or_images || [];
          } else if (postType === "videos") {
            videos = post.links_or_images || [];
          } else if (postType === "pages") {
            pages = post.links_or_images || [];
          }

          return {
            ...post,
            postType, // ✅ ensure this exists
            url,
            images,
            pages,
            videos,
            likes,
            isLiked,
            isBookmarked,
            createdAt,
            userLogo: post.userLogo ?? "",
            promo: !!post.promo,
            showIn:
              postType === "images"
                ? "images"
                : postType === "videos"
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
            postType: item.postType ?? "web", // ✅ fix: ensure postType is passed
            userLogo: item.userLogo ?? "/placeholder.svg",
            images: item.images
              ? item.images.map((img, idx) => ({
                id: idx,
                url: img.url,
                title:
                  img.title !== undefined && img.title !== null
                    ? img.title
                    : null,
              }))
              : undefined,
            showIn:
              item.showIn === "images"
                ? "images"
                : item.showIn === "videos"
                  ? "videos"
                  : "web",
            createdAt: item.createdAt ?? "",
            promo:
              typeof item.promo === "boolean"
                ? String(item.promo)
                : item.promo,
            links_or_images: item.links_or_images
              ? item.links_or_images.map((l) =>
                typeof l === "string" ? l : l.url
              )
              : undefined,
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

