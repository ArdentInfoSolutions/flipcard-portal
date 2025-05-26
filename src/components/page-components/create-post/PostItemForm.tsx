"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PostType = "web" | "videos" | "images";

interface PostItemFormProps {
  showIn: PostType;
}

export default function PostItemForm({ showIn }: PostItemFormProps) {
  const postType = showIn;

  const [title, setTitle] = useState("");
  const [promo, setPromo] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  // For web links only
  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // For images & videos (file uploads)
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleAddLink = () => {
    if (linkTitle && linkUrl) {
      setLinks([...links, { title: linkTitle, url: linkUrl }]);
      setLinkTitle("");
      setLinkUrl("");
    }
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages([...selectedImages, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedVideos([...selectedVideos, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveVideo = (index: number) => {
    const newVideos = [...selectedVideos];
    newVideos.splice(index, 1);
    setSelectedVideos(newVideos);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) return alert("Title is required");
    if (categories.length === 0) return alert("Add at least one category");
    if (postType === "web" && links.length === 0)
      return alert("Add at least one link");
    if (postType === "images" && selectedImages.length === 0)
      return alert("Upload at least one image");
    if (postType === "videos" && selectedVideos.length === 0)
      return alert("Upload at least one video");

    try {
      let imagesBase64: string[] = [];
      let videosBase64: string[] = [];

      if (postType === "images") {
        imagesBase64 = await Promise.all(selectedImages.map(fileToBase64));
      }

      if (postType === "videos") {
        videosBase64 = await Promise.all(selectedVideos.map(fileToBase64));
      }

      const payload: any = {
        title: title.trim(),
        promo: promo.trim() || null,
        description: description.trim(),
        postType,
        categories,
      };

      if (postType === "web") payload.webLinks = links;
      else if (postType === "videos") payload.videos = videosBase64;
      else if (postType === "images") payload.images = imagesBase64;

      const res = await fetch("/api/postitem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { error: rawText };
      }

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert("Post created successfully!");
      setTitle("");
      setPromo("");
      setDescription("");
      setCategories([]);
      setLinks([]);
      setSelectedImages([]);
      setSelectedVideos([]);
    } catch (error) {
      alert("Error: " + (error as Error).message);
      console.error("Submit error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 max-w-2xl mx-auto">
      <div>
        <Label>Post Type: {postType.toUpperCase()}</Label>
      </div>

      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <Label>Promo Line</Label>
        <Input value={promo} onChange={(e) => setPromo(e.target.value)} />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Dynamic Field Based on Post Type */}
      {postType === "web" ? (
        <div>
          <Label>Web Links</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Link title"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
            />
            <Input
              placeholder="URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <Button type="button" onClick={handleAddLink}>
              Add
            </Button>
          </div>

          <ul className="mt-3 space-y-1">
            {links.map((link, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>
                  {link.title}:{" "}
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.url}
                  </a>
                </span>
                <Button variant="ghost" size="sm" onClick={() => removeLink(i)}>
                  ❌
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : postType === "videos" ? (
        <div>
          <Label>Upload Videos</Label>
          <Input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoChange}
          />
          <div className="flex flex-wrap gap-3 mt-3">
            {selectedVideos.map((video, i) => (
              <div key={i} className="relative w-32 h-24">
                <video
                  src={URL.createObjectURL(video)}
                  controls
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVideo(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : postType === "images" ? (
        <div>
          <Label>Upload Images</Label>
          <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
          <div className="flex flex-wrap gap-3 mt-3">
            {selectedImages.map((image, i) => (
              <div key={i} className="relative w-24 h-24">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Image ${i}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Categories */}
      <div>
        <Label>Categories</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Add category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button type="button" onClick={handleAddCategory}>
            Add
          </Button>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <li
              key={i}
              className="bg-blue-200 px-3 py-1 rounded flex items-center gap-1"
            >
              {cat}
              <button
                type="button"
                onClick={() => removeCategory(i)}
                className="text-red-600 font-bold"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Button type="submit" className="w-full">
        Submit Post
      </Button>
    </form>
  );
}


// "use client"

// import { useState, useRef, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { X, Plus, ImageIcon } from "lucide-react"
// import { useAppSelector } from "@/redux/hooks"
// import type { LinkItem } from "@/lib/types"
// import WebsiteDetailsForm from "@/components/WebsiteDetailsForm"

// interface PostItemFormProps {
//   showIn: "web" | "images" | "videos"
// }

// export default function PostItemForm({ showIn }: PostItemFormProps) {
//   const router = useRouter()
//   const currentUser = useAppSelector((state) => state.auth.user)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const [formData, setFormData] = useState({
//     title: "",
//     promo: "",
//     description: "",
//     url: "",
//     categories: [] as string[],
//     newCategory: "",
//     links: {
//       web: [] as LinkItem[],
//       images: [] as LinkItem[],
//       videos: [] as LinkItem[],
//     } as Record<string, LinkItem[]>,
//   })

//   const [newLink, setNewLink] = useState({ title: "", url: "" })
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([])
//   const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const addCategory = () => {
//     if (formData.newCategory.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         categories: [...prev.categories, prev.newCategory.trim()],
//         newCategory: "",
//       }))
//     }
//   }

//   const removeCategory = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       categories: prev.categories.filter((_, i) => i !== index),
//     }))
//   }

//   const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setNewLink((prev) => ({ ...prev, [name]: value }))
//   }

//   const addLink = () => {
//     if (newLink.title.trim() && newLink.url.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         links: {
//           ...prev.links,
//           [showIn]: [...prev.links[showIn], { id: Date.now(), ...newLink }],
//         },
//       }))
//       setNewLink({ title: "", url: "" })
//     }
//   }

//   const removeLink = (id: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       links: {
//         ...prev.links,
//         [showIn]: prev.links[showIn].filter((item) => item.id !== id),
//       },
//     }))
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return

//     const files = Array.from(e.target.files)
//     const newPreviewUrls = files.map((file) => URL.createObjectURL(file))

//     setSelectedFiles((prev) => [...prev, ...files])
//     setFilePreviewUrls((prev) => [...prev, ...newPreviewUrls])

//     const newImageItems: LinkItem[] = files.map((file, index) => ({
//       id: new Date().getTime() + index,
//       title: file.name,
//       url: URL.createObjectURL(file),
//     }))

//     setFormData((prev) => ({
//       ...prev,
//       links: {
//         ...prev.links,
//         images: [...prev.links.images, ...newImageItems],
//       },
//     }))
//   }

//   const removeFile = (index: number) => {
//     URL.revokeObjectURL(filePreviewUrls[index])

//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
//     setFilePreviewUrls((prev) => prev.filter((_, i) => i !== index))

//     setFormData((prev) => ({
//       ...prev,
//       links: {
//         ...prev.links,
//         images: prev.links.images.filter((_, i) => i !== index),
//       },
//     }))
//   }

//   const triggerFileInput = () => {
//     fileInputRef.current?.click()
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const postItem = {
//       ...formData,
//       images: showIn === "images" ? formData.links.images : [],
//       videos: showIn === "videos" ? formData.links.videos : [],
//       showIn,
//       id: Date.now().toString(),
//       userLogo: currentUser?.photo || "/placeholder.svg",
//       userName: currentUser?.name || "Anonymous",
//       createdAt: new Date().toISOString(),
//     }

//     console.log("Submitting post item:", postItem)

//     filePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
//   }

//   useEffect(() => {
//     return () => {
//       filePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
//     }
//   }, [filePreviewUrls])

//   return (
//     <Card className="w-full max-w-3xl mx-auto">
//       <CardHeader>
//         <CardTitle>Create New {showIn.charAt(0).toUpperCase() + showIn.slice(1)} Post</CardTitle>
//       </CardHeader>

//       <form onSubmit={handleSubmit}>
//         <CardContent className="space-y-6">
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="title">Title</Label>
//               <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
//             </div>

//             <div>
//               <Label htmlFor="promo">Promotional Text</Label>
//               <Input id="promo" name="promo" value={formData.promo} onChange={handleChange} />
//             </div>

//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
//             </div>

//             {/* Optional: Add link/image upload fields depending on post type */}
//             {showIn === "images" && (
//               <div>
//                 <Label>Upload Images</Label>
//                 <div className="flex flex-wrap gap-4 mt-2">
//                   {filePreviewUrls.map((url, i) => (
//                     <div key={i} className="relative w-24 h-24">
//                       <Image src={url} alt="Preview" fill className="object-cover rounded-md" />
//                       <Button
//                         type="button"
//                         size="icon"
//                         className="absolute top-0 right-0"
//                         onClick={() => removeFile(i)}
//                       >
//                         <X className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />
//                 <Button type="button" onClick={triggerFileInput} className="mt-2">
//                   <ImageIcon className="mr-2 h-4 w-4" />
//                   Add Images
//                 </Button>
//               </div>
//             )}

//             {(showIn === "videos" || showIn === "web") && (
//               <div className="space-y-2">
//                 <Label>Add {showIn === "videos" ? "Videos" : "Links"}</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     name="title"
//                     placeholder="Link title"
//                     value={newLink.title}
//                     onChange={handleLinkChange}
//                   />
//                   <Input
//                     name="url"
//                     placeholder="https://example.com"
//                     value={newLink.url}
//                     onChange={handleLinkChange}
//                   />
//                   <Button type="button" onClick={addLink}>
//                     <Plus className="w-4 h-4" />
//                   </Button>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   {formData.links[showIn].map((link) => (
//                     <Badge key={link.id} variant="secondary" className="flex items-center space-x-1">
//                       <span>{link.title}</span>
//                       <Button
//                         type="button"
//                         size="icon"
//                         variant="ghost"
//                         className="p-0"
//                         onClick={() => removeLink(link.id)}
//                       >
//                         <X className="w-3 h-3" />
//                       </Button>
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>

//         <CardFooter className="flex justify-between">
//           <Button type="button" variant="outline" onClick={() => router.back()}>
//             Cancel
//           </Button>
//           <Button type="submit">Create Post</Button>
//         </CardFooter>
//       </form>
//     </Card>
//   )
// }