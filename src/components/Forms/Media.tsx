"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter,usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, ImageIcon, VideoIcon } from "lucide-react"
import { useAppSelector } from "@/redux/hooks"
import type { LinkItem } from "@/lib/types"

interface PostMediaFormProps {
    showIn: "images" | "videos"
    
}

export default function PostMediaForm({ showIn }: PostMediaFormProps) {
    const Pathname = usePathname()
    const router = useRouter()
    const currentUser = useAppSelector((state) => state.auth.user)
    const fileInputRef = useRef<HTMLInputElement>(null)

    if(Pathname.startsWith("/webpost")) return null

    const [formData, setFormData] = useState({
        title: "",
        promo: "",
        description: "",
        categories: [] as string[],
        newCategory: "",
        images: [] as LinkItem[],
        videos: [] as LinkItem[],
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)

            const newMediaItems: LinkItem[] = files.map((file) => ({
                id: Date.now() + Math.random(),
                title: file.name,
                url: URL.createObjectURL(file),
            }))

            setSelectedFiles((prev) => [...prev, ...files])
            setFilePreviewUrls((prev) => [...prev, ...newMediaItems.map((item) => item.url)])

            setFormData((prev) => ({
                ...prev,
                [showIn]: [...(prev[showIn] as LinkItem[]), ...newMediaItems],
            }))
        }
    }

    const removeFile = (index: number) => {
        URL.revokeObjectURL(filePreviewUrls[index])

        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
        setFilePreviewUrls((prev) => prev.filter((_, i) => i !== index))

        setFormData((prev) => ({
            ...prev,
            [showIn]: (prev[showIn] as LinkItem[]).filter((_, i) => i !== index),
        }))
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const postItem = {
            title: formData.title,
            promo: formData.promo,
            description: formData.description,
            categories: formData.categories,
            images: showIn === "images" ? formData.images : [],
            videos: showIn === "videos" ? formData.videos : [],
            showIn,
            id: Date.now().toString(),
            userLogo: currentUser?.photo || "/placeholder.svg",
            userName: currentUser?.name || "Anonymous",
            createdAt: new Date().toISOString(),
        }

        console.log("Submitting media post:", postItem)

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
                <CardTitle>Create New {showIn === "images" ? "Image" : "Video"} Post</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />

                        <Label htmlFor="promo">Promotional Text</Label>
                        <Input id="promo" name="promo" value={formData.promo} onChange={handleChange} />

                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
                    </div>

                    <Label>Categories</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.categories.map((category, index) => (
                            <Badge key={index} variant="secondary">
                                {category}
                                <button type="button" onClick={() => removeCategory(index)} className="ml-1 rounded-full hover:bg-gray-200 p-0.5">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input id="newCategory" name="newCategory" value={formData.newCategory} onChange={handleChange} placeholder="Add a category" />
                        <Button type="button" onClick={addCategory} size="sm">
                            <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                    </div>

                    <Label>Upload {showIn === "images" ? "Images" : "Videos"}</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50" onClick={triggerFileInput}>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={showIn === "images" ? "image/*" : "video/*"} multiple className="hidden" />
                        {showIn === "images" ? <ImageIcon className="h-12 w-12 text-gray-400" /> : <VideoIcon className="h-12 w-12 text-gray-400" />}
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    </div>

                    {filePreviewUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {filePreviewUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                    <Image src={url} alt="Preview" width={200} height={200} />
                                    <button type="button" onClick={() => removeFile(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit">Create Post</Button>
                </CardFooter>
            </form>
        </Card>
    )
}
