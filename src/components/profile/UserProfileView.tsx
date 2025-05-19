"use client"
import Link from "next/link"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Users, Edit } from "lucide-react"
import { FollowersDialog } from "@/components/profile/FollowersDialog"
import { FollowingDialog } from "@/components/profile/FollowingDialog"
import type { UserProfile } from "@/lib/types"
import { PostItemFeed } from "../page-components/all-feed/PostItemFeed"

interface UserProfileViewProps {
  user: UserProfile
  isCurrentUser: boolean
  isFollowing: boolean
  onFollow: () => void
}

export function UserProfileView({ user, isCurrentUser, isFollowing, onFollow }: UserProfileViewProps) {
  const [activeTab, setActiveTab] = useState("posts")
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader className="relative pb-0">
          {/* Cover Photo */}
          <div className="h-48 w-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"></div>

          {/* Profile Info */}
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-12 px-4 pb-4">
            <Avatar className="h-32 w-32 border-4 border-white shadow-md">
              <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex items-center text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{user.place || "No location"}</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              {isCurrentUser ? (
                <Link href="/profile/edit">
                  <Button variant="outline" className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <Button onClick={onFollow} variant={isFollowing ? "outline" : "default"} className="flex items-center">
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Bio */}
          <div className="mt-4 mb-6">
            <p className="text-gray-700">{user.bio || "No bio available"}</p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button variant="ghost" className="flex items-center" onClick={() => setShowFollowers(true)}>
              <Users className="h-4 w-4 mr-2" />
              <span className="font-semibold">{user.followers.length}</span> Followers
            </Button>

            <Button variant="ghost" className="flex items-center" onClick={() => setShowFollowing(true)}>
              <Users className="h-4 w-4 mr-2" />
              <span className="font-semibold">{user.following.length}</span> Following
            </Button>
          </div>

          {/* Interests */}
          {user.interests.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="posts" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              <PostItemFeed />
            </TabsContent>

            <TabsContent value="likes" className="space-y-4">
              <PostItemFeed />
            </TabsContent>

            <TabsContent value="bookmarks" className="space-y-4">
              <PostItemFeed />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Followers Dialog */}
      <FollowersDialog isOpen={showFollowers} onClose={() => setShowFollowers(false)} userId={user.userId} />

      {/* Following Dialog */}
      <FollowingDialog isOpen={showFollowing} onClose={() => setShowFollowing(false)} userId={user.userId} />
    </div>
  )
}

