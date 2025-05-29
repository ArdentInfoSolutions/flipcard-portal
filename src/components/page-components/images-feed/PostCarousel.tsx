// "use client";

// import { useState, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";
// import Image from "next/image";
// import { Heart, Bookmark } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useAppSelector } from "@/redux/hooks";
// import { selectIsPostLiked, selectPostLikes } from "@/features/actions-like-post/likePostSelectors";
// import { selectIsBookmarked, selectBookmarks } from "@/features/actions-bookmark-post/bookmarkPostSelectors";
// import { useSession } from "next-auth/react";

// import type { PostItem as PostItemType } from "../../../lib/types";

// interface PostCarouselProps {
//   post: PostItemType;
//   onLike?: (id: string) => void;
//   onBookmark?: (id: string) => void;
// }

// export default function PostCarousel({ post, onLike, onBookmark }: PostCarouselProps) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const swiperRef = useRef<any>(null);
//   const { data: session } = useSession();
//   const router = useRouter();

//   const isLiked = useAppSelector((state) => selectIsPostLiked(state, post.id, post.isLiked ?? false));
//   const likes = useAppSelector((state) => selectPostLikes(state, post.id, post.likes ?? 0));

//   const isBookmarked = useAppSelector((state) => selectIsBookmarked(state, post.id, post.isBookmarked ?? false));
//   const bookmarks = useAppSelector((state) => selectBookmarks(state, post.id, post.bookmarks ?? 0));

//   const handleAction = (action: () => void) => {
//     if (session) {
//       action();
//     } else {
//       router.push("/login");
//     }
//   };

//   const handleLike = () => {
//     onLike?.(post.id);
//   };

//   const handleBookmark = () => {
//     onBookmark?.(post.id);
//   };

//   // Tap on left/right side to go prev/next slide
//   const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!swiperRef.current) return;
//     const { clientX } = e;
//     const { offsetWidth } = e.currentTarget;

//     if (clientX < offsetWidth / 2) {
//       swiperRef.current.slidePrev();
//     } else {
//       swiperRef.current.slideNext();
//     }
//   };

//   // Pause autoplay on hold (mouse or touch)
//   const handleHoldStart = () => {
//     if (!swiperRef.current) return;
//     swiperRef.current.autoplay.stop();
//   };

//   // Resume autoplay on release
//   const handleHoldEnd = () => {
//     if (!swiperRef.current) return;
//     setTimeout(() => swiperRef.current.autoplay.start(), 500);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       {/* Header */}
//       <div className="p-4 flex items-center">
//         <Image
//           src={post.userLogo || "/placeholder-user.png"}
//           alt={post.userName}
//           width={40}
//           height={40}
//           className="rounded-full mr-2"
//         />
//         <span className="font-semibold">{post.userName}</span>
//       </div>

//       {/* Carousel */}
//       <div
//         className="relative w-full h-[300px] touch-none select-none"
//         onMouseDown={handleHoldStart}
//         onMouseUp={handleHoldEnd}
//         onTouchStart={handleHoldStart}
//         onTouchEnd={handleHoldEnd}
//         onClick={handleTap}
//       >
//         {/* Progress Bar */}
//         <div className="absolute top-2 left-0 w-full flex px-4 space-x-1 z-20">
//           {post.images.map((_, index) => (
//             <div key={index} className="flex-1 h-1 bg-gray-500/40 rounded-full overflow-hidden">
//               <div
//                 className={`h-full transition-all duration-[3000ms] ${activeIndex === index ? "bg-white w-full" : "bg-transparent w-0"}`}
//               />
//             </div>
//           ))}
//         </div>

//         <Swiper
//           modules={[Autoplay]}
//           autoplay={{ delay: 3000, disableOnInteraction: false }}
//           loop
//           onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
//           onSwiper={(swiper) => (swiperRef.current = swiper)}
//           className="w-full h-full"
//         >
//           {post.images.map((image, index) => (
//             <SwiperSlide key={index} className="flex justify-center">
//               <Image
//                 src={image.url}
//                 alt={`Slide ${index + 1}`}
//                 width={800}
//                 height={400}
//                 className="w-full h-full object-cover"
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Actions */}
//       <div className="p-4 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => handleAction(handleLike)}
//           className={isLiked ? "text-red-500" : "text-gray-500"}
//         >
//           <Heart className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`} />
//           {likes}
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => handleAction(handleBookmark)}
//           className={isBookmarked ? "text-blue-500" : "text-gray-500"}
//         >
//           <Bookmark className={`h-4 w-4 ${isBookmarked ? "text-blue-500 fill-blue-500" : "text-gray-400"}`} />
//           {bookmarks}
//         </Button>
//       </div>
//     </div>
//   );
// }


// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";
// import Image from "next/image";
// import { Heart, Bookmark } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import type { PostItem as PostItemType } from "../../../lib/types";
// import { useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useAppSelector } from "@/redux/hooks";
// import {
//   selectIsPostLiked,
//   selectPostLikes,
// } from "@/features/actions-like-post/likePostSelectors";
// import {
//   selectBookmarks,
//   selectIsBookmarked,
// } from "@/features/actions-bookmark-post/bookmarkPostSelectors";
// import { useSession } from "next-auth/react";

// interface PostItemProps {
//   post: PostItemType;
//   onLike?: (id: string) => void;
//   onBookmark?: (id: string) => void;
// }

// export function PostCarousel({ post, onLike, onBookmark }: PostItemProps) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const swiperRef = useRef<any>(null);
//   const autoplayTimeout = useRef<NodeJS.Timeout | null>(null);
//   const { data: session } = useSession();
//   const router = useRouter();

//   const isLiked = useAppSelector((state) =>
//     selectIsPostLiked(state, post.id, post.isLiked ?? false)
//   );
//   const likes = useAppSelector((state) =>
//     selectPostLikes(state, post.id, post.likes ?? 0)
//   );

//   const isBookmarked = useAppSelector((state) =>
//     selectIsBookmarked(state, post.id, post.isBookmarked ?? false)
//   );
//   const bookmarks = useAppSelector((state) =>
//     selectBookmarks(state, post.id, post.bookmarks ?? 0)
//   );

//   const handleAction = (action: () => void) => {
//     if (session) {
//       action();
//     } else {
//       router.push("/login");
//     }
//   };

//   const handleLike = () => {
//     onLike?.(post.id);
//   };

//   const handleBookmark = () => {
//     onBookmark?.(post.id);
//   };

//   const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!swiperRef.current) return;
//     const { clientX } = e;
//     const { offsetWidth } = e.currentTarget;

//     if (clientX < offsetWidth / 2) {
//       swiperRef.current.slidePrev();
//     } else {
//       swiperRef.current.slideNext();
//     }
//   };

//   const handleHoldStart = () => {
//     if (!swiperRef.current) return;
//     swiperRef.current.autoplay.stop();
//     if (autoplayTimeout.current) clearTimeout(autoplayTimeout.current);
//   };

//   const handleHoldEnd = () => {
//     if (!swiperRef.current) return;
//     autoplayTimeout.current = setTimeout(() => {
//       swiperRef.current.autoplay.start();
//     }, 500);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       {/* Header: Avatar & Username */}
//       <div className="p-4 flex items-center">
//         <Image
//           src={post.userLogo || "/placeholder-user.png"}
//           alt={post.userName || "User"}
//           width={40}
//           height={40}
//           className="rounded-full mr-2"
//         />
//         <span className="font-semibold">{post.userName}</span>
//       </div>

//       {/* Carousel */}
//       <div
//         className="relative w-full h-[300px] touch-none select-none"
//         onMouseDown={handleHoldStart}
//         onMouseUp={handleHoldEnd}
//         onTouchStart={handleHoldStart}
//         onTouchEnd={handleHoldEnd}
//         onClick={handleTap}
//       >
//         {/* Progress Indicators */}
//         <div className="absolute top-2 left-0 w-full flex px-4 space-x-1 z-20">
//           {post.images?.map((_, index) => (
//             <div
//               key={index}
//               className="flex-1 h-1 bg-gray-500/40 rounded-full overflow-hidden"
//             >
//               <div
//                 className={`h-full transition-all duration-[3000ms] ${activeIndex === index
//                     ? "bg-white w-full"
//                     : "bg-transparent w-0"
//                   }`}
//               />
//             </div>
//           ))}
//         </div>

//         <Swiper
//           modules={[Autoplay]}
//           autoplay={{ delay: 3000, disableOnInteraction: false }}
//           loop={true}
//           onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
//           onSwiper={(swiper) => (swiperRef.current = swiper)}
//           className="w-full h-full"
//         >
//           {post.images?.map((image, index) => (
//             <SwiperSlide key={index} className="flex justify-center">
//               <Image
//                 src={image.url}
//                 alt={`Slide ${index + 1}`}
//                 width={800}
//                 height={400}
//                 className="w-full h-full object-cover"
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Actions */}
//       <div className="p-4 flex justify-between items-center">
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => handleAction(handleLike)}
//           className={isLiked ? "text-red-500" : "text-gray-500"}
//         >
//           <Heart
//             className={`h-4 w-4 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
//               }`}
//           />
//           {likes}
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => handleAction(handleBookmark)}
//           className={isBookmarked ? "text-blue-500" : "text-gray-500"}
//         >
//           <Bookmark
//             className={`h-4 w-4 ${isBookmarked ? "text-blue-500 fill-blue-500" : "text-gray-400"
//               }`}
//           />
//           {bookmarks}
//         </Button>
//       </div>
//     </div>
//   );
// }
