import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";

export interface PostItemType {
  id: string;
  title: string;
  url: string;
  description: string;
  userName?: string;
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
  videosurl?: string;
  videoweburl?: string;
  videothumb?: string;
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
                console.log("Fetched posts:", dataRaw);

        const data: PostItemType[] = dataRaw.map((post) => ({
          ...post,
          postType: post.post_type,
          links_or_images: post.links_or_images,
          userName:post.user_name,
          createdAt:post.created_at,
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
    <div className="p-4 max-w-7xl mx-auto">
      {videoPosts.length === 0 && <p>No video posts found.</p>}

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {videoPosts.map((post) => (
          <VideoPostCardExtended key={post.id} post={post} />
        ))}
      </div>
    </div>

  );
}



import Image from 'next/image'

 function VideoPostCardExtended({ post }: { post: PostItemType }) {
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
  const videos =
    post.links_or_images?.map((v) =>
      typeof v === "string" ? { url: v } : v
    ) ?? [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header (user info, matches image feed style) */}
      <div className="p-4 flex items-center">
        <img
          src={post.userLogo || "/placeholder-user.png"}
          alt={post.userName}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{post.userName}</span>
          {post.createdAt && (
            <span className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Media (video thumbnail or video) */}
      <div className="relative w-full h-[220px] bg-black">
        <Image
          src={post.videothumb || "/placeholderbg.png"}
          alt="Preview Missing"
          width={800}
          height={400}
          className="w-full h-full object-cover"
        />

        {/* Promo badge overlay */}
        {post.promo && (
          <div className="absolute top-2 left-2">
            <button className="bg-white text-black font-semibold px-3 py-1 rounded-full text-xs">
              {post.promo}
            </button>
          </div>
        )}
      </div>

      {/* Content (title + description) */}
      <div className="px-4 pt-3">
        {post.title && (
          <h2 className="text-sm font-bold mb-1 line-clamp-2">
            {post.title}
          </h2>
        )}
        {post.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {post.description}
          </p>
        )}
      </div>

      {/* Action buttons (kept as-is, just moved to bottom like image feed) */}
      <div className="p-4 flex gap-2">
        <a
          href={post.videosurl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-100 text-black rounded-full py-1 text-sm font-medium hover:bg-gray-200 text-center"
        >
          Watch
        </a>
        <a
          href={
            post.videoweburl
              ? post.videoweburl.startsWith("http")
                ? post.videoweburl
                : `https://${post.videoweburl}`
              : "#"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-600 text-white rounded-full py-1 text-sm font-medium hover:bg-blue-700 text-center"
        >
          Visit Site
        </a>
      </div>
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

