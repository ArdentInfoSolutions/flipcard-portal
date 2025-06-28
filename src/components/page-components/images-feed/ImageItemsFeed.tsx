"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImagePostDetail from "./[id]/page";

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
  const [selectedPost, setSelectedPost] = useState<PostItemType | null>(null);

  useEffect(() => {
    async function fetchImagePosts() {
      try {
        setLoading(true);
        const res = await fetch("/api/postitem");
        if (!res.ok) throw new Error("Failed to fetch posts");

        const dataRaw: any[] = await res.json();

        const data: PostItemType[] = dataRaw.map((post) => ({
          ...post,
          postType: post.post_type,
          links_or_images: post.links_or_images,
        }));

        const imagesOnly = data.filter((post) => post.postType === "images");
        setImagePosts(imagesOnly);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchImagePosts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading images...</div>;
  if (error) return <div className="text-center text-red-500 py-8">Error: {error}</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {imagePosts.length === 0 && <p>No image posts found.</p>}
        {imagePosts.map((post) => (
          <ImagePostCard key={post.id} post={post} onSelect={() => setSelectedPost(post)} />
        ))}
      </div>

      {selectedPost && (
        <ImagePostDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}

function ImagePostCard({
  post,
  onSelect,
}: {
  post: PostItemType;
  onSelect: () => void;
}) {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [bookmarks, setBookmarks] = useState(post.bookmarks);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

  const images =
    post.images && post.images.length > 0
      ? post.images
      : post.links_or_images?.map((img) =>
        typeof img === "string" ? { url: img } : img
      ) ?? [];

  const loopEnabled = images.length > 1;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => prev + (isLiked ? -1 : 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setBookmarks((prev) => prev + (isBookmarked ? -1 : 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Image
          src={post.userLogo || "/placeholder-user.png"}
          alt={post.userName || "User"}
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <span className="font-semibold text-sm truncate">{post.userName}</span>
      </div>

      {/* Swiper Carousel */}
      <div
        className="relative w-full h-[220px] sm:h-[260px] md:h-[280px] lg:h-[300px] cursor-pointer"
        onClick={onSelect}
      >
        {/* Progress Bars */}
        <div className="absolute top-2 left-0 w-full flex px-4 space-x-1 z-10">
          {images.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-gray-500/30 rounded-full overflow-hidden"
            >
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
                className="w-full h-full object-cover"
                unoptimized={image.url.startsWith("http")}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Title & Description */}
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
          <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} />
          <span className="ml-1 text-sm">{likes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={isBookmarked ? "text-blue-500" : "text-gray-500"}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-blue-500" : ""}`} />
          <span className="ml-1 text-sm">{bookmarks}</span>
        </Button>
      </div>
    </div>
  );
}
