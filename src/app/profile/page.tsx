"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchUserProfile } from "../../features/auth/authThunks"
import { selectUser, selectAuthLoading, selectAuthError } from "../../features/auth/authSelectors"
import { ProfileTabs } from "@/components/page-components/profile/ProfileTabs"
import { FollowDialog } from "@/components/page-components/profile/FollowDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Pencil, PlusIcon, TvIcon } from "lucide-react"
import { PostItemFeed } from "@/components/page-components/all-feed/PostItemFeed"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
    photo: "/placeholder-user.png",
    isFollowing: Math.random() > 0.5,
  }))

  const mockFollowing = user.following.map((id) => ({
    id,
    name: `User ${id}`,
    photo: "/placeholder-user.png",
    isFollowing: true,
  }))

  const handleAction = (type: string) => {
    router.push(`/create/${type}`);
  };

  return (
    <div className="container mx-auto p-4 w-full max-w-3xl">
      <Card className="bg-white">
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
            <Button variant="outline" size="icon" onClick={() => router.push("/profile/edit")}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="spaces-y-4">
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

      {/* <ProfileTabs
        webItems={mockWebItems}
        posts={mockPosts}
        likedItems={[...mockWebItems.slice(0, 2), ...mockPosts.slice(0, 2)]}
        bookmarkedItems={[...mockWebItems.slice(2, 4), ...mockPosts.slice(2, 4)]}
      /> */}

      <div className="mt-4">
      <div className="flex items-stretch justify-between gap-10">
          <h2 className="text-lg font-bold py-4">My Posts</h2>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg"> <PlusIcon /> Create Post</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAction('web')}>
                {"Web Post"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('images')}>
                {"Image Post"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('videos')}>
                {"Video Post"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        <PostItemFeed />
        </div>
    </div>
  )
}

