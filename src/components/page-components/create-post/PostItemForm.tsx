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

  const [videoItems, setVideoItems] = useState<{ videoUrl: string; url: string}[]>([
    { videoUrl: "", url: "" },
  ]);

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
      let videos: { videoUrl: string; url: string}[] = [];

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
        payload.thumbnail = imagesBase64[0]; // first one
        payload.isShortvideo = isShortVideo; // assuming you have a state for this
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
      setVideoItems([{ videoUrl: "", url: "",}]);
    } catch (error) {
      alert("❌ Error: " + (error as Error).message);
      console.error("Submit error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 p-4 max-w-2xl mx-auto bg-white rounded shadow-md">
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-2 right-2 text-gray-600 hover:text-black px-3 py-1 border border-gray-300 rounded"
      >
        Close
      </button>

      <div className="flex items-center gap-4  ">
        <Label>Post Type: {postType.toUpperCase()}</Label>

        {postType === "videos" && (
          <Button
            type="button"
            variant="outline"
            className="bg-white-100 text-black-800 font-semibold px-4 py-1 text-sm"
          >
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
          <div className="flex gap-2 mt-2">
            <Input placeholder="Link title" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} />
            <Input placeholder="URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
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
            <div key={index} className="flex flex-col md:flex-row gap-2 mt-2 items-center">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageItems((prev) =>
                    prev.map((it, i) =>
                      i === index ? { ...it, file: e.target.files?.[0] || null } : it
                    )
                  )
                }
              />
              <Input
                placeholder="URL Link"
                value={item.url}
                onChange={(e) =>
                  setImageItems((prev) =>
                    prev.map((it, i) =>
                      i === index ? { ...it, url: e.target.value } : it
                    )
                  )
                }
              />
              <Button type="button" variant="ghost" onClick={() =>
                setImageItems((prev) => prev.filter((_, i) => i !== index))}>❌</Button>
            </div>
          ))}
          <Button type="button" className="mt-2" onClick={() =>
            setImageItems((prev) => [...prev, { file: null, url: "" }])}>➕ Add More Images</Button>
        </div>
      )}

      {postType === "videos" && (
        <div className="space-y-4">
          <div>
            <Label>Upload Thumbnail</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageItems([{ file, url: URL.createObjectURL(file) }]);
                }
              }}
            />
          </div>

          <div>
            <Label>Video URL, Link & Short Toggle</Label>
            {videoItems.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-2 mt-2 items-center">
                <Input
                  placeholder="Video URL"
                  value={item.videoUrl}
                  onChange={(e) =>
                    setVideoItems((prev) =>
                      prev.map((it, i) =>
                        i === index ? { ...it, videoUrl: e.target.value } : it
                      )
                    )
                  }
                />
                <Input
                  placeholder="Website URL"
                  value={item.url}
                  onChange={(e) =>
                    setVideoItems((prev) =>
                      prev.map((it, i) =>
                        i === index ? { ...it, url: e.target.value } : it
                      )
                    )
                  }
                />
               
                <Button type="button" variant="ghost" onClick={() =>
                  setVideoItems((prev) => prev.filter((_, i) => i !== index))}>❌</Button>
              </div>
            ))}
            <Button type="button" className="mt-2" onClick={() =>
              setVideoItems((prev) => [...prev, { videoUrl: "", url: "" }])}>➕ Add More Videos</Button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Label>Tags</Label>
        <div className="flex gap-2 mt-2">
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

      <Button type="submit" className="w-full">Submit Post</Button>
    </form>
  );
}




// "use client";

// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// type PostType = "web" | "videos" | "images";

// interface PostItemFormProps {
//   showIn: PostType;
// }

// export default function PostItemForm({ showIn }: PostItemFormProps) {
//   const postType = showIn;

//   const [title, setTitle] = useState("");
//   const [promo, setPromo] = useState("");
//   const [description, setDescription] = useState("");

//   const [categories, setCategories] = useState<string[]>([]);
//   const [newCategory, setNewCategory] = useState("");

//   // For web links only
//   const [links, setLinks] = useState<{ title: string; url: string }[]>([]);
//   const [linkTitle, setLinkTitle] = useState("");
//   const [linkUrl, setLinkUrl] = useState("");

//   // For images & videos (file uploads)
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [selectedVideos, setSelectedVideos] = useState<File[]>([]);

//   const handleAddCategory = () => {
//     if (newCategory.trim()) {
//       setCategories([...categories, newCategory.trim()]);
//       setNewCategory("");
//     }
//   };

//   const removeCategory = (index: number) => {
//     setCategories(categories.filter((_, i) => i !== index));
//   };

//   const handleAddLink = () => {
//     if (linkTitle && linkUrl) {
//       setLinks([...links, { title: linkTitle, url: linkUrl }]);
//       setLinkTitle("");
//       setLinkUrl("");
//     }
//   };

//   const removeLink = (index: number) => {
//     setLinks(links.filter((_, i) => i !== index));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setSelectedImages([...selectedImages, ...Array.from(e.target.files)]);
//     }
//   };

//   const handleRemoveImage = (index: number) => {
//     const newImages = [...selectedImages];
//     newImages.splice(index, 1);
//     setSelectedImages(newImages);
//   };

//   const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setSelectedVideos([...selectedVideos, ...Array.from(e.target.files)]);
//     }
//   };

//   const handleRemoveVideo = (index: number) => {
//     const newVideos = [...selectedVideos];
//     newVideos.splice(index, 1);
//     setSelectedVideos(newVideos);
//   };

//   const fileToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!title.trim()) return alert("Title is required");
//     if (categories.length === 0) return alert("Add at least one category");
//     if (postType === "web" && links.length === 0)
//       return alert("Add at least one link");
//     if (postType === "images" && selectedImages.length === 0)
//       return alert("Upload at least one image");
//     if (postType === "videos" && selectedVideos.length === 0)
//       return alert("Upload at least one video");

//     try {
//       let imagesBase64: string[] = [];
//       let videosBase64: string[] = [];

//       if (postType === "images") {
//         imagesBase64 = await Promise.all(selectedImages.map(fileToBase64));
//       }

//       if (postType === "videos") {
//         videosBase64 = await Promise.all(selectedVideos.map(fileToBase64));
//       }

//       const payload: any = {
//         title: title.trim(),
//         promo: promo.trim() || null,
//         description: description.trim(),
//         postType,
//         categories,
//       };

//       if (postType === "web") payload.webLinks = links;
//       else if (postType === "videos") payload.videos = videosBase64;
//       else if (postType === "images") payload.images = imagesBase64;

//       const res = await fetch("/api/postitem", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const rawText = await res.text();
//       let data;
//       try {
//         data = JSON.parse(rawText);
//       } catch {
//         data = { error: rawText };
//       }

//       if (!res.ok) {
//         throw new Error(data.error || "Something went wrong");
//       }

//       alert("Post created successfully!");
//       setTitle("");
//       setPromo("");
//       setDescription("");
//       setCategories([]);
//       setLinks([]);
//       setSelectedImages([]);
//       setSelectedVideos([]);
//     } catch (error) {
//       alert("Error: " + (error as Error).message);
//       console.error("Submit error:", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6 p-4 max-w-2xl mx-auto">
//       <div>
//         <Label>Post Type: {postType.toUpperCase()}</Label>
//       </div>

//       <div>
//         <Label>Title</Label>
//         <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
//       </div>

//       <div>
//         <Label>Promo Line</Label>
//         <Input value={promo} onChange={(e) => setPromo(e.target.value)} />
//       </div>

//       <div>
//         <Label>Description</Label>
//         <Textarea
//           rows={4}
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//       </div>

//       {/* Dynamic Field Based on Post Type */}
//       {postType === "web" ? (
//         <div>
//           <Label>Web Links</Label>
//           <div className="flex gap-2 mt-2">
//             <Input
//               placeholder="Link title"
//               value={linkTitle}
//               onChange={(e) => setLinkTitle(e.target.value)}
//             />
//             <Input
//               placeholder="URL"
//               value={linkUrl}
//               onChange={(e) => setLinkUrl(e.target.value)}
//             />
//             <Button type="button" onClick={handleAddLink}>
//               Add
//             </Button>
//           </div>

//           <ul className="mt-3 space-y-1">
//             {links.map((link, i) => (
//               <li key={i} className="flex justify-between items-center">
//                 <span>
//                   {link.title}:{" "}
//                   <a href={link.url} target="_blank" rel="noreferrer">
//                     {link.url}
//                   </a>
//                 </span>
//                 <Button variant="ghost" size="sm" onClick={() => removeLink(i)}>
//                   ❌
//                 </Button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : postType === "videos" ? (
//         <div>
//           <Label>Upload Videos</Label>
//           <Input
//             type="file"
//             multiple
//             accept="video/*"
//             onChange={handleVideoChange}
//           />
//           <div className="flex flex-wrap gap-3 mt-3">
//             {selectedVideos.map((video, i) => (
//               <div key={i} className="relative w-32 h-24">
//                 <video
//                   src={URL.createObjectURL(video)}
//                   controls
//                   className="w-full h-full object-cover rounded"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveVideo(i)}
//                   className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded-full"
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : postType === "images" ? (
//         <div>
//           <Label>Upload Images</Label>
//           <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
//           <div className="flex flex-wrap gap-3 mt-3">
//             {selectedImages.map((image, i) => (
//               <div key={i} className="relative w-24 h-24">
//                 <img
//                   src={URL.createObjectURL(image)}
//                   alt={`Image ${i}`}
//                   className="w-full h-full object-cover rounded"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveImage(i)}
//                   className="absolute top-0 right-0 bg-red-500 text-white px-1 text-xs rounded-full"
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : null}

//       {/* Categories */}
//       <div>
//         <Label>Categories</Label>
//         <div className="flex gap-2 mt-2">
//           <Input
//             placeholder="Add category"
//             value={newCategory}
//             onChange={(e) => setNewCategory(e.target.value)}
//           />
//           <Button type="button" onClick={handleAddCategory}>
//             Add
//           </Button>
//         </div>
//         <ul className="mt-3 flex flex-wrap gap-2">
//           {categories.map((cat, i) => (
//             <li
//               key={i}
//               className="bg-blue-200 px-3 py-1 rounded flex items-center gap-1"
//             >
//               {cat}
//               <button
//                 type="button"
//                 onClick={() => removeCategory(i)}
//                 className="text-red-600 font-bold"
//               >
//                 ×
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <Button type="submit" className="w-full">
//         Submit Post
//       </Button>
//     </form>
//   );
// }

