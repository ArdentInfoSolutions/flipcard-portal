"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Pencil, PlusIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

  const handleAction = (type: string) => {
    router.push(`/create/${type}`)
  }

  const handleWebsiteClick = () => {
    router.push("/create/Website")
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
                <img
                  src={user.photo || session?.user?.image || "/placeholder.svg"}
                  alt={user.name}
                  className="h-20 w-20 rounded-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-muted-foreground">
                  {user.place && user.latitude != null && user.longitude != null
                    ? `${user.place} — Latitude: ${user.latitude.toFixed(
                      6
                    )}, Longitude: ${user.longitude.toFixed(6)}`
                    : "Location not provided"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={() => router.push("/profile/edit")}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-10">
          <h2 className="text-lg font-bold py-4">My Posts</h2>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/create/website")}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Website
            </Button>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Post
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAction("web")}>Web Post</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction("images")}>Image Post</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction("videos")}>Video Post</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <PostItemFeed />
      </div>
    </div>
  )
}

// "use client"

// import { useEffect, useState, useRef } from "react"
// import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Pencil, PlusIcon } from "lucide-react"

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// import WebsiteDetailsForm from "../../components/WebsiteDetailsForm"
// import { PostItemFeed } from "@/components/page-components/all-feed/PostItemFeed"

// export default function ProfilePage() {
//   const { data: session } = useSession()
//   const router = useRouter()

//   const [user, setUser] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [showWebsiteForm, setShowWebsiteForm] = useState(false)
//   const websiteFormRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     console.log("Session data:", session)
//     setLoading(true)
//     if (!session) {
//       router.push("/login")
//       return
//     }

//     const userId = session.user?.id
//     console.log("User ID from session:", userId)
//     if (!userId) {
//       setError("User ID not found in session")
//       setLoading(false)
//       return
//     }

//     const fetchUserData = async () => {
//       try {
//         console.log("Fetching profile data for userId:", userId)
//         const res = await fetch(`/api/profile?userId=${userId}`)
//         if (!res.ok) throw new Error("Failed to fetch profile data")

//         const data = await res.json()
//         setUser(data)
//       } catch (err: any) {
//         setError(err.message)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUserData()
//   }, [session, router])

//   useEffect(() => {
//     if (showWebsiteForm && websiteFormRef.current) {
//       websiteFormRef.current.scrollIntoView({ behavior: "smooth" })
//     }
//   }, [showWebsiteForm])

//   const handleAction = (type: string) => {
//     router.push(`/create/${type}`)
//   }

//   if (loading) return <div>Loading...</div>
//   if (error) return <div>Error: {error}</div>
//   if (!user) return null
//   console.log("ABOUT DATA:", user);
//   console.log("User latitude:", user.latitude)
//   console.log("User longitude:", user.longitude)
//   console.log("User photo:", user.photo);
//   console.log("Session user image:", session?.user?.image);



//   return (
//     <div className="container mx-auto p-4 w-full max-w-3xl">
//       <Card className="bg-white">
//         <CardHeader>
//           <div className="flex items-start justify-between">
//             <div className="flex items-center space-x-4">
//               <Avatar className="h-20 w-20">
//                 <img
//                   src={user.photo || session?.user?.image || "/placeholder.svg"}
//                   alt={user.name}
//                   className="h-20 w-20 rounded-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.src = "/placeholder.svg"
//                   }}
//                 />
//                 <AvatarFallback>{user.name?.[0]}</AvatarFallback>
//               </Avatar>


//               <div>
//                 <h2 className="text-2xl font-bold">{user.name}</h2>
//                 <p className="text-muted-foreground">{user.email}</p>
//                 <p className="text-muted-foreground">
//                   {user.place && user.latitude != null && user.longitude != null
//                     ? `${user.place} — Latitude: ${user.latitude.toFixed(6)}, Longitude: ${user.longitude.toFixed(6)}`
//                     : "Location not provided"}
//                 </p>

//                 {/* { user.latitude && user.longitude && (
//                   <p className="text-muted-foreground">
//                     latitude: {user.latitude.toFixed(6)}, longitude: {user.longitude.toFixed(6)}
//                   </p>    
//                 )} */}
//               </div>
//             </div>
//             <Button variant="outline" size="icon" onClick={() => router.push("/profile/edit")}>
//               <Pencil className="h-4 w-4" />
//             </Button>
//           </div>
//         </CardHeader>

//         <CardContent>
//           <div className="space-y-4">
//             {user.bio && <p className="text-base">{user.bio}</p>}

//             {user.interests?.length > 0 && (
//               <div className="flex flex-wrap gap-2">
//                 {user.interests.map((interest: string, index: number) => (
//                   <span key={index} className="bg-secondary px-2 py-1 rounded-full text-sm">
//                     {interest}
//                   </span>
//                 ))}
//               </div>
//             )}

// {user.about && Array.isArray(user.about) && (
//   <div className="bg-white shadow-md rounded-lg p-6 mt-6 border border-gray-200">
    
//     {user.about.map((item: any, i: number) => (
//       <div key={i} className="mb-4">
//         {item.title && (
//           <h4 className="text-lg font-semibold text-indigo-700">{item.title}</h4>
//         )}
//         {item.details && (
//           <p className="text-gray-700 whitespace-pre-wrap">{item.details}</p>
//         )}
//       </div>
//     ))}
//   </div>
// )}

//           </div>
//         </CardContent>
//       </Card>

//       <div className="mt-6">
//         <div className="flex items-center justify-between gap-10">
//           <h2 className="text-lg font-bold py-4">My Posts</h2>

//           <div className="flex gap-4">
//             <Button
//               variant="outline"
//               size="lg"
//               onClick={() => setShowWebsiteForm((prev) => !prev)}
//             >
//               <PlusIcon className="mr-2 h-4 w-4" />
//               {showWebsiteForm ? "Close Form" : "Add Website"}
//             </Button>

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

//         {showWebsiteForm && (
//           <div ref={websiteFormRef} className="mt-6">
//             <WebsiteDetailsForm />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

