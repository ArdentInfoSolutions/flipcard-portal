"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Pencil } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { PostItemFeed } from "@/components/page-components/all-feed/PostItemFeed"

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }

    const userId = session.user?.id
    if (!userId) {
      setError("User ID not found in session")
      setLoading(false)
      return
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/profile?userId=${userId}`)
        if (!res.ok) throw new Error("Failed to fetch profile data" + userId)
        const data = await res.json()
        setUser(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [session, router])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return null

  return (
    <div className="container mx-auto p-4 w-full max-w-3xl">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <img
                  src={user.photo || session?.user?.image || "/placeholder.svg"}
                  className="h-20 w-20 rounded-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={() => router.push("/profile/edit")}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="about">About Me</TabsTrigger>
              <TabsTrigger value="posts">My Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="pt-4">
              <div className="space-y-4">
                {user.bio && <p className="text-base">{user.bio}</p>}
                {user.interests?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest: string, index: number) => (
                      <span key={index} className="bg-secondary px-2 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
                {user.about && Array.isArray(user.about) && (
                  <div className="bg-white shadow-md rounded-lg p-6 mt-6 border border-gray-200">
                    {user.about.map((item: any, i: number) => (
                      <div key={i} className="mb-4">
                        {item.title && <h4 className="text-lg font-semibold text-indigo-700">{item.title}</h4>}
                        {item.details && <p className="text-gray-700 whitespace-pre-wrap">{item.details}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="posts" className="pt-4">
              <PostItemFeed />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
