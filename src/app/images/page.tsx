<<<<<<< HEAD
import SocialMediaFeed from "../../components/SocialMediaFeed"

export default function Images() {
  return (
    <main className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">Social Media Feed</h1>
      <SocialMediaFeed />
=======
"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchPostItems } from "../../features/posts/postsThunks"
import { selectPostItems, selectPostsLoading, selectPostsError } from "../../features/posts/postsSelectors"
import TabBar from "../../components/TabBar"
import { PostItem } from "../../components/PostItem"
import {Carousel}  from "../../components/Carousel"
import { Container } from "postcss"
import {PostCarousel} from "../../components/PostCarousel"

export default function Images() {
  const dispatch = useAppDispatch()
  const postItems = useAppSelector(selectPostItems)
  const loading = useAppSelector(selectPostsLoading)
  const error = useAppSelector(selectPostsError)

  

  useEffect(() => {
    dispatch(fetchPostItems())
  }, [dispatch])

  if (loading) {
    return (
      <main className="flex flex-col items-center">
        <div className="hidden md:block w-full">
          <TabBar />
        </div>
        <div className="w-full max-w-6xl mx-auto p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-video relative w-full bg-gray-200 h-[400px] rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <div className="block md:hidden">
          <TabBar />
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex flex-col items-center">
        <div className="hidden md:block w-full">
          <TabBar />
        </div>
        <div className="w-full max-w-6xl mx-auto p-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
        <div className="block md:hidden">
          <TabBar />
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col items-center">
      <div className="hidden md:block w-full">
        <TabBar />
      </div>
      <div className="w-full max-w-6xl mx-auto p-8">
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 gap-y-4">
          {postItems.map((post) => (
            <div key={post.id} className="aspect-video p-1">
              <PostCarousel
              key={post.id}
                post={post}
                onLike={(id) => console.log("Like:", id)}
                onBookmark={(id) => console.log("Bookmark:", id)}
              />
              </div>
            // 
            // <PostItem
            //   key={post.id}
            //   post={post}
            //   onLike={(id) => console.log("Like:", id)}
            //   onBookmark={(id) => console.log("Bookmark:", id)}
            // />
          ))}
        </div>
      </div>
      <div className="block md:hidden">
        <TabBar />
      </div>
>>>>>>> fbab2be (commit code)
    </main>
  )
}

