<<<<<<< HEAD

  export interface UserProfile {
    id: string
    name: string
    email: string
    bio: string
    photo: string
    place: string
    interests: string[]
    followers: string[]
    following: string[]
  }
  
  
=======
export interface UserProfile {
  id: string
  name: string
  email: string
  bio: string
  photo: string
  place: string
  interests: string[]
  followers: string[]
  following: string[]
  likes: string[]
  bookmarks: string[]
  shares: string[]
  posts: string[]
  webItems: string[]
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
  loading: boolean
  error: string | null
}

export interface WebItem {
  id: string
  userLogo: string
  userName: string
  title: string
  description: string
  url: string
  likes: number
  isLiked: boolean
  isBookmarked: boolean
}

export interface FeedState {
  webItems: WebItem[]
  loading: boolean
  error: string | null
}

export interface PostItem {
  id: string
  userId: string
  username: string
  userAvatar: string
  content: string
  images: string[]
  likesCount: number
  isLiked: boolean
  bookmarksCount: number
  isBookmarked: boolean
  createdAt: string
}

export interface PostItemState {
  postItems: PostItem[]
  loading: boolean
  error: string | null
}

>>>>>>> fbab2be (commit code)
