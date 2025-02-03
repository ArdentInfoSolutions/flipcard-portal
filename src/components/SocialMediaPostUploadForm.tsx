"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../lib/hooks"
import { uploadSocialMediaPost } from "../lib/slices/feedSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function SocialMediaPostUploadForm() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    images: [] as File[],
    title: "",
    description: "",
    keywords: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, images: Array.from(e.target.files!) }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
      if (user) {
    // Convert File[] to string[] by creating object URLs
      const imageUrls = formData.images.map((file) => URL.createObjectURL(file))
          dispatch(
              uploadSocialMediaPost({
                  ...formData,
                  images: imageUrls, // Use the array of image URLs instead of File objects
                  userName: user.displayName || "Anonymous"
              }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="images">Images</Label>
        <Input id="images" type="file" onChange={handleFileChange} accept="image/*" multiple required />
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="keywords">Keywords (comma-separated)</Label>
        <Input id="keywords" name="keywords" value={formData.keywords} onChange={handleChange} />
      </div>
      <Button type="submit">Upload Social Media Post</Button>
    </form>
  )
}

