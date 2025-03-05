"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, ImageIcon } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import type { LinkItem } from "@/lib/types"

interface PostItemFormProps {
  showIn: "web" | "images" | "videos"
}

export default function PostItemForm({ showIn }: PostItemFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((state) => state.auth.user) // Assuming you have user data in your Redux store
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    promo: "",
    description: "",
    url: "",
    categories: [] as string[],
    newCategory: "",
    web: [] as LinkItem[],
    images: [] as LinkItem[],
    videos: [] as LinkItem[],
  })

  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addCategory = () => {
    if (formData.newCategory.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, prev.newCategory.trim()],
        newCategory: "",
      }))
    }
  }

  const removeCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index),
    }))
  }

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewLink((prev) => ({ ...prev, [name]: value }))
  }

  const addLink = () => {
    if (newLink.title.trim() !== "" && newLink.url.trim() !== "") {
      const linkItem: LinkItem = {
        id: Date.now(),
        title: newLink.title.trim(),
        url: newLink.url.trim(),
      }

      setFormData((prev) => ({
        ...prev,
        [showIn]: [...prev[showIn], linkItem],
      }))

      setNewLink({ title: "", url: "" })
    }
  }

  const removeLink = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      [showIn]: prev[showIn].filter((item) => item.id !== id),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...files])

      // Create preview URLs for the selected files
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
      setFilePreviewUrls((prev) => [...prev, ...newPreviewUrls])

      // Add the files to the formData as LinkItems with temporary URLs
      const newImageItems: LinkItem[] = files.map((file) => ({
        id: Date.now() + Math.random(),
        title: file.name,
        url: URL.createObjectURL(file),
      }))

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImageItems],
      }))
    }
  }

  const removeFile = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(filePreviewUrls[index])

    // Remove the file and its preview
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setFilePreviewUrls((prev) => prev.filter((_, i) => i !== index))

    // Remove the corresponding LinkItem
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Create the post item object
    const postItem = {
      title: formData.title,
      promo: formData.promo,
      description: formData.description,
      url: formData.url,
      categories: formData.categories,
      images: showIn === "images" ? formData.images : [],
      pages: showIn === "web" ? formData.web : [],
      videos: showIn === "videos" ? formData.videos : [],
      showIn,
      // These fields are automatically filled
      id: Date.now().toString(),
      userLogo: currentUser?.photo || "/placeholder.svg",
      userName: currentUser?.name || "Anonymous",
      createdAt: new Date().toISOString(),
    }

    // If we have files to upload, we need to handle them
    if (showIn === "images" && selectedFiles.length > 0) {
      // In a real application, you would upload the files to your server here
      // and then update the postItem.images with the actual URLs
      console.log("Files to upload:", selectedFiles)

      // Example of how you might upload files:
      // const uploadedImageUrls = await Promise.all(
      //   selectedFiles.map(async (file) => {
      //     const formData = new FormData()
      //     formData.append('file', file)
      //     const response = await fetch('/api/upload', {
      //       method: 'POST',
      //       body: formData
      //     })
      //     const data = await response.json()
      //     return {
      //       id: Date.now(),
      //       title: file.name,
      //       url: data.url
      //     }
      //   })
      // )
      //
      // postItem.images = uploadedImageUrls
    }

    // Here you would dispatch an action to create the post
    // dispatch(createPostItem(postItem))
    console.log("Submitting post item:", postItem)

    // Clean up object URLs to prevent memory leaks
    filePreviewUrls.forEach((url) => URL.revokeObjectURL(url))

    // Redirect to the feed page after submission
    // router.push("/")
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New {showIn.charAt(0).toUpperCase() + showIn.slice(1)} Post</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="promo">Promotional Text</Label>
              <Input id="promo" name="promo" value={formData.promo} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="url">URL</Label>
              <Input id="url" name="url" type="url" value={formData.url} onChange={handleChange} required />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(index)}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                id="newCategory"
                name="newCategory"
                value={formData.newCategory}
                onChange={handleChange}
                placeholder="Add a category"
              />
              <Button type="button" onClick={addCategory} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>

          {/* Image Upload Section (only for images mode) */}
          {showIn === "images" && (
            <div className="space-y-4">
              <Label>Upload Images</Label>
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload images or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>

              {/* Image Previews */}
              {filePreviewUrls.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Images ({filePreviewUrls.length})</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden border">
                          <Image
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index}`}
                            width={200}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Links (Web Pages or Videos based on showIn prop) */}
          {showIn !== "images" && (
            <div className="space-y-4">
              <Label>Add {showIn.charAt(0).toUpperCase() + showIn.slice(1)}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkTitle">Title</Label>
                  <Input
                    id="linkTitle"
                    name="title"
                    value={newLink.title}
                    onChange={handleLinkChange}
                    placeholder={`${showIn.slice(0, -1)} title`}
                  />
                </div>
                <div>
                  <Label htmlFor="linkUrl">URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="linkUrl"
                      name="url"
                      value={newLink.url}
                      onChange={handleLinkChange}
                      placeholder={`${showIn.slice(0, -1)} URL`}
                    />
                    <Button type="button" onClick={addLink} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Display added links */}
              <div className="space-y-2">
                <h4 className="font-medium">
                  {showIn.charAt(0).toUpperCase() + showIn.slice(1)} ({formData[showIn].length})
                </h4>
                <ul className="space-y-2">
                  {formData[showIn].map((item: LinkItem) => (
                    <li key={item.id} className="flex items-center justify-between text-sm border p-2 rounded">
                      <span className="truncate">{item.title}</span>
                      <button type="button" onClick={() => removeLink(item.id)} className="text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Create Post</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

