"use client"

import TabBar from "../../components/common/TabBar"
import { ImageItemsFeed } from "../../components/page-components/images-feed/ImageItemsFeed"

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div className="hidden md:block w-full">
        <TabBar />
      </div>
      <ImageItemsFeed />
      <div className="block md:hidden">
        <TabBar />
      </div>
    </main>
  )
}




// "use client"

// import { useEffect } from "react"
// import { useAppDispatch, useAppSelector } from "../../redux/hooks"
// import { fetchPostsFeed } from "../../features/feed/feedThunks"
// import { selectWebItems, selectFeedLoading, selectFeedError } from "../../features/feed/feedSelectors"
// import TabBar from "../../components/TabBar"
// import { PostCarousel } from "@/components/PostCarousel"
// import { ImageItemsSkeleton } from "@/components/skeletons/image-items-skeleton"

// export default function Images() {
//   const dispatch = useAppDispatch()
//   const postItems = useAppSelector(selectWebItems)
//   const loading = useAppSelector(selectFeedLoading)
//   const error = useAppSelector(selectFeedError)

//   useEffect(() => {
//     dispatch(fetchPostsFeed())
//   }, [dispatch])

//   if (loading) {
//     return (
//       <ImageItemsSkeleton/>
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

//   const imagePosts = postItems.filter((post) => post.showIn === "images")

  // return (
  //   <main className="flex flex-col items-center">
  //     <div className="hidden md:block w-full">
  //       <TabBar />
  //     </div>
  //     <div className="w-full max-w-6xl mx-auto p-8">
  //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  //         {imagePosts.map((post) => (
  //           <PostCarousel
  //             key={post.id}
  //             post={post}
  //             onLike={(id) => console.log("Like:", id)}
  //             onBookmark={(id) => console.log("Bookmark:", id)}
  //           />
  //         ))}
  //       </div>
  //     </div>
  //     <div className="block md:hidden">
  //       <TabBar />
  //     </div>
  //   </main>
  // )
// }

