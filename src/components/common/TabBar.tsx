"use client"

import { Tabs, Tab } from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import { Rss, ImageIcon, Video, Globe2Icon } from "lucide-react"
import type React from "react"

export default function TabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const currentTab = pathname === "/" ? 0 : pathname === "/web" ? 1 : pathname === "/images" ? 2 : pathname === "/videos" ? 3 : 0 

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      router.push("/")
    } else if (newValue === 1) {
      router.push("/web")
    } else if (newValue === 2) {
      router.push("/images")
    } else if (newValue === 3) {
      router.push("/videos")
    }
  }

  return (
    <div className="fixed md:static bottom-0 left-0 right-0 bg-white border-t md:border-t-0 md:border-b">
      <Tabs value={currentTab} onChange={handleChange} centered className="min-h-[60px]">
        <Tab icon={<Rss className="h-4 w-4" />} label="Feed" iconPosition="start" className="min-h-[60px]" />
        <Tab icon={<Globe2Icon className="h-4 w-4" />} label="Web" iconPosition="start" className="min-h-[60px]" />
        <Tab icon={<ImageIcon className="h-4 w-4" />} label="Images" iconPosition="start" className="min-h-[60px]" />
        <Tab icon={<Video className="h-4 w-4" />} label="Videos" iconPosition="start" className="min-h-[60px]" />
      </Tabs>
    </div>
  )
}

