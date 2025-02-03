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
  
  