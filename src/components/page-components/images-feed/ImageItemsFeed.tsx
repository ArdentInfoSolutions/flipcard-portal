import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function ImageItemsFeed() {
  const [imagePosts, setImagePosts] = useState<PostItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImagePosts() {
      try {
        setLoading(true);
        const res = await fetch("/api/postitem");
        if (!res.ok) throw new Error("Failed to fetch posts");

        const dataRaw: any[] = await res.json();

        const data: PostItemType[] = dataRaw.map(post => ({
          ...post,
          postType: post.post_type,
          links_or_images: post.links_or_images,
        }));

        const imagesOnly = data.filter(post => post.postType === "images");

        setImagePosts(imagesOnly);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchImagePosts();
  }, []);

  if (loading) return <div>Loading images...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {imagePosts.length === 0 && <p>No image posts found.</p>}
      {imagePosts.map((post) => (
        <ImagePostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function ImagePostCard({ post }: { post: PostItemType }) {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [bookmarks, setBookmarks] = useState(post.bookmarks);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

  // Use post.images if exists and non-empty; else fallback to links_or_images
  const images = post.images && post.images.length > 0
    ? post.images
    : post.links_or_images?.map(img =>
      typeof img === "string" ? { url: img } : img
    ) ?? [];

  const imagesCount = images.length;
  const loopEnabled = imagesCount > 1; // Enable loop only if more than 1 slide

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => prev + (isLiked ? -1 : 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setBookmarks((prev) => prev + (isBookmarked ? -1 : 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Image
          src={post.userLogo || "/placeholder-user.png"}
          alt={post.userName || "User"}
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <span className="font-semibold text-sm line-clamp-1 max-w-[calc(100%-48px)]">{post.userName}</span>
      </div>

      {/* Swiper Carousel */}
      <div className="relative w-full mx-w-md mx-auto h-[200px]">
        {/* Progress bars */}
        <div className="absolute top-2 left-0 w-full flex px-4 space-x-1 z-20">
          {images.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-gray-500/30 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-[3000ms] ${activeIndex === index ? "bg-white w-full" : "bg-transparent w-0"
                  }`}
              ></div>
            </div>
          ))}
        </div>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={loopEnabled}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="flex justify-center items-center">
              <Image
                src={image.url}
                alt={image.title || `Slide ${index + 1}`}
                width={800}
                height={400}
                className="w-full h-full object-cover rounded-none"
                unoptimized={image.url.startsWith("http") ? false : true}
              // Optional: Use unoptimized if images are external and not allowed by next.config.js domains
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Title and Description */}
      <div className="px-4 pt-3">
        <h2 className="text-sm font-bold mb-1 line-clamp-2">{post.title}</h2>
        <p className="text-xs text-muted-foreground line-clamp-2">{post.description}</p>
      </div>

      {/* Actions */}
      <div className="p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={isLiked ? "text-red-500" : "text-gray-500"}
        >
          <Heart
            className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`}
          />
          <span className="ml-1 text-sm">{likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={isBookmarked ? "text-blue-500" : "text-gray-500"}
        >
          <Bookmark
            className={`h-4 w-4 ${isBookmarked ? "text-blue-500 fill-blue-500" : "text-gray-400"}`}
          />
          <span className="ml-1 text-sm">{bookmarks}</span>
        </Button>
      </div>
    </div>
  );
}





// import { useEffect, useState } from "react";
// import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";

// // Define PostItemType locally since './PostItemFeed' does not exist
// export interface PostItemType {
//   id: string;
//   title: string;
//   url: string;
//   description: string;
//   userName: string;
//   userLogo?: string;
//   images?: { url: string; title?: string }[];
//   showIn?: "images" | "videos";
//   postType?: "web" | "images" | "videos" | "pages";
//   links_or_images?: (string | { url: string; title?: string })[];
//   likes: number;
//   isLiked: boolean;
//   bookmarks: number;
//   isBookmarked: boolean;
//   promo?: string;
//   categories?: string[];
//   pages?: any[];
//   videos?: any[];
//   createdAt?: string;
// }

// export function ImageItemsFeed() {
//   const [imagePosts, setImagePosts] = useState<PostItemType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchImagePosts() {
//       try {
//         const res = await fetch("/api/postitem");
//         if (!res.ok) throw new Error("Failed to fetch posts");

//         const dataRaw: any[] = await res.json();

//         const data: PostItemType[] = dataRaw.map((post) => ({
//           ...post,
//           postType: post.post_type,
//           links_or_images: post.links_or_images,
//         }));

//         const imagesOnly = data.filter((post) => post.postType === "images");
//         setImagePosts(imagesOnly);
//         setLoading(false);
//       } catch (err: any) {
//         setError(err.message);
//         setLoading(false);
//       }
//     }

//     fetchImagePosts();
//   }, []);

//   if (loading) return <div className="p-4">Loading image posts...</div>;
//   if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

//   return (
//     <div className="p-4 max-w-3xl mx-auto space-y-8">
//       {imagePosts.length === 0 && <p>No image posts found.</p>}

//       {imagePosts.map((post) => (
//         <div
//           key={post.id}
//           className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
//         >
//           {/* User Info */}
//           <div className="flex items-center gap-3 mb-3">
//             {post.userLogo && (
//               <img
//                 src={post.userLogo}
//                 alt={post.userName}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//             )}
//             <div>
//               <p className="font-semibold text-sm">{post.userName}</p>
//               {post.createdAt && (
//                 <p className="text-xs text-gray-500">
//                   {new Date(post.createdAt).toLocaleDateString()}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Title */}
//           <h3 className="text-lg font-bold mb-2">{post.title}</h3>

//           {/* Images */}
//           <div className="flex overflow-x-auto gap-3 mb-3">
//             {post.links_or_images?.map((img, idx) => {
//               const imgUrl = typeof img === "string" ? img : img.url;
//               return (
//                 <img
//                   key={idx}
//                   src={imgUrl}
//                   alt={post.title}
//                   className="w-48 h-32 object-cover rounded-md"
//                 />
//               );
//             })}
//           </div>

          

//           {/* Likes & Bookmarks */}
//           <div className="flex items-center justify-between text-sm text-gray-600">
//             <div className="flex items-center gap-2">
//               {post.isLiked ? (
//                 <FaHeart className="text-red-500" />
//               ) : (
//                 <FaRegHeart />
//               )}
//               <span>{post.likes}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               {post.isBookmarked ? (
//                 <FaBookmark className="text-blue-500" />
//               ) : (
//                 <FaRegBookmark />
//               )}
//               <span>{post.bookmarks}</span>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


