"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchPostItems } from "../../features/posts/postsThunks"
import { selectPostItems, selectPostsLoading, selectPostsError } from "../../features/posts/postsSelectors"
import TabBar from "../../components/TabBar"
import { PostItem } from "../../components/PostItem"

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
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
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {postItems.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onLike={(id) => console.log("Like:", id)}
              onBookmark={(id) => console.log("Bookmark:", id)}
            />
          ))}
        </div>
      </div>
      <div className="block md:hidden">
        <TabBar />
      </div>
    </main>
  )
}

