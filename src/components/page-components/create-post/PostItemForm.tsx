"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, ImageIcon } from "lucide-react"
import { useAppSelector } from "@/redux/hooks"
import type { LinkItem } from "@/lib/types"
import WebsiteDetailsForm from "@/components/WebsiteDetailsForm"

interface PostItemFormProps {
  showIn: "web" | "images" | "videos"
}

export default function PostItemForm({ showIn }: PostItemFormProps) {
  const router = useRouter()
  const currentUser = useAppSelector((state) => state.auth.user)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    promo: "",
    description: "",
    url: "",
    categories: [] as string[],
    newCategory: "",
    links: {
      web: [] as LinkItem[],
      images: [] as LinkItem[],
      videos: [] as LinkItem[],
    } as Record<string, LinkItem[]>,
  })

  const [newLink, setNewLink] = useState({ title: "", url: "" })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addCategory = () => {
    if (formData.newCategory.trim()) {
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
    if (newLink.title.trim() && newLink.url.trim()) {
      setFormData((prev) => ({
        ...prev,
        links: {
          ...prev.links,
          [showIn]: [...prev.links[showIn], { id: Date.now(), ...newLink }],
        },
      }))
      setNewLink({ title: "", url: "" })
    }
  }

  const removeLink = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      links: {
        ...prev.links,
        [showIn]: prev.links[showIn].filter((item) => item.id !== id),
      },
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const files = Array.from(e.target.files)
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))

    setSelectedFiles((prev) => [...prev, ...files])
    setFilePreviewUrls((prev) => [...prev, ...newPreviewUrls])

    const newImageItems: LinkItem[] = files.map((file, index) => ({
      id: new Date().getTime() + index,
      title: file.name,
      url: URL.createObjectURL(file),
    }))

    setFormData((prev) => ({
      ...prev,
      links: {
        ...prev.links,
        images: [...prev.links.images, ...newImageItems],
      },
    }))
  }

  const removeFile = (index: number) => {
    URL.revokeObjectURL(filePreviewUrls[index])

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setFilePreviewUrls((prev) => prev.filter((_, i) => i !== index))

    setFormData((prev) => ({
      ...prev,
      links: {
        ...prev.links,
        images: prev.links.images.filter((_, i) => i !== index),
      },
    }))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const postItem = {
      ...formData,
      images: showIn === "images" ? formData.links.images : [],
      videos: showIn === "videos" ? formData.links.videos : [],
      showIn,
      id: Date.now().toString(),
      userLogo: currentUser?.photo || "/placeholder.svg",
      userName: currentUser?.name || "Anonymous",
      createdAt: new Date().toISOString(),
    }

    console.log("Submitting post item:", postItem)

    filePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
  }

  useEffect(() => {
    return () => {
      filePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [filePreviewUrls])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New {showIn.charAt(0).toUpperCase() + showIn.slice(1)} Post</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
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
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
            </div>

            {/* Optional: Add link/image upload fields depending on post type */}
            {showIn === "images" && (
              <div>
                <Label>Upload Images</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {filePreviewUrls.map((url, i) => (
                    <div key={i} className="relative w-24 h-24">
                      <Image src={url} alt="Preview" fill className="object-cover rounded-md" />
                      <Button
                        type="button"
                        size="icon"
                        className="absolute top-0 right-0"
                        onClick={() => removeFile(i)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button type="button" onClick={triggerFileInput} className="mt-2">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Add Images
                </Button>
              </div>
            )}

            {(showIn === "videos" || showIn === "web") && (
              <div className="space-y-2">
                <Label>Add {showIn === "videos" ? "Videos" : "Links"}</Label>
                <div className="flex gap-2">
                  <Input
                    name="title"
                    placeholder="Link title"
                    value={newLink.title}
                    onChange={handleLinkChange}
                  />
                  <Input
                    name="url"
                    placeholder="https://example.com"
                    value={newLink.url}
                    onChange={handleLinkChange}
                  />
                  <Button type="button" onClick={addLink}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.links[showIn].map((link) => (
                    <Badge key={link.id} variant="secondary" className="flex items-center space-x-1">
                      <span>{link.title}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="p-0"
                        onClick={() => removeLink(link.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
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