"use client"

import TabBar from "../../components/common/TabBar"
import { VideoItemsFeed } from "../../components/page-components/videos-feed/VideoItemsFeed"

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div className="hidden md:block w-full">
        <TabBar />
      </div>
      <VideoItemsFeed />
      <div className="block md:hidden">
        <TabBar />
      </div>
    </main>
  )
}
