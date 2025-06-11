"use client";
import { useParams } from "next/navigation";
import PostItemForm from "@/components/page-components/create-post/PostItemForm";
import Image from "next/image";

const validTypes = ["web", "images", "videos"] as const;
type PostType = (typeof validTypes)[number];

export default function CreatePostPage() {
    const params = useParams();
    // Validate the 'type' param to be one of allowed post types
    const typeParam = params.type;
    const type: PostType = validTypes.includes(typeParam as PostType)
        ? (typeParam as PostType)
        : "web"; // fallback to "web" if invalid

    // Define image URL based on post type
    const imageMap: Record<PostType, string> = {
        web: "/images/web-post-banner.jpg",
        images: "/images/image-post-banner.jpg",
        videos: "/images/video-post-banner.jpg",
    };

    return (
        <div className="container mx-auto py-8 px-4">


            <PostItemForm showIn={type} />
        </div>
    );
}