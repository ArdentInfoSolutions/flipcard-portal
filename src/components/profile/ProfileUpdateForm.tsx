"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Camera } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectUser } from "@/features/auth/authSelectors"
import type { UserProfile } from "@/lib/types"
import { LocationSearch } from "@/components/profile/LocationSearch"

export default function ProfileUpdateForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectUser)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: "",
    email: "",
    bio: "",
    photo: "",
    place: "",
    interests: [],
  })

  const [newInterest, setNewInterest] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load current user data when available
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        bio: currentUser.bio,
        photo: currentUser.photo,
        place: currentUser.place,
        interests: [...currentUser.interests],
      })
    }
  }, [currentUser])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationSelect = (location: string) => {
    setFormData((prev) => ({ ...prev, place: location }))
  }

  const addInterest = () => {
    if (newInterest.trim() !== "" && formData.interests) {
      setFormData((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), newInterest.trim()],
      }))
      setNewInterest("")
    }
  }

  const removeInterest = (index: number) => {
    if (formData.interests) {
      setFormData((prev) => ({
        ...prev,
        interests: prev.interests?.filter((_, i) => i !== index),
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPhotoPreview(previewUrl)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create a copy of the form data for submission
      const updatedProfile = { ...formData }

      // Handle file upload if a new photo was selected
      if (selectedFile) {
        // In a real application, you would upload the file to your server here
        // and then update the photo URL
        console.log("File to upload:", selectedFile)

        // Example of how you might upload the profile photo:
        // const formData = new FormData()
        // formData.append('file', selectedFile)
        // const response = await fetch('/api/upload-profile-photo', {
        //   method: 'POST',
        //   body: formData
        // })
        // const data = await response.json()
        // updatedProfile.photo = data.url
      }

      // Here you would dispatch an action to update the user profile
      // dispatch(updateUserProfile(updatedProfile))
      console.log("Submitting updated profile:", updatedProfile)

      // Clean up object URL to prevent memory leaks
      if (photoPreview && photoPreview !== currentUser?.photo) {
        URL.revokeObjectURL(photoPreview)
      }

      // Show success message or redirect
      // router.push("/profile")
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentUser) {
    return <div>Loading user data...</div>
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Update Your Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group cursor-pointer" onClick={triggerFileInput}>
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-gray-200">
                <Image
                  src={photoPreview || formData.photo || "/placeholder.svg"}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
            <p className="text-sm text-gray-500">Click to change profile photo</p>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={formData.bio || ""} onChange={handleChange} rows={3} />
            </div>

            <div>
              <Label htmlFor="place">Location</Label>
              <LocationSearch initialValue={formData.place || ""} onSelect={handleLocationSelect} />
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.interests?.map((interest, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(index)}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="newInterest"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest"
              />
              <Button type="button" onClick={addInterest} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

