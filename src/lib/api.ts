import type { WebItem, SocialMediaPost, UserProfile } from "@/lib/types"

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
}

