import { PostItem } from "@/lib/types";
import PostCard from "./PostCard"; // Reuse your Post component

interface PostListProps {
  posts: PostItem[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
