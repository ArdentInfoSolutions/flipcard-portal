"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectUser } from "@/features/auth/authSelectors"
import { fetchUserFollowing } from "@/features/user-profile/userThunks"
import { selectUserFollowing } from "@/features/user-profile/userSelectors"
import Link from "next/link"

interface FollowingDialogProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

interface FollowingUser {
  id: string
  name: string
  photo: string
  isFollowing: boolean
}

export function FollowingDialog({ isOpen, onClose, userId }: FollowingDialogProps) {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectUser)
  const following = useAppSelector((state) => selectUserFollowing(state, userId))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true)
      dispatch(fetchUserFollowing(userId)).finally(() => setLoading(false))
    }
  }, [dispatch, isOpen, userId])

  // Mock following data - in a real app, you would use the actual data from the API
  const mockFollowing: FollowingUser[] =
    following?.map((followingId) => ({
      id: followingId,
      name: `User ${followingId}`,
      photo: "/placeholder.svg",
      isFollowing: currentUser?.following.includes(followingId) || false,
    })) || []

  const handleFollowToggle = (followingId: string) => {
    // In a real app, you would dispatch an action to follow/unfollow the user
    console.log(`Toggle follow for user ${followingId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : mockFollowing.length > 0 ? (
            <ul className="space-y-4">
              {mockFollowing.map((following) => (
                <li key={following.id} className="flex items-center justify-between">
                  <Link href={`/user/${following.id}`} className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={following.photo} alt={following.name} />
                      <AvatarFallback>{following.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{following.name}</span>
                  </Link>

                  {currentUser && currentUser.id !== following.id && (
                    <Button
                      variant={following.isFollowing ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleFollowToggle(following.id)}
                    >
                      {following.isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">Not following anyone yet</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

