"use client"

import { Tabs, Tab } from "@mui/material"
import { usePathname, useRouter } from "next/navigation"
import { Rss, ImageIcon } from "lucide-react"
import type React from "react"

export default function TabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const currentTab = pathname === "/images" ? 1 : 0

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      router.push("/")
    } else {
      router.push("/images")
    }
  }

  return (
    <div className="fixed md:static bottom-0 left-0 right-0 bg-white border-t md:border-t-0 md:border-b">
      <Tabs value={currentTab} onChange={handleChange} centered className="min-h-[60px]">
        <Tab icon={<Rss className="h-4 w-4" />} label="Feed" iconPosition="start" className="min-h-[60px]" />
        <Tab icon={<ImageIcon className="h-4 w-4" />} label="Images" iconPosition="start" className="min-h-[60px]" />
      </Tabs>
    </div>
  )
}

