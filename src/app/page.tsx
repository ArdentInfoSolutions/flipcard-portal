"use client"

import TabBar from "../components/TabBar"
import { WebItemFeed } from "../components/WebItemFeed"

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div className="hidden md:block w-full">
        <TabBar />
      </div>
      <WebItemFeed />
      <div className="block md:hidden">
        <TabBar />
      </div>
    </main>
  )
}

