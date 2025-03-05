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
          {imageItems.map((post) => (
            <PostCarousel
              key={post.id}
              post={post}
              onLike={(id) => dispatch(likePost(id))}
              onBookmark={(id) => dispatch(bookmarkPost(id))}
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

