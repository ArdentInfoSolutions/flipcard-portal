import type { WebItem, PostItem } from "./types"

// Mock data
const mockWebItems: WebItem[] = [
  {
    id: "1",
    userLogo: "/globe.svg?height=50&width=50",
    userName: "TechGuru",
    title: "15 small business website examples for inspiration in 2024",
    description:
      "The right website can help a small business thrive. Here are 15 of the best small business website examples on the web.",
    url: "https://search.google.com/search-console/about",
    likes: 120,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    userLogo: "/globe.svg?height=50&width=50",
    userName: "FoodieDelights",
    title: "Google Sites: Website Creator and Hosting",
    description:
      "Create personal or business websites for your team, project or event that look great on any device with Google Sites in Google Workspace.",
    url: "https://foodiedelights.com",
    likes: 85,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "3",
    userLogo: "/globe.svg?height=50&width=50",
    userName: "TechGuru",
    title: "15 small business website examples for inspiration in 2024",
    description:
      "The right website can help a small business thrive. Here are 15 of the best small business website examples on the web.",
    url: "https://search.google.com/search-console/about",
    likes: 120,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "4",
    userLogo: "/globe.svg?height=50&width=50",
    userName: "FoodieDelights",
    title: "Google Sites: Website Creator and Hosting",
    description:
      "Create personal or business websites for your team, project or event that look great on any device with Google Sites in Google Workspace.",
    url: "https://foodiedelights.com",
    likes: 85,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "5",
    userLogo: "/globe.svg?height=50&width=50",
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
    userLogo: "/globe.svg?height=50&width=50",
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
    userLogo: "/globe.svg?height=50&width=50",
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
    userLogo: "/globe.svg?height=50&width=50",
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
    userLogo: "/globe.svg?height=50&width=50",
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
    userLogo: "/globe.svg?height=50&width=50",
    userName: "FoodieDelights",
    title: "Gourmet Recipes",
    description: "Delicious recipes for food enthusiasts.",
    url: "https://foodiedelights.com",
    likes: 85,
    isLiked: true,
    isBookmarked: true,
  },
]

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
    images: ["/images//image1.jpg?height=800&width=600", "/images//image2.jpg?height=600&width=800"],
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
      "/images//image1.jpg?height=1000&width=1000",
      "/images//image2.jpg?height=800&width=600",
      "/images//image3.jpg?height=600&width=800",
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
    images: ["/images//image1.jpg?height=600&width=800", "/images//image2.jpg?height=800&width=600"],
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
    images: ["/images//image1.jpg?height=800&width=800"],
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
    images: ["/images//image1.jpg?height=1200&width=800", "/images//image2.jpg?height=800&width=1200"],
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
}

