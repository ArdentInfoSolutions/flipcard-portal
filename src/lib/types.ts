export interface LinkItem {
  id: number
  title: string | null
  url: string
}

export interface PostItem {
  id: string;
  userLogo?: string;
  userName?: string;
  title: string;
  promo?: string;
  description?: string;
  url: string;
  categories?: string[];
  images?: LinkItem[];
  postType?: "web" | "images" | "videos" | "pages";
  links_or_images?: string[];
  pages?: LinkItem[];
  videos?: LinkItem[];
  showIn?: "web" | "images" | "videos";
  likes?: number | null;
  isLiked?: boolean | null;
  bookmarks?: number | null;
  isBookmarked?: boolean | null;
  createdAt: string;
  type?: 'image' | 'video' | 'web' | 'text';
}


export interface UserProfile {
  userId: string
  name: string
  email: string
  bio: string
  photo: string
  place: string
  latitude: number
  longitude: number
  interests: string[]
  followers: string[]
  following: string[]
  likes: string[]
  bookmarks: string[]
  shares: string[]
  posts: string[]
  about: { title: string; details: string }[]
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
  loading: boolean
  error: string | null
}

export interface FeedState {
  posts: PostItem[]
  loading: boolean
  error: string | null
}

export interface PostItemState {
  postItems: PostItem[]
  loading: boolean
  error: string | null
}

export interface LikePostState {
  loading: boolean;
  error: string | null;
  likedPosts: {
    [postId: string]: { isLiked: boolean, likes: number }
  }; // Object to track liked post
}

export interface BookmarkPostState {
  loading: boolean;
  error: string | null;
  bookmarkedPosts: {
    [postId: string]: { isBookmarked: boolean, bookmarks: number }
  }; // Object to track bookmarked post
}
// existing exports

export interface WebItem {
  id: string
  url: string
  title: string
  description: string
  userName: string
  userLogo?: string
  isLiked: boolean
  isBookmarked: boolean
}