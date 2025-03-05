"use client"

import TabBar from "../components/common/TabBar"
import { PostItemFeed } from "../components/page-components/all-feed/PostItemFeed"

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div className="hidden md:block w-full">
        <TabBar />
      </div>
      <PostItemFeed />
      <div className="block md:hidden">
        <TabBar />
      </div>
    </main>
  )
}

