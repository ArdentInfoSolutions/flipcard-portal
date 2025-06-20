"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Share,
    Bookmark,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import { useRef } from "react";

interface PostType {
    id: string;
    title: string;
    description: string;
    images?: { url: string; title?: string }[];
    links_or_images?: (string | { url: string })[];
}

export default function ImagePostDetail({
    post,
    onClose,
}: {
    post: PostType;
    onClose: () => void;
}) {
    const swiperRef = useRef<any>(null); // <-- Capture swiper instance

    const images =
        post.images && post.images.length > 0
            ? post.images
            : post.links_or_images?.map((img) =>
                typeof img === "string" ? { url: img } : img
            ) ?? [];

    return (
        <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col items-center">
            <div className="w-full max-w-2xl h-full flex flex-col">
                {/* Top Bar */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-black rounded-full"></div>
                        <h1 className="text-sm font-semibold">Ninjapromo</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => swiperRef.current?.slidePrev()}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => swiperRef.current?.slideNext()}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            ❌
                        </Button>
                    </div>
                </div>

                {/* Image Carousel */}
                <div className="flex justify-center py-2 bg-black">
                    <div className="w-full max-w-2xl">
                        <Swiper
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            modules={[Autoplay, Pagination]}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            className="w-full max-h-[320px]"
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <Image
                                        src={image.url}
                                        alt={post.title}
                                        width={1280}
                                        height={720}
                                        className="w-full max-h-[320px] object-cover"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                {/* Description & Actions */}
                <div className="px-4 py-4 w-full max-w-2xl overflow-y-auto">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        {/* Left: Description + Buttons */}
                        <div className="md:w-2/3 space-y-4">
                            <div>
                                <h2 className="text-base font-semibold">{post.title}</h2>
                                <p className="text-sm text-muted-foreground">{post.description}</p>
                            </div>
                            <div className="flex gap-3 w-full">
                                <Button
                                    variant="outline"
                                    className="w-full py-5 rounded-xl justify-center text-base bg-gray-100 hover:bg-gray-200"
                                >
                                    <Share className="w-5 h-5 mr-2" />
                                    Share
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full py-5 rounded-xl justify-center text-base bg-gray-100 hover:bg-gray-200"
                                >
                                    <Bookmark className="w-5 h-5 mr-2" />
                                    Save
                                </Button>
                            </div>
                        </div>

                        {/* Right: CTA Buttons */}
                        <div className="md:w-1/3 flex flex-col items-start md:items-end gap-3">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
                                Visit
                            </Button>
                            <div className="text-sm text-muted-foreground cursor-pointer hover:underline">
                                Learn More
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
