import Image from "next/image"
import Link from "next/link"

interface SocialMediaPostProps {
  post: {
    id: string
    userLogo: string
    userName: string
    images: string[]
    likes: number
    isLiked: boolean
    isBookmarked: boolean
  }
}

export default function SocialMediaPost({ post }: SocialMediaPostProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex items-center mb-2">
        <Image
          src={post.userLogo || "/placeholder.svg"}
          alt={post.userName}
          width={40}
          height={40}
          className="rounded-full mr-2"
        />
        <Link href={`/profile/${post.userName}`} className="font-semibold">
          {post.userName}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {post.images.map((image, index) => (
          <Image
            key={index}
            src={image || "/placeholder.svg"}
            alt={`Post image ${index + 1}`}
            width={300}
            height={300}
            className="rounded-lg"
          />
        ))}
      </div>
      <div className="flex justify-between">
        <button className={`${post.isLiked ? "text-red-500" : "text-gray-500"}`}>Like ({post.likes})</button>
        <button className={`${post.isBookmarked ? "text-yellow-500" : "text-gray-500"}`}>Bookmark</button>
        <button className="text-gray-500">Share</button>
      </div>
    </div>
  )
}

