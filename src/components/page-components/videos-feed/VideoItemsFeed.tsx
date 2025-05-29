import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";

export interface PostItemType {
  id: string;
  title: string;
  url: string;
  description: string;
  userName: string;
  userLogo?: string;
  images?: { url: string; title?: string }[];
  showIn?: "images" | "videos";
  postType?: "web" | "images" | "videos" | "pages";
  links_or_images?: (string | { url: string; title?: string })[];
  likes: number;
  isLiked: boolean;
  bookmarks: number;
  isBookmarked: boolean;
  promo?: string;
  categories?: string[];
  pages?: any[];
  videos?: any[];
  createdAt?: string;
}

export function VideoItemsFeed() {
  const [videoPosts, setVideoPosts] = useState<PostItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideoPosts() {
      try {
        const res = await fetch("/api/postitem");
        if (!res.ok) throw new Error("Failed to fetch posts");

        const dataRaw: any[] = await res.json();

        const data: PostItemType[] = dataRaw.map((post) => ({
          ...post,
          postType: post.post_type,
          links_or_images: post.links_or_images,
        }));

        const videosOnly = data.filter((post) => post.postType === "videos");
        setVideoPosts(videosOnly);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchVideoPosts();
  }, []);

  if (loading) return <div className="p-4">Loading video posts...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-8">
      {videoPosts.length === 0 && <p>No video posts found.</p>}

      {videoPosts.map((post) => (
        <VideoPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function VideoPostCard({ post }: { post: PostItemType }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [bookmarks, setBookmarks] = useState(post.bookmarks);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => prev + (isLiked ? -1 : 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setBookmarks((prev) => prev + (isBookmarked ? -1 : 1));
  };

  // Convert videos array properly
  const videos = post.links_or_images?.map((v) =>
    typeof v === "string" ? { url: v } : v
  ) ?? [];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-4">
      {/* Header: User Info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={post.userLogo || "/placeholder-user.png"}
          alt={post.userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm line-clamp-1">{post.userName}</p>
          {post.createdAt && (
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold mb-3 line-clamp-2">{post.title}</h3>

      {/* Videos - horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto mb-4">
        {videos.length === 0 && <p>No videos available.</p>}
        {videos.map((video, idx) => (
          <video
            key={idx}
            src={video.url}
            controls
            className="w-64 h-40 rounded-md object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Description */}
      {post.description && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{post.description}</p>
      )}

      {/* Actions: Likes & Bookmarks */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-gray-500"
            }`}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>{likes}</span>
        </button>

        <button
          onClick={handleBookmark}
          className={`flex items-center gap-1 ${isBookmarked ? "text-blue-500" : "text-gray-500"
            }`}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
        >
          {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          <span>{bookmarks}</span>
        </button>
      </div>
    </div>
  );
}




// "use client"

// import { useEffect } from "react"
// import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
// import { fetchVideoPostItems } from "../../../features/video-posts/videoPostsThunks"
// import { selectVideoPostItems, selectVideoPostsLoading, selectVideoPostsError } from "../../../features/video-posts/videoPostsSelectors"
// import { ImageItemsSkeleton } from "../skeletons/image-items-skeleton"
// import { VideoPostItem } from "./VideoPostItem"
// import { likePost } from "@/features/actions-like-post/likePostThunks"
// import { bookmarkPost } from "@/features/actions-bookmark-post/bookmarkPostThunks"

// export function VideoItemsFeed() {
//   const dispatch = useAppDispatch()
//   const videoItems = useAppSelector(selectVideoPostItems)
//   const loading = useAppSelector(selectVideoPostsLoading)
//   const error = useAppSelector(selectVideoPostsError)

//   useEffect(() => {
//     dispatch(fetchVideoPostItems())
//   }, [dispatch])

//   if (loading) {
//     return (
//       <ImageItemsSkeleton/>
//     )
//   }

//   if (error) {
//     return (
//       <div className="w-full max-w-3xl mx-auto p-4">
//         <div className="text-red-500">Error: {error}</div>
//       </div>
//     )
//   }

//   return (
//     <main className="flex flex-col items-center">

//       <div className="w-full max-w-6xl mx-auto p-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {videoItems.map((post) => (
//             <VideoPostItem
//               key={post.id}
//               post={post}
//               onLike={(id) => dispatch(likePost(id))}
//               onBookmark={(id) => dispatch(bookmarkPost(id))}
//             />
//           ))}
//         </div>
//       </div>
//     </main>
//   )
// //   return (
//     // <div className="w-full max-w-3xl mx-auto divide-y">
//     //   {imageItems.map((item) => (
//     //     <PostCarousel
//     //     key={item.id}
//     //     post={item}
//     //     onLike={(id) => console.log("Like:", id)}
//     //     onBookmark={(id) => console.log("Bookmark:", id)}
//     //   />
//     //   ))}
//     // </div>
// //   )
// }

