"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchUserProfile } from "../../features/auth/authThunks"
import { selectUser, selectAuthLoading, selectAuthError } from "../../features/auth/authSelectors"
import { ProfileTabs } from "@/components/profile/ProfileTabs"
import { FollowDialog } from "@/components/profile/FollowDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Pencil } from "lucide-react"

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const loading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)

  useEffect(() => {
    if (!session) {
      router.push("/login")
    } else if (session.user?.id && !user) {
      dispatch(fetchUserProfile(session.user.id))
    }
  }, [session, router, dispatch, user])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return null

  const mockFollowers = user.followers.map((id) => ({
    id,
    name: `User ${id}`,
    photo: "/placeholder.svg",
    isFollowing: Math.random() > 0.5,
  }))

  const mockFollowing = user.following.map((id) => ({
    id,
    name: `User ${id}`,
    photo: "/placeholder.svg",
    isFollowing: true,
  }))

  // Mock data for tabs
  const mockWebItems = user.webItems.map((id) => ({
    id,
    userLogo: user.photo,
    userName: user.name,
    title: `Web Item ${id}`,
    description: "This is a sample web item description",
    url: "https://example.com",
    likes: Math.floor(Math.random() * 100),
    isLiked: false,
    isBookmarked: false,
  }))

  const mockPosts = user.posts.map((id) => ({
    id,
    userId: user.id,
    username: user.name,
    userAvatar: user.photo,
    content: `Post ${id} content`,
    images: ["/placeholder.svg"],
    likesCount: Math.floor(Math.random() * 100),
    isLiked: false,
    bookmarksCount: Math.floor(Math.random() * 20),
    isBookmarked: false,
    createdAt: new Date().toISOString(),
  }))

  return (
    <div className="container mx-auto p-4 w-full max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-muted-foreground">{user.place}</p>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>{user.bio}</p>
            <div className="flex gap-4">
              <FollowDialog
                title="Followers"
                users={mockFollowers}
                onFollow={(id) => console.log("Follow:", id)}
                onUnfollow={(id) => console.log("Unfollow:", id)}
              />
              <FollowDialog
                title="Following"
                users={mockFollowing}
                onFollow={(id) => console.log("Follow:", id)}
                onUnfollow={(id) => console.log("Unfollow:", id)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span key={index} className="bg-secondary px-2 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <ProfileTabs
        webItems={mockWebItems}
        posts={mockPosts}
        likedItems={[...mockWebItems.slice(0, 2), ...mockPosts.slice(0, 2)]}
        bookmarkedItems={[...mockWebItems.slice(2, 4), ...mockPosts.slice(2, 4)]}
      />
    </div>
  )
}

