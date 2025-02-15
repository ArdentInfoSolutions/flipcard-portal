<<<<<<< HEAD
import type { WebItem, SocialMediaPost } from "../features/feed"
import type { UserProfile } from "./types"

const API_BASE_URL = "https://api.example.com"

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const api = {
  fetchWebItems: (): Promise<WebItem[]> => fetchJson(`${API_BASE_URL}/web-items`),

  fetchSocialMediaPosts: (): Promise<SocialMediaPost[]> => fetchJson(`${API_BASE_URL}/social-media-posts`),


  likeWebItem: (id: string, userId: string): Promise<WebItem> =>
    fetchJson(`${API_BASE_URL}/web-items/${id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }),

  bookmarkWebItem: (id: string, userId: string): Promise<WebItem> =>
    fetchJson(`${API_BASE_URL}/web-items/${id}/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }),

  fetchUserProfile: (userId: string): Promise<UserProfile> => fetchJson(`${API_BASE_URL}/users/${userId}`),

  updateUserProfile: (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> =>
    fetchJson(`${API_BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    }),

  uploadWebItem: (webItemData: Partial<WebItem>, userId: string): Promise<WebItem> =>
    fetchJson(`${API_BASE_URL}/web-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...webItemData, userId }),
    }),

  uploadSocialMediaPost: (postData: Partial<SocialMediaPost>, userId: string): Promise<SocialMediaPost> =>
    fetchJson(`${API_BASE_URL}/social-media-posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...postData, userId }),
    }),
=======
import type { UserProfile } from "./types"

export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return {
    id: userId,
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "I love coding and sharing interesting websites! Always learning and exploring new technologies.",
    photo: "/placeholder.svg",
    place: "San Francisco, CA",
    interests: ["Web Development", "AI", "Open Source", "UI/UX Design", "Cloud Computing"],
    followers: ["user2", "user3", "user4", "user5", "user6"],
    following: ["user7", "user8", "user9", "user10", "user11"],
    likes: ["post1", "post2", "webitem1", "webitem2"],
    bookmarks: ["post3", "webitem3", "post4", "webitem4"],
    shares: ["post5", "webitem5"],
    posts: ["post1", "post2", "post3"],
    webItems: ["webitem1", "webitem2", "webitem3"],
  }
>>>>>>> fbab2be (commit code)
}

