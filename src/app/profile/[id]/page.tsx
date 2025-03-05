"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectUser } from "@/features/auth/authSelectors"
import { UserProfileView } from "@/components/profile/UserProfileView"
import { fetchUserById, followUser, unfollowUser } from "@/features/user-profile/userThunks"
import { selectUserById, selectUsersLoading, selectUsersError } from "@/features/user-profile/userSelectors"

export default function ViewProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const { data: session } = useSession()
  const dispatch = useAppDispatch()

  const currentUser = useAppSelector(selectUser)
  const viewedUser = useAppSelector((state) => selectUserById(state, userId))
  const loading = useAppSelector(selectUsersLoading)
  const error = useAppSelector(selectUsersError)

  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId))
    }
  }, [dispatch, userId])

  useEffect(() => {
    if (currentUser && viewedUser) {
      setIsFollowing(currentUser.following.includes(viewedUser.id))
    }
  }, [currentUser, viewedUser])

  const handleFollow = () => {
    if (!session) {
      // Redirect to login if not logged in
      window.location.href = "/login"
      return
    }

    if (isFollowing) {
      dispatch(unfollowUser(viewedUser.id))
      setIsFollowing(false)
    } else {
      dispatch(followUser(viewedUser.id))
      setIsFollowing(true)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-red-500 text-xl">Error loading profile</div>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!viewedUser) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-xl">User not found</div>
          <p className="mt-2 text-gray-500">The user you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <UserProfileView
        user={viewedUser}
        isCurrentUser={currentUser?.id === viewedUser.id}
        isFollowing={isFollowing}
        onFollow={handleFollow}
      />
    </div>
  )
}

