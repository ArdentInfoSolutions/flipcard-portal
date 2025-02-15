"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { fetchWebItems } from "../features/feed/feedThunks"
import { selectWebItems, selectFeedLoading, selectFeedError } from "../features/feed/feedSelectors"
import { WebItem } from "./WebItem"

export function WebItemFeed() {
  const dispatch = useAppDispatch()
  const webItems = useAppSelector(selectWebItems)
  const loading = useAppSelector(selectFeedLoading)
  const error = useAppSelector(selectFeedError)

  useEffect(() => {
    dispatch(fetchWebItems())
  }, [dispatch])

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
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
    <div className="w-full max-w-3xl mx-auto divide-y">
      {webItems.map((item) => (
        <WebItem
          key={item.id}
          item={item}
          onLike={(id) => console.log("Like:", id)}
          onBookmark={(id) => console.log("Bookmark:", id)}
        />
      ))}
    </div>
  )
}

