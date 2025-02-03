"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { fetchSocialMediaPosts } from "../lib/slices/feedSlice"
import SocialMediaPost from "./SocialMediaPost"

export default function SocialMediaFeed() {
  const dispatch = useAppDispatch()
  const { socialMediaPosts, loading, error } = useAppSelector((state) => state.feed)

  useEffect(() => {
    dispatch(fetchSocialMediaPosts())
  }, [dispatch])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      {socialMediaPosts.map((post) => (
        <SocialMediaPost key={post.id} post={post} />
      ))}
    </div>
  )
}

