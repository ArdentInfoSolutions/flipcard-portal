"use client"

import { useParams } from "next/navigation"
import PostItemForm from "@/components/page-components/create-post/PostItemForm"
import Image from "next/image"

export default function CreatePostPage() {
  const params = useParams()
  const type = params.type as "web" | "images" | "videos"
  // Define an image URL based on post type
  const imageMap: Record<typeof type, string> = {
    web: "/images/web-post-banner.jpg",
    images: "/images/image-post-banner.jpg",
    videos: "/images/video-post-banner.jpg",
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Display Image */}
      <Image 
        src={imageMap[type]} 
        alt={`${type} post banner`} 
        fill
        className="w-full h-48 object-cover rounded-lg mb-6"
      />
      <PostItemForm showIn={type} />
    </div>
  )
}
 
