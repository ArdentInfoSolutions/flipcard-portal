"use client";

import { useEffect, useState } from "react";
import { VideoPostItem } from "../videos-feed/VideoPostItem";

export interface PostItemType {
  id: string;
  title: string;
  url: string;
  description: string;
  userName: string;
  userLogo?: string;
  videos?: { url: string; title?: string }[];
  images?: { url: string; title?: string }[]; // Added images property
  showIn?: "images" | "videos";
  postType?: "web" | "images" | "videos" | "pages";
  links_or_images?: { url: string; title?: string }[];
  likes: number;
  isLiked: boolean;
  bookmarks: number;
  isBookmarked: boolean;
  promo?: string;
  categories?: string[];
  pages?: any[];
  createdAt?: string;
}

export function VideoItemsFeed() {
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

        // Map or transform video data
        const mappedData = data
          .filter((post) => post.postType === "videos")
          .map((post) => {
            const videos = post.links_or_images || [];
            return {
              ...post,
              videos,
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

  if (loading) return <div>Loading video posts...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!postItems.length) return <div>No video posts found.</div>;

  return (
    <main className="flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {postItems.map((post) => (
            <VideoPostItem
              key={post.id}
              post={{
                ...post,
                userLogo: post.userLogo ?? "",
                images: (post.images ?? []).map((img, idx) => ({
                  id: idx,
                  title: img.title ?? null,
                  url: img.url,
                })), // Ensure images property is present and matches LinkItem type
                promo: post.promo ?? "",
                categories: post.categories ?? [],
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}






// "use client"

// import { useEffect } from "react"
// import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
// import { fetchVideoPostItems } from "../../../features/video-posts/videoPostsThunks"
// import { selectVideoPostItems, selectVideoPostsLoading, selectVideoPostsError } from "../../../features/video-posts/videoPostsSelectors"
// import { ImageItemsSkeleton } from "../skeletons/image-items-skeleton"
// import { VideoPostItem } from "./VideoPostItem"
// import { likePost } from "@/features/actions-like-post/likePostThunks"
// import { bookmarkPost } from "@/features/actions-bookmark-post/bookmarkPostThunks"

// export function VideoItemsFeed() {
//   const dispatch = useAppDispatch()
//   const videoItems = useAppSelector(selectVideoPostItems)
//   const loading = useAppSelector(selectVideoPostsLoading)
//   const error = useAppSelector(selectVideoPostsError)

//   useEffect(() => {
//     dispatch(fetchVideoPostItems())
//   }, [dispatch])

//   if (loading) {
//     return (
//       <ImageItemsSkeleton/>
//     )
//   }

//   if (error) {
//     return (
//       <div className="w-full max-w-3xl mx-auto p-4">
//         <div className="text-red-500">Error: {error}</div>
//       </div>
//     )
//   }

//   return (
//     <main className="flex flex-col items-center">

//       <div className="w-full max-w-6xl mx-auto p-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {videoItems.map((post) => (
//             <VideoPostItem
//               key={post.id}
//               post={post}
//               onLike={(id) => dispatch(likePost(id))}
//               onBookmark={(id) => dispatch(bookmarkPost(id))}
//             />
//           ))}
//         </div>
//       </div>
//     </main>
//   )
// //   return (
//     // <div className="w-full max-w-3xl mx-auto divide-y">
//     //   {imageItems.map((item) => (
//     //     <PostCarousel
//     //     key={item.id}
//     //     post={item}
//     //     onLike={(id) => console.log("Like:", id)}
//     //     onBookmark={(id) => console.log("Bookmark:", id)}
//     //   />
//     //   ))}
//     // </div>
// //   )
// }

