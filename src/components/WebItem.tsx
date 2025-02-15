import Image from "next/image"
import { Check, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { WebItem as WebItemType } from "../lib/types"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface WebItemProps {
  item: WebItemType
  onLike?: (id: string) => void
  onBookmark?: (id: string) => void
}

export function WebItem({ item, onLike, onBookmark }: WebItemProps) {
  const hostname = new URL(item.url).hostname.replace("www.", "")
  const { data: session } = useSession()
  const router = useRouter()

  const handleAction = (action: () => void) => {
    if (session) {
      action()
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {/* <Avatar className="h-20 w-20">
                <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar> */}
            <Image
              src={item.userLogo || "/placeholder.svg"}
              alt={item.userName}
              width={32}
              height={32}
              className="rounded-full mr-2"
            />
            <span className="font-medium text-sm">{item.userName}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAction(() => onLike?.(item.id))}>
                {item.isLiked ? "Unlike" : "Like"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction(() => onBookmark?.(item.id))}>
                {item.isBookmarked ? "Remove Bookmark" : "Bookmark"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction(() => console.log("Share:", item.id))}>
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {item.title}
          </a>
          <Check className="h-4 w-4 text-blue-500" />
        </h3>
        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        <div className="text-xs text-gray-500">
          {hostname} › {item.url.split("/").filter(Boolean).slice(-1)[0]}
        </div>
      </div>
    </div>
  )
}

