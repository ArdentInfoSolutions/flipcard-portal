import type { PostItem } from "./types"

// Mock data
let mockPostItems: PostItem[] = [
  {
    id: "1",
    userLogo: "/placeholder-user.png",
    userName: "TechGuru",
    title: "15 small business website examples for inspiration in 2024",
    promo: "Check out these inspiring small business websites!",
    description:
      "The right website can help a small business thrive. Here are 15 of the best small business website examples on the web.",
    url: "https://search.google.com/search-console/about",
    categories: ["Business", "Web Design"],
    images: [],
    pages: [{ id: 1, title: "Privacy", url: "/privacy.html" }],
    videos: [],
    showIn: "web",
    likes: 120,
    
    isLiked: false,
    bookmarks: 30,
    isBookmarked: false,
    createdAt: "2025-02-12T18:30:00Z",
  },
  {
    id: "2",
    userLogo: "/placeholder-user.png",
    userName: "FoodieDelights",
    title: "Delicious homemade pasta",
    promo: "Check out this mouth-watering homemade pasta!",
    description: "",
    url: "https://foodiedelights.com/pasta",
    categories: ["Food", "Recipes"],
    images: [
      { id: 1, title: "Homemade Pasta", url: "/images/image1.jpg" },
      { id: 2, title: "Pasta Sauce", url: "/images/image2.jpg" },
      { id: 3, title: "Pasta Salad", url: "/images/image3.jpg" },
    ],
    pages: [],
    videos: [],
    showIn: "images",
    likes: 85,
    isLiked: true,
    bookmarks: 15,
    isBookmarked: true,
    createdAt: "2025-02-12T15:45:00Z",
  },
  {
    id: "3",
    userLogo: "/placeholder-user.png",
    userName: "Biz Videos",
    title: "Delicious Recipe Videos",
    promo: "Check out this mouth-watering homemade pasta!",
    description: "",
    url: "https://foodiedelights.com/pasta",
    categories: ["Food", "Recipes"],
    images: [{ id: 1, title: "Homemade Pasta", url: "/images/image4.jpg" }],
    pages: [],
    videos: [{ id: 1, title: "Recipe", url: "/recipe.html" }],
    showIn: "videos",
    likes: 85,
    isLiked: true,
    bookmarks: 15,
    isBookmarked: true,
    createdAt: "2025-02-12T15:45:00Z",
  }
  // Add more mock items as needed
]

// Function to find a post by ID
const findPostById = (postId: string): PostItem | undefined =>
  mockPostItems.find((item) => item.id === postId);

export const fetchAllPostItems = async (): Promise<PostItem[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockPostItems
}

export const fetchImagePostItems = async (): Promise<PostItem[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockPostItems.filter((item) => item.showIn === "images")
}

export const fetchVideoPostItems = async (): Promise<PostItem[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockPostItems.filter((item) => item.showIn === "videos")
}

export const fetchWebPostItems = async (): Promise<PostItem[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockPostItems.filter((item) => item.showIn === "web")
}

export const likePost = async (postId: string): Promise<{ isLiked: boolean; likes: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
  console.log("In API:", postId);
  const postIndex = mockPostItems.findIndex((item) => item.id === postId);
  if (postIndex === -1) {
    throw new Error("Post not found");
  }
  let post = { ...mockPostItems[postIndex] }; // Create a copy
  
  console.log("Post before:", post);
  try {
    // Create a new array with the updated post
  mockPostItems = mockPostItems.map((item, index) =>
    index === postIndex
      ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? (item.likes ?? 0) - 1 : (item.likes ?? 0) + 1 }
      : item
    );
    post = { ...mockPostItems[postIndex] };
    console.log("Post after:", post); // Log the updated array
  } catch (error) {
    console.log("Error:", error);
  }
  console.log("response from api:", post.isLiked, post.likes); 
  return { isLiked: post.isLiked ?? false, likes: post.likes ?? 0 };
}; 

export const bookmarkPost = async (postId: string): Promise<{ isBookmarked: boolean; bookmarks: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
  console.log("In API:", postId);
  const postIndex = mockPostItems.findIndex((item) => item.id === postId);
  if (postIndex === -1) {
    throw new Error("Post not found");
  }
  let post = { ...mockPostItems[postIndex] }; // Create a copy
  
  console.log("Post before:", post);
  try {
    // Create a new array with the updated post
  mockPostItems = mockPostItems.map((item, index) =>
    index === postIndex
      ? { ...item, isBookmarked: !item.isBookmarked, bookmarks: item.isBookmarked ? (item.bookmarks ?? 0) - 1 : (item.bookmarks ?? 0) + 1 }
      : item
    );
    post = { ...mockPostItems[postIndex] };
    console.log("Post after:", post); // Log the updated array
  } catch (error) {
    console.log("Error:", error);
  }
  console.log("response from api:", post.isBookmarked, post.bookmarks); 
  return { isBookmarked: post.isBookmarked ?? false, bookmarks: post.bookmarks ?? 0 };
}; 

export const createPostItem = async (postItem: PostItem): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate success or failure
  if (Math.random() > 0.1) {
    console.log("Post created successfully:", postItem)
  } else {
    throw new Error("Failed to create post")
  }
}