"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectUser } from "@/features/auth/authSelectors"
import { fetchUserFollowers } from "@/features/user-profile/userThunks"
import { selectUserFollowers } from "@/features/user-profile/userSelectors"
import Link from "next/link"

interface FollowersDialogProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

interface FollowerUser {
  id: string
  name: string
  photo: string
  isFollowing: boolean
}

export function FollowersDialog({ isOpen, onClose, userId }: FollowersDialogProps) {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectUser)
  const followers = useAppSelector((state) => selectUserFollowers(state, userId))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true)
      dispatch(fetchUserFollowers(userId)).finally(() => setLoading(false))
    }
  }, [dispatch, isOpen, userId])

  // Mock followers data - in a real app, you would use the actual data from the API
  const mockFollowers: FollowerUser[] =
    followers?.map((followerId) => ({
      id: followerId,
      name: `User ${followerId}`,
      photo: "/placeholder.svg",
      isFollowing: currentUser?.following.includes(followerId) || false,
    })) || []

  const handleFollowToggle = (followerId: string) => {
    // In a real app, you would dispatch an action to follow/unfollow the user
    console.log(`Toggle follow for user ${followerId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : mockFollowers.length > 0 ? (
            <ul className="space-y-4">
              {mockFollowers.map((follower) => (
                <li key={follower.id} className="flex items-center justify-between">
                  <Link href={`/user/${follower.id}`} className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={follower.photo} alt={follower.name} />
                      <AvatarFallback>{follower.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{follower.name}</span>
                  </Link>

                  {currentUser && currentUser.id !== follower.id && (
                    <Button
                      variant={follower.isFollowing ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleFollowToggle(follower.id)}
                    >
                      {follower.isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">No followers yet</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


