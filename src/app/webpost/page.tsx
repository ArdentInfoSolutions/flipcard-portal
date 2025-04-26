"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface WebPostData {
    id: number;
    websiteName: string;
    coverPhoto?: string;
    logo?: string;
    overview: string;
    images?: string[];
}

export default function AllWebPosts() {
    const [posts, setPosts] = useState<WebPostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch("/api/website");
                if (!res.ok) throw new Error("Failed to fetch posts");
                const data = await res.json();

                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    throw new Error("Data is not an array");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load posts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

    return (
        <main className="flex flex-col items-center bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Link key={post.id} href={`/preview/${post.id}`}>
                            <div className="flex flex-col  bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 min-h-[160px] border border-gray-100 hover:border-gray-200">
                                {/* Header with logo and title */}
                                <div className="flex items-start gap-3">
                                    <Image
                                        src={post.logo || post.coverPhoto || "/placeholder.jpg"}
                                        alt={post.websiteName}
                                        width={48}
                                        height={48}
                                        className="rounded-md object-cover border border-gray-200"
                                    />
                                    <div className="flex flex-col">
                                        <h2
                                            className={`font-semibold text-gray-800 leading-tight ${post.websiteName.length < 12
                                                    ? "text-lg"
                                                    : post.websiteName.length < 20
                                                        ? "text-base"
                                                        : "text-sm"
                                                } line-clamp-1`}
                                        >
                                            {post.websiteName}
                                        </h2>
                                        <p className="text-xs text-gray-500 mt-0.5">Website</p>
                                    </div>
                                </div>

                                {/* Overview */}
                                <p className="text-sm text-gray-700 mt-3 line-clamp-3 leading-snug">
                                    {post.overview}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500 text-sm">No posts available</p>
                )}
            </div>
        </main>

    );
}



// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// interface WebPostData {
//     id: number;
//     websiteName: string;
//     coverPhoto?: string;
//     logo?: string;
//     overview: string;
//     images?: string[];
// }

// export default function AllWebPosts() {
//     const [posts, setPosts] = useState<WebPostData[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchAll = async () => {
//             try {
//                 const res = await fetch("/api/website");
//                 if (!res.ok) throw new Error("Failed to fetch posts");
//                 const data = await res.json();

//                 if (Array.isArray(data)) {
//                     setPosts(data);
//                 } else {
//                     throw new Error("Data is not an array");
//                 }
//             } catch (err) {
//                 console.error(err);
//                 setError("Failed to load posts. Please try again later.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAll();
//     }, []);

//     if (loading) return <div className="text-center mt-8">Loading...</div>;
//     if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

//     return (
//         <main className="flex flex-col items-center bg-white">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 w-full max-w-6xl">
//                 {posts.length > 0 ? (
//                     posts.map((post) => (
//                         <Link key={post.id} href={`/preview/${post.id}`}>
//                             <div className="flex flex-col p-4 shadow rounded-lg bg-white hover:shadow-xl transition-all">
//                                 <div className="flex items-start gap-3">
//                                     <Image
//                                         src={post.logo || post.coverPhoto || "/placeholder.jpg"}
//                                         alt={post.websiteName}
//                                         width={50}
//                                         height={50}
//                                         className="rounded-lg object-cover"
//                                     />
//                                     <div className="flex flex-col">
//                                         <h2 className="text-lg font-semibold text-gray-500 cursor-pointer hover:underline">
//                                             {post.websiteName}
//                                         </h2>
//                                         <p className="text-sm text-gray-500">Website</p>
//                                     </div>
//                                 </div>
//                                 <p className="text-sm text-black mt-2">{post.overview}</p>
//                             </div>
//                         </Link>
//                     ))
//                 ) : (
//                     <p className="text-center col-span-full">No posts available</p>
//                 )}
//             </div>
//         </main>
//     );
// }

