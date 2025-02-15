<<<<<<< HEAD
import HomePageFeed from "@/components/HomePageFeed"

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">Website Feed</h1>
      <HomePageFeed />
    </main>
  )
}
=======
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

>>>>>>> fbab2be (commit code)
