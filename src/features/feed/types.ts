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
  
  export interface SocialMediaPost {
    id: string
    userLogo: string
    userName: string
    images: string[]
    likes: number
    isLiked: boolean
    isBookmarked: boolean
  }
  
  export interface FeedState {
    webItems: WebItem[]
    socialMediaPosts: SocialMediaPost[]
    loading: boolean
    error: string | null
  }
  
  