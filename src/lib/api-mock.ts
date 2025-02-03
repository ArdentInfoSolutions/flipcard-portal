import type { WebItem, SocialMediaPost, UserProfile } from "./types"

// Mock data
const mockWebItems: WebItem[] = [
  {
    id: "1",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "TechGuru",
    title: "Latest Tech Trends",
    description: "Exploring cutting-edge technologies shaping our future.",
    url: "https://techguru.com",
    likes: 120,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "FoodieDelights",
    title: "Gourmet Recipes",
    description: "Delicious recipes for food enthusiasts.",
    url: "https://foodiedelights.com",
    likes: 85,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "3",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "TechGuru",
    title: "Latest Tech Trends",
    description: "Exploring cutting-edge technologies shaping our future.",
    url: "https://techguru.com",
    likes: 120,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "4",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "FoodieDelights",
    title: "Gourmet Recipes",
    description: "Delicious recipes for food enthusiasts.",
    url: "https://foodiedelights.com",
    likes: 85,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "5",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "TechGuru",
    title: "Latest Tech Trends",
    description: "Exploring cutting-edge technologies shaping our future.",
    url: "https://techguru.com",
    likes: 120,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "6",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "FoodieDelights",
    title: "Gourmet Recipes",
    description: "Delicious recipes for food enthusiasts.",
    url: "https://foodiedelights.com",
    likes: 85,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "7",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "TechGuru",
    title: "Latest Tech Trends",
    description: "Exploring cutting-edge technologies shaping our future.",
    url: "https://techguru.com",
    likes: 120,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "8",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "FoodieDelights",
    title: "Gourmet Recipes",
    description: "Delicious recipes for food enthusiasts.",
    url: "https://foodiedelights.com",
    likes: 85,
    isLiked: true,
    isBookmarked: true,
  },
]

const mockSocialMediaPosts: SocialMediaPost[] = [
  {
    id: "1",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "TravelBug",
    images: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
    likes: 250,
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "2",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "FitnessFreak",
    images: ["/placeholder.svg?height=300&width=300"],
    likes: 180,
    isLiked: false,
    isBookmarked: true,
  },
]

const mockUserProfile: UserProfile = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  bio: "Passionate about technology and travel",
  photo: "/placeholder.svg?height=100&width=100",
  place: "New York, USA",
  interests: ["Technology", "Travel", "Food"],
  followers: ["2", "3", "4"],
  following: ["5", "6"],
}

// Mock API functions
export const api = {
  fetchWebItems: (): Promise<WebItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockWebItems), 500)
    })
  },

  fetchSocialMediaPosts: (): Promise<SocialMediaPost[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSocialMediaPosts), 500)
    })
  },

  fetchUserProfile: (userId: string): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUserProfile), 500)
    })
  },

  likeWebItem: (id: string, userId: string): Promise<WebItem> => {
    return new Promise((resolve) => {
      const item = mockWebItems.find((item) => item.id === id)
      if (item) {
        item.isLiked = !item.isLiked
        item.likes += item.isLiked ? 1 : -1
      }
      setTimeout(() => resolve(item!), 300)
    })
  },

  bookmarkWebItem: (id: string, userId: string): Promise<WebItem> => {
    return new Promise((resolve) => {
      const item = mockWebItems.find((item) => item.id === id)
      if (item) {
        item.isBookmarked = !item.isBookmarked
      }
      setTimeout(() => resolve(item!), 300)
    })
  },

  uploadWebItem: (webItemData: Partial<WebItem>, userId: string): Promise<WebItem> => {
    return new Promise((resolve) => {
      const newItem: WebItem = {
        id: String(mockWebItems.length + 1),
        userLogo: "/placeholder.svg?height=50&width=50",
        userName: userId,
        title: webItemData.title || "",
        description: webItemData.description || "",
        url: webItemData.url || "",
        likes: 0,
        isLiked: false,
        isBookmarked: false,
      }
      mockWebItems.push(newItem)
      setTimeout(() => resolve(newItem), 500)
    })
  },

  uploadSocialMediaPost: (postData: Partial<SocialMediaPost>, userId: string): Promise<SocialMediaPost> => {
    return new Promise((resolve) => {
      const newPost: SocialMediaPost = {
        id: String(mockSocialMediaPosts.length + 1),
        userLogo: "/placeholder.svg?height=50&width=50",
        userName: userId,
        images: postData.images || [],
        likes: 0,
        isLiked: false,
        isBookmarked: false,
      }
      mockSocialMediaPosts.push(newPost)
      setTimeout(() => resolve(newPost), 500)
    })
  },
}

