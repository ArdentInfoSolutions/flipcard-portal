"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type PostType = "web" | "videos" | "images";

interface PostItemFormProps {
  showIn: PostType;
}

export default function PostItemForm({ showIn }: PostItemFormProps) {
  const postType = showIn;
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [promo, setPromo] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isShortVideo, setIsShortVideo] = useState(false);

  const [imageItems, setImageItems] = useState<{ file: File | null; url: string }[]>([{ file: null, url: "" }]);
  const [videoItems, setVideoItems] = useState<{ videoUrl: string; url: string }[]>([{ videoUrl: "", url: "" }]);

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
    if (postType !== "videos" && !description.trim()) return alert("Description is required");
    if (categories.length === 0) return alert("Add at least one category");
    if (postType === "web" && links.length === 0) return alert("Add at least one link");
    if (postType === "images" && imageItems.filter((item) => item.file).length === 0)
      return alert("Upload at least one image");
    if (postType === "videos" && videoItems.filter((v) => v.videoUrl.trim()).length === 0)
      return alert("Add at least one video URL");

    try {
      if (!session?.user?.id) {
        alert("You must be logged in to submit a post.");
        return;
      }

      let imagesBase64: { base64: string; url: string }[] = [];
      let videos: { videoUrl: string; url: string }[] = [];

      if (postType === "images" || postType === "videos") {
        imagesBase64 = await Promise.all(
          imageItems.map(async (item) => {
            if (!item.file) throw new Error("Image file missing");
            const base64 = await fileToBase64(item.file);
            return { base64, url: item.url };
          })
        );
      }

      const payload: any = {
        title: title.trim(),
        promo: promo.trim() || null,
        description: postType === "videos" ? null : description.trim(),
        postType,
        categories,
        userId: String(session.user.id),
        profilePhoto: session.user.image || "",
      };

      if (postType === "web") payload.webLinks = links;
      if (postType === "videos") {
        payload.videos = videos;
        payload.thumbnail = imagesBase64[0];
        payload.isShortvideo = isShortVideo;
      }
      if (postType === "images") payload.images = imagesBase64;

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

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      alert("✅ Post created successfully!");
      setTitle("");
      setPromo("");
      setDescription("");
      setCategories([]);
      setLinks([]);
      setImageItems([{ file: null, url: "" }]);
      setVideoItems([{ videoUrl: "", url: "" }]);
    } catch (error) {
      alert("❌ Error: " + (error as Error).message);
      console.error("Submit error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 p-4 max-w-2xl w-full mx-auto bg-white rounded shadow-md">
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-2 right-2 text-sm text-gray-600 hover:text-black px-2 py-1 border border-gray-300 rounded"
      >
        Close
      </button>

      <div className="flex flex-wrap items-center gap-4">
        <Label>Post Type: {postType.toUpperCase()}</Label>

        {postType === "videos" && (
          <Button type="button" variant="outline" className="px-4 py-1 text-sm">
            Short Video
          </Button>
        )}
      </div>

      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      {postType === "videos" && (
        <div>
          <Label>Promo Line</Label>
          <Input value={promo} onChange={(e) => setPromo(e.target.value)} />
        </div>
      )}

      {postType !== "videos" && (
        <div>
          <Label>Description</Label>
          <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      )}

      {postType === "web" && (
        <div>
          <Label>Web Links</Label>
          <div className="flex flex-col md:flex-row gap-2 mt-2 w-full">
            <Input className="flex-1" placeholder="Link title" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} />
            <Input className="flex-1" placeholder="URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
            <Button type="button" onClick={handleAddLink}>Add</Button>
          </div>
          <ul className="mt-3 space-y-1">
            {links.map((link, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{link.title}: <a href={link.url} target="_blank" rel="noreferrer">{link.url}</a></span>
                <Button variant="ghost" size="sm" onClick={() => removeLink(i)}>❌</Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {postType === "images" && (
        <div>
          <Label>Upload Image & URL Link</Label>
          {imageItems.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2 mt-2 items-center w-full">
              <Input type="file" accept="image/*" onChange={(e) => setImageItems((prev) => prev.map((it, i) => i === index ? { ...it, file: e.target.files?.[0] || null } : it))} />
              <Input className="flex-1" placeholder="URL Link" value={item.url} onChange={(e) => setImageItems((prev) => prev.map((it, i) => i === index ? { ...it, url: e.target.value } : it))} />
              <Button type="button" variant="ghost" size="icon" onClick={() => setImageItems((prev) => prev.filter((_, i) => i !== index))}>❌</Button>
            </div>
          ))}
          <Button type="button" className="mt-2" onClick={() => setImageItems((prev) => [...prev, { file: null, url: "" }])}>➕ Add More Images</Button>
        </div>
      )}

      {postType === "videos" && (
        <div className="space-y-4">
          <div>
            <Label>Upload Thumbnail</Label>
            <Input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImageItems([{ file, url: URL.createObjectURL(file) }]);
              }
            }} />
          </div>

          <div>
            <Label>Video URL, Link & Short Toggle</Label>
            {videoItems.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-2 mt-2 items-center w-full">
                <Input className="flex-1" placeholder="Video URL" value={item.videoUrl} onChange={(e) => setVideoItems((prev) => prev.map((it, i) => i === index ? { ...it, videoUrl: e.target.value } : it))} />
                <Input className="flex-1" placeholder="Website URL" value={item.url} onChange={(e) => setVideoItems((prev) => prev.map((it, i) => i === index ? { ...it, url: e.target.value } : it))} />
                <Button type="button" variant="ghost" size="icon" onClick={() => setVideoItems((prev) => prev.filter((_, i) => i !== index))}>❌</Button>
              </div>
            ))}
            <Button type="button" className="mt-2" onClick={() => setVideoItems((prev) => [...prev, { videoUrl: "", url: "" }])}>➕ Add More Videos</Button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Label>Tags</Label>
        <div className="flex flex-col md:flex-row gap-2 mt-2">
          <Input placeholder="Add Tag" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          <Button type="button" onClick={handleAddCategory}>Add</Button>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <li key={i} className="bg-blue-200 px-3 py-1 rounded flex items-center gap-1">
              {cat}
              <button type="button" onClick={() => removeCategory(i)} className="text-red-600 font-bold">×</button>
            </li>
          ))}
        </ul>
      </div>

      <Button type="submit" className="w-full py-4 text-base">Submit Post</Button>
    </form>
  );
}
