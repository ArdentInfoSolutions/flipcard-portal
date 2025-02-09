"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchWebItems,
  likeWebItem,
  bookmarkWebItem,
} from "../features/feed/index";
import HomePageItem from "./HomePageItem";
import Link from "next/link";
import { List } from "@mui/material";

export default function HomePageFeed() {
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
        <div className="mt-10 grid gap-10 md:grid-cols-1 lg:gap-10 xl:grid-cols-1 ">
          <List disablePadding>
        {webItems.slice(2).map((item) => (
          <HomePageItem
            key={item.id}
            item={item}
            onLike={handleLike}
            onBookmark={handleBookmark}
          />
        ))}
      </List>
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
