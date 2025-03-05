"use client"

import TabBar from "../../components/common/TabBar"
import { VideoItemsFeed } from "../../components/page-components/videos-feed/VideoItemsFeed"

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div className="hidden md:block w-full">
        <TabBar />
      </div>
      <VideoItemsFeed />
      <div className="block md:hidden">
        <TabBar />
      </div>
    </main>
  )
}

// import { useEffect } from "react"
// import { useAppDispatch, useAppSelector } from "../../redux/hooks"
// import { fetchPostsFeed } from "../../features/feed/feedThunks"
// import { selectWebItems, selectFeedLoading, selectFeedError } from "../../features/feed/feedSelectors"
// import TabBar from "../../components/TabBar"
// import { VideoPostItem } from "../../components/VideoPostItem"

// export default function Videos() {
//   const dispatch = useAppDispatch()
//   const postItems = useAppSelector(selectWebItems)
//   const loading = useAppSelector(selectFeedLoading)
//   const error = useAppSelector(selectFeedError)

//   useEffect(() => {
//     dispatch(fetchPostsFeed())
//   }, [dispatch])

//   if (loading) {
//     return (
    //   <main className="flex flex-col items-center">
    //     <div className="hidden md:block w-full">
    //       <TabBar />
    //     </div>
        // <div className="w-full max-w-6xl mx-auto p-8">
        //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        //     {[...Array(9)].map((_, i) => (
        //       <div key={i} className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
        //     ))}
        //   </div>
        // </div>
    //     <div className="block md:hidden">
    //       <TabBar />
    //     </div>
    //   </main>
//     )
//   }

//   if (error) {
//     return (
//       <main className="flex flex-col items-center">
//         <div className="hidden md:block w-full">
//           <TabBar />
//         </div>
//         <div className="w-full max-w-6xl mx-auto p-8">
//           <div className="text-red-500">Error: {error}</div>
//         </div>
//         <div className="block md:hidden">
//           <TabBar />
//         </div>
//       </main>
//     )
//   }

//   const videoPosts = postItems.filter((post) => post.showIn === "videos")

//   return (
//     <main className="flex flex-col items-center">
//       <div className="hidden md:block w-full">
//         <TabBar />
//       </div>
//       <div className="w-full max-w-6xl mx-auto p-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {videoPosts.map((post) => (
//             <VideoPostItem
//               key={post.id}
//               post={post}
//               onLike={(id) => console.log("Like:", id)}
//               onBookmark={(id) => console.log("Bookmark:", id)}
//             />
//           ))}
//         </div>
//       </div>
//       <div className="block md:hidden">
//         <TabBar />
//       </div>
//     </main>
//   )
// }

