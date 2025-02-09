"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { uploadWebItem } from "../features/feed/index"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function WebItemUploadForm() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    logo: null as File | null,
    websiteUrl: "",
    links: [""],
    title: "",
    description: "",
    isOfferAvailable: false,
    keywords: "",
    metaDescription: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, logo: e.target.files![0] }))
    }
  }

  const handleLinksChange = (index: number, value: string) => {
    const newLinks = [...formData.links]
    newLinks[index] = value
    setFormData((prev) => ({ ...prev, links: newLinks }))
  }

  const addLink = () => {
    setFormData((prev) => ({ ...prev, links: [...prev.links, ""] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      dispatch(uploadWebItem({ ...formData, userName: user.displayName || "Anonymous" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="logo">Logo</Label>
        <Input id="logo" type="file" onChange={handleFileChange} accept="image/*" />
      </div>
      <div>
        <Label htmlFor="websiteUrl">Website URL</Label>
        <Input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          value={formData.websiteUrl}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Additional Links</Label>
        {formData.links.map((link, index) => (
          <Input
            key={index}
            type="url"
            value={link}
            onChange={(e) => handleLinksChange(index, e.target.value)}
            className="mt-2"
          />
        ))}
        <Button type="button" onClick={addLink} className="mt-2">
          Add Link
        </Button>
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isOfferAvailable"
          checked={formData.isOfferAvailable}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isOfferAvailable: checked as boolean }))}
        />
        <Label htmlFor="isOfferAvailable">Offer Available</Label>
      </div>
      <div>
        <Label htmlFor="keywords">Keywords (comma-separated)</Label>
        <Input id="keywords" name="keywords" value={formData.keywords} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">Upload WebItem</Button>
    </form>
  )
}

