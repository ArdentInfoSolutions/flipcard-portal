"use client"

import TabBar from "../../components/common/TabBar"
import { WebItemFeed } from "../../components/page-components/web-feed/WebItemFeed"
import OtherApp from "../../components/appcomponents/OtherApp"

export default function WebPage() {
  return (
    <main className="flex flex-col items-center">
      <div className="hidden md:block w-full">
        <TabBar />
      </div>
        <OtherApp/>
        <WebItemFeed />
      <div className="block md:hidden">
        <TabBar />
      </div>
    </main>
  )
}

