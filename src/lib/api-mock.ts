<<<<<<< HEAD
import type { UserProfile } from "./types"
import type { WebItem, SocialMediaPost } from "../features/feed/types"

// Mock data
=======
import type { WebItem, PostItem } from "./types"

// Mock data
const images = [
    "/images/image1.jpg",
    "/images/image2.jpg",
      "/images/image3.jpg",
    "/images/image4.jpg",
];
  
>>>>>>> fbab2be (commit code)
const mockWebItems: WebItem[] = [
  {
    id: "1",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "TechGuru",
    title: "15 small business website examples for inspiration in 2024",
<<<<<<< HEAD
    description: "The right website can help a small business thrive. Here are 15 of the best small business website examples on the web.",
=======
    description:
      "The right website can help a small business thrive. Here are 15 of the best small business website examples on the web.",
>>>>>>> fbab2be (commit code)
    url: "https://search.google.com/search-console/about",
    likes: 120,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "FoodieDelights",
    title: "Google Sites: Website Creator and Hosting",
<<<<<<< HEAD
    description: "Create personal or business websites for your team, project or event that look great on any device with Google Sites in Google Workspace.",
=======
    description:
      "Create personal or business websites for your team, project or event that look great on any device with Google Sites in Google Workspace.",
>>>>>>> fbab2be (commit code)
    url: "https://foodiedelights.com",
    likes: 85,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "3",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "TechGuru",
    title: "15 small business website examples for inspiration in 2024",
<<<<<<< HEAD
    description: "The right website can help a small business thrive. Here are 15 of the best small business website examples on the web.",
=======
    description:
      "The right website can help a small business thrive. Here are 15 of the best small business website examples on the web.",
>>>>>>> fbab2be (commit code)
    url: "https://search.google.com/search-console/about",
    likes: 120,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "4",
    userLogo: "/placeholder.svg?height=50&width=50",
    userName: "FoodieDelights",
    title: "Google Sites: Website Creator and Hosting",
<<<<<<< HEAD
    description: "Create personal or business websites for your team, project or event that look great on any device with Google Sites in Google Workspace.",
=======
    description:
      "Create personal or business websites for your team, project or event that look great on any device with Google Sites in Google Workspace.",
>>>>>>> fbab2be (commit code)
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
  {
    id: "9",
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
    id: "10",
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

<<<<<<< HEAD
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

  updateUserProfile: (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUserProfile), 500)
    })
  },


=======
export const fetchWebItems = async (): Promise<WebItem[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockWebItems
}

const mockPostItems: PostItem[] = [
  {
    id: "1",
    userId: "user1",
    username: "johndoe",
    userAvatar: "/placeholder-user.png?height=50&width=50",
    content: "Check out this amazing sunset!",
    images: images,
    likesCount: 42,
    isLiked: false,
    bookmarksCount: 5,
    isBookmarked: false,
    createdAt: "2025-02-12T18:30:00Z",
  },
  {
    id: "2",
    userId: "user2",
    username: "janedoe",
    userAvatar: "/placeholder-user.png?height=50&width=50",
    content: "My latest art project",
    images: [
      "/placeholder.svg?height=1000&width=1000",
    ],
    likesCount: 87,
    isLiked: true,
    bookmarksCount: 12,
    isBookmarked: true,
    createdAt: "2025-02-12T15:45:00Z",
  },
  {
    id: "3",
    userId: "user3",
    username: "alexsmith",
    userAvatar: "/placeholder-user.png?height=50&width=50",
    content: "Beautiful day at the beach",
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=800&width=600"],
    likesCount: 65,
    isLiked: false,
    bookmarksCount: 8,
    isBookmarked: false,
    createdAt: "2025-02-12T14:20:00Z",
  },
  {
    id: "4",
    userId: "user4",
    username: "sarahlee",
    userAvatar: "/placeholder-user.png?height=50&width=50",
    content: "Delicious homemade pasta",
    images: ["/placeholder.svg?height=800&width=800"],
    likesCount: 54,
    isLiked: true,
    bookmarksCount: 7,
    isBookmarked: false,
    createdAt: "2025-02-12T13:10:00Z",
  },
  {
    id: "5",
    userId: "user5",
    username: "mikebrown",
    userAvatar: "/placeholder-user.png?height=50&width=50",
    content: "Epic mountain view",
    images: ["/placeholder.svg?height=1200&width=800", "/placeholder.svg?height=800&width=1200"],
    likesCount: 98,
    isLiked: false,
    bookmarksCount: 15,
    isBookmarked: true,
    createdAt: "2025-02-12T11:55:00Z",
  },
]

export const fetchPostItems = async (): Promise<PostItem[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockPostItems
>>>>>>> fbab2be (commit code)
}

