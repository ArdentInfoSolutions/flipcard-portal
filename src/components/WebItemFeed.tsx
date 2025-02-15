<<<<<<< HEAD
"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchWebItems,
  likeWebItem,
  bookmarkWebItem,
} from "../features/feed/index";
import WebItem from "./WebItem";
import Link from "next/link";

export default function WebItemFeed() {
  const dispatch = useAppDispatch();
  const { webItems, loading, error } = useAppSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchWebItems());
  }, [dispatch]);

  const handleLike = (id: string) => {
    dispatch(likeWebItem(id));
  };

  const handleBookmark = (id: string) => {
    dispatch(bookmarkWebItem(id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {webItems && 
        (<div>
      <div className="grid gap-10 md:grid-cols-2 lg:gap-10 ">
        {webItems.slice(0, 2).map((item, index) => (
          <div
            key={item.id}
            className={"col-span-1"}>
            <WebItem
              key={item.id}
              item={item}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3 ">
        {webItems.slice(2).map((item) => (
          <WebItem
            key={item.id}
            item={item}
            onLike={handleLike}
            onBookmark={handleBookmark}
          />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          href="/archive"
          className="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300"
        >
          <span>View all Posts</span>
        </Link>
        </div>
        </div>)}
    </>
  );
}
=======
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

>>>>>>> fbab2be (commit code)
