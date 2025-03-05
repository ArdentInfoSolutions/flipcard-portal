"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface User {
  id: string
  name: string
  photo: string
  isFollowing?: boolean
}

interface FollowDialogProps {
  title: string
  users: User[]
  onFollow?: (userId: string) => void
  onUnfollow?: (userId: string) => void
}

export function FollowDialog({ title, users, onFollow, onUnfollow }: FollowDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-muted-foreground">
          {title} ({users.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-100">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={user.photo} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{user.name}</div>
                </div>
                <Button
                  variant={user.isFollowing ? "outline" : "default"}
                  size="sm"
                  onClick={() => {
                    if (user.isFollowing) {
                      onUnfollow?.(user.id)
                    } else {
                      onFollow?.(user.id)
                    }
                  }}
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

