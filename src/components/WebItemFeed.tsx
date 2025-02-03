"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  fetchWebItems,
  likeWebItem,
  bookmarkWebItem,
} from "../lib/slices/feedSlice";
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
