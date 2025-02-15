import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PostItem as PostItemType } from "../lib/types";
import { useState, useRef } from "react";

interface PostItemProps {
  post: PostItemType;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
}

export function PostCarousel({ post, onLike, onBookmark }: PostItemProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);
  const autoplayTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle touch/click to move to the next or previous slide
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!swiperRef.current) return;

    const { clientX } = e;
    const { offsetWidth } = e.currentTarget;

    if (clientX < offsetWidth / 2) {
      swiperRef.current.slidePrev(); // Tap left → go back
    } else {
      swiperRef.current.slideNext(); // Tap right → go forward
    }
  };

  // Pause autoplay when holding the screen
  const handleHoldStart = () => {
    if (!swiperRef.current) return;
    swiperRef.current.autoplay.stop();
    if (autoplayTimeout.current) clearTimeout(autoplayTimeout.current);
  };

  // Resume autoplay when release
  const handleHoldEnd = () => {
    if (!swiperRef.current) return;
    autoplayTimeout.current = setTimeout(() => {
      swiperRef.current.autoplay.start();
    }, 500); // Small delay to prevent accidental skips
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header: Avatar & Username */}
      <div className="p-4 flex items-center">
        <Image
          src={post.userAvatar || "/placeholder.svg"}
          alt={post.username}
          width={40}
          height={40}
          className="rounded-full mr-2"
        />
        <span className="font-semibold">{post.username}</span>
      </div>

      {/* Stories-style Carousel */}
      <div 
        className="relative w-full h-[400px] touch-none select-none"
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        onClick={handleTap} // Handle tap for navigation
      >
        {/* Progress Indicators (Inside Image Container) */}
        <div className="absolute top-2 left-0 w-full flex px-4 space-x-1 z-20">
          {post.images.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-gray-500/40 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-[3000ms] ${activeIndex === index ? "bg-white w-full" : "bg-transparent w-0"}`}
              />
            </div>
          ))}
        </div>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => (swiperRef.current = swiper)} // Store swiper instance
          className="w-full h-full"
        >
          {post.images.map((image, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Actions: Like & Bookmark */}
      <div className="p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike?.(post.id)}
          className={post.isLiked ? "text-red-500" : "text-gray-500"}
        >
          <Heart className="mr-2 h-4 w-4" />
          {post.likesCount}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onBookmark?.(post.id)}
          className={post.isBookmarked ? "text-blue-500" : "text-gray-500"}
        >
          <Bookmark className="mr-2 h-4 w-4" />
          {post.bookmarksCount}
        </Button>
      </div>
    </div>
  );
}
