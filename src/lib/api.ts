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
}

