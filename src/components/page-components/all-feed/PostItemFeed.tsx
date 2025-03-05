"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { fetchAllPostsFeed } from "../../../features/feed/feedThunks"
import { selectPostItems, selectFeedLoading, selectFeedError } from "../../../features/feed/feedSelectors"
import { PostItem } from "./PostItem"
import { WebItemsSkeleton } from "../skeletons/web-items-skeleton"
import { likePost } from "@/features/actions-like-post/likePostThunks"
import { bookmarkPost } from "@/features/actions-bookmark-post/bookmarkPostThunks"

export function PostItemFeed() {
  const dispatch = useAppDispatch()
  const postItems = useAppSelector(selectPostItems)
  const loading = useAppSelector(selectFeedLoading)
  const error = useAppSelector(selectFeedError)

  useEffect(() => {
    dispatch(fetchAllPostsFeed())
  }, [dispatch])

  if (loading) {
    <WebItemsSkeleton />
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto divide-y">
      {postItems.map((item) => (
        <PostItem
          key={item.id}
          item={item}
          onLike={(id) => dispatch(likePost(id))}
          onBookmark={(id) => dispatch(bookmarkPost(id))}
          onShare={(id) => console.log("Share:", id)}
        />
      ))}
    </div>
  )
}

