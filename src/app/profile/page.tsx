"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Pencil, PlusIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import WebsiteDetailsForm from "../../components/WebsiteDetailsForm"
import { PostItemFeed } from "@/components/page-components/all-feed/PostItemFeed"

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showWebsiteForm, setShowWebsiteForm] = useState(false)
  const websiteFormRef = useRef<HTMLDivElement>(null)

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
        const res = await fetch(`/api/profile?userId=${userId}`);
        console.log("API response status:", res.status);

        if (!res.ok) throw new Error("Failed to fetch profile data")

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

  useEffect(() => {
    if (showWebsiteForm && websiteFormRef.current) {
      websiteFormRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [showWebsiteForm])

  const handleAction = (type: string) => {
    router.push(`/create/${type}`)
  }

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
                <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
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
          <div className="space-y-4">
            <p className="text-base">{user.bio}</p>

            <div className="flex flex-wrap gap-2">
              {user.interests?.map((interest: string, index: number) => (
                <span key={index} className="bg-secondary px-2 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>

            {user.about && (
              <div className="bg-gray-100 p-3 rounded-md text-sm">
                <strong>About:</strong>
                {Array.isArray(user.about) ? (
                    <ul className="list-disc pl-5 mt-2">
                    {user.about.map(
                      (
                      item: string | Record<string, unknown>,
                      i: number
                      ) => (
                      typeof item === "string" ? (
                        <li key={i}>{item}</li>
                      ) : (
                        <li key={i}>
                        <pre>{JSON.stringify(item, null, 2)}</pre>
                        </li>
                      )
                      )
                    )}
                    </ul>
                ) : typeof user.about === "object" && user.about !== null ? (
                  <>
                    <h4 className="font-semibold mt-2">{user.about.title || "No Title"}</h4>

                    {typeof user.about.details === "string" ? (
                      <p className="mt-1 whitespace-pre-wrap">{user.about.details}</p>
                    ) : typeof user.about.details === "object" && user.about.details !== null ? (
                      <pre className="mt-1 whitespace-pre-wrap">
                        {JSON.stringify(user.about.details, null, 2)}
                      </pre>
                    ) : (
                      <p className="mt-1 whitespace-pre-wrap">No details available</p>
                    )}
                  </>
                ) : (
                  <pre className="whitespace-pre-wrap mt-2">{String(user.about)}</pre>
                )}
              </div>
            )}

          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-10">
          <h2 className="text-lg font-bold py-4">My Posts</h2>

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowWebsiteForm((prev) => !prev)}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              {showWebsiteForm ? "Close Form" : "Add Website"}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAction("web")}>
                  Web Post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction("images")}>
                  Image Post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction("videos")}>
                  Video Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

    
          <PostItemFeed/>

        {showWebsiteForm && (
          <div ref={websiteFormRef} className="mt-6">
            <WebsiteDetailsForm />
          </div>
        )}
      </div>
    </div>
  )
}

  


// "use client"

// import { useEffect, useState, useRef } from "react"
// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useAppDispatch, useAppSelector } from "../../redux/hooks"
// import { fetchUserProfile } from "../../features/auth/authThunks"
// import {
//   selectUser,
//   selectAuthLoading,
//   selectAuthError,
// } from "../../features/auth/authSelectors"
// import { ProfileTabs } from "@/components/page-components/profile/ProfileTabs"
// import { FollowDialog } from "@/components/page-components/profile/FollowDialog"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Pencil, PlusIcon } from "lucide-react"
// import { PostItemFeed } from "@/components/page-components/all-feed/PostItemFeed"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import WebsiteDetailsForm from "../../components/WebsiteDetailsForm" // ✅ Import your form

// export default function ProfilePage() {
//   const { data: session } = useSession()
//   const router = useRouter()
//   const dispatch = useAppDispatch()
//   const user = useAppSelector(selectUser)
//   const loading = useAppSelector(selectAuthLoading)
//   const error = useAppSelector(selectAuthError)

//   const [showWebsiteForm, setShowWebsiteForm] = useState(false)
//   const websiteFormRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (!session) {
//       router.push("/login")
//     } else if (session.user?.id && !user) {
//       dispatch(fetchUserProfile(session.user.id))
//     }
//   }, [session, router, dispatch, user])

//   useEffect(() => {
//     if (showWebsiteForm && websiteFormRef.current) {
//       websiteFormRef.current.scrollIntoView({ behavior: "smooth" })
//     }
//   }, [showWebsiteForm])

//   if (loading) return <div>Loading...</div>
//   if (error) return <div>Error: {error}</div>
//   if (!user) return null

//   const mockFollowers = user.followers.map((id) => ({
//     id,
//     name: `User ${id}`,
//     photo: "/placeholder-user.png",
//     isFollowing: Math.random() > 0.5,
//   }))

//   const mockFollowing = user.following.map((id) => ({
//     id,
//     name: `User ${id}`,
//     photo: "/placeholder-user.png",
//     isFollowing: true,
//   }))

//   const handleAction = (type: string) => {
//     router.push(`/create/${type}`)
//   }

//   return (
//     <div className="container mx-auto p-4 w-full max-w-3xl">
//       <Card className="bg-white">
//         <CardHeader>
//           <div className="flex items-start justify-between">
//             <div className="flex items-center space-x-4">
//               <Avatar className="h-20 w-20">
//                 <AvatarImage src={user.photo || "/placeholder.svg"} alt={user.name} />
//                 <AvatarFallback>{user.name[0]}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <h2 className="text-2xl font-bold">{user.name}</h2>
//                 <p className="text-muted-foreground">{user.email}</p>
//                 <p className="text-muted-foreground">{user.place}</p>
//               </div>
//             </div>
//             <Button variant="outline" size="icon" onClick={() => router.push("/profile/edit")}>
//               <Pencil className="h-4 w-4" />
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="spaces-y-4">
//             <p>{user.bio}</p>
           
//             <div className="flex flex-wrap gap-2">
//               {user.interests.map((interest, index) => (
//                 <span key={index} className="bg-secondary px-2 py-1 rounded-full text-sm">
//                   {interest}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="mt-4">
//         <div className="flex items-stretch justify-between gap-10">
//           <h2 className="text-lg font-bold py-4">My Posts</h2>

//           <div className="flex gap-4">
//             {/* Toggle Website Form Button */}
//             <Button
//               variant="outline"
//               size="lg"
//               onClick={() => setShowWebsiteForm((prev) => !prev)}
//             >
//               <PlusIcon className="mr-2 h-4 w-4" />
//               {showWebsiteForm ? "Close Form" : "Add Website"}
//             </Button>

//             {/* Create Post Dropdown */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="lg">
//                   <PlusIcon className="mr-2 h-4 w-4" />
//                   Create Post
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => handleAction("web")}>
//                   Web Post
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handleAction("images")}>
//                   Image Post
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => handleAction("videos")}>
//                   Video Post
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>

//         <PostItemFeed />

//         {/* Conditionally Render WebsiteDetailsForm */}
//         {showWebsiteForm && (
//           <div ref={websiteFormRef} className="mt-6">
//             <WebsiteDetailsForm />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
