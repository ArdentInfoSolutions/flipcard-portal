"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Share, Bookmark } from "lucide-react";

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
    const mainImage =
        post.images?.[0]?.url ??
        (typeof post.links_or_images?.[0] === "string"
            ? post.links_or_images[0]
            : (post.links_or_images?.[0] as any)?.url) ?? "";

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-white max-w-5xl w-full p-6 rounded-xl shadow-lg relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    ❌
                </button>

                <div className="flex gap-8">
                    <div className="w-1/2">
                        <Image
                            src={mainImage}
                            alt={post.title}
                            width={600}
                            height={400}
                            className="rounded-xl object-cover"
                        />
                    </div>
                    <div className="w-1/2 space-y-4">
                        <h1 className="text-2xl font-bold">{post.title}</h1>
                        <p className="text-muted-foreground">{post.description}</p>
                        <div className="flex gap-4 mt-4">
                            <Button>Visit</Button>
                            <Button variant="outline">
                                <Share className="w-4 h-4 mr-2" /> Share
                            </Button>
                            <Button variant="ghost">
                                <Bookmark className="w-4 h-4 mr-2" /> Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
