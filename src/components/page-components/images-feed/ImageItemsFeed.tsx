// "use client";

// import { useEffect, useState } from "react";
// import PostCarousel from "@/components/page-components/images-feed/PostCarousel";

// export interface PostItemType {
//   id: string;
//   title: string;
//   url: string;
//   description: string;
//   userName: string;
//   userLogo?: string;
//   images?: { url: string; title?: string }[];
//   showIn?: "images" | "videos";
//   postType?: "web" | "images" | "videos" | "pages";
//   links_or_images?: { url: string; title?: string }[];
//   likes: number;
//   isLiked: boolean;
//   bookmarks: number;
//   isBookmarked: boolean;
//   promo?: string;
//   categories?: string[];
//   pages?: any[];
//   videos?: any[];
//   createdAt?: string;
// }

// export function ImageItemsFeed() {
//   const [postItems, setPostItems] = useState<PostItemType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchPosts() {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/postitem");

//         if (!res.ok) {
//           throw new Error(`Failed to fetch posts: ${res.statusText}`);
//         }

//         const data: PostItemType[] = await res.json();

//         const mappedData = data.map((post) => {
//           let url = post.url || "";
//           let images: { url: string; title?: string }[] = [];

//           if (post.postType === "images") {
//             images = post.links_or_images ?? [];
//           } else if (post.postType === "web") {
//             url = post.links_or_images?.[0]?.url ?? "";
//           }

//           return {
//             ...post,
//             url,
//             images,
//             userLogo: typeof post.userLogo === "string" ? post.userLogo : "",
//           };
//         });

//         setPostItems(mappedData);
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError("An unknown error occurred.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchPosts();
//   }, []);

//   if (loading) return <div className="text-center p-4">Loading posts...</div>;
//   if (error) return <div className="text-center text-red-500 p-4">Error: {error}</div>;

//   return (
//     <main className="flex flex-col items-center">
//       <div className="w-full max-w-6xl mx-auto p-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {postItems.map((post) => (
//             <PostCarousel key={post.id} post={{ ...post, userLogo: post.userLogo ?? "" }} />
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }




"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { fetchImagePostItems } from "../../../features/image-posts/imagePostsThunks"
import { selectImagePostItems, selectImagePostsLoading, selectImagePostsError } from "../../../features/image-posts/imagePostsSelectors"
import { PostCarousel } from "@/components/page-components/images-feed/PostCarousel"
import { ImageItemsSkeleton } from "../skeletons/image-items-skeleton"
import { likePost } from "@/features/actions-like-post/likePostThunks"
import { bookmarkPost } from "@/features/actions-bookmark-post/bookmarkPostThunks"

export function ImageItemsFeed() {
  const dispatch = useAppDispatch()
  const imageItems = useAppSelector(selectImagePostItems)
  const loading = useAppSelector(selectImagePostsLoading)
  const error = useAppSelector(selectImagePostsError)

  useEffect(() => {
    dispatch(fetchImagePostItems())
  }, [dispatch])

  if (loading) {
    return (
      <ImageItemsSkeleton/>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center">

      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {imageItems.map((post: PostItemType) => (
            <PostCarousel
              key={post.id}
              post={post}
              onLike={(id: string) => dispatch(likePost(id))}
              onBookmark={(id: string) => dispatch(bookmarkPost(id))}
            />
            ))}

        </div>
      </div>
    </main>
  )
//   return (
    // <div className="w-full max-w-3xl mx-auto divide-y">
    //   {imageItems.map((item) => (
    //     <PostCarousel
    //     key={item.id}
    //     post={item}
    //     onLike={(id) => console.log("Like:", id)}
    //     onBookmark={(id) => console.log("Bookmark:", id)}
    //   />
    //   ))}
    // </div>
//   )
}

