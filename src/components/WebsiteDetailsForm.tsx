"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import imageCompression from "browser-image-compression";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";

export default function WebsiteDetailsForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    


const [formData, setFormData] = useState({
    websiteName: "",
    overview: "",
    coverPhoto: null as File | null,
    logo: null as File | null,
    images: [] as File[],
    about: "",
    tags: "",
    events: [{ image: null as File | null, link: "" }],
    whatsNew: "",
    topPages: [{ title: "", description: "", link: "" }],
    phone: "",
    email: "",
    privacyPolicy: "",
    address: "",
    googleMapLink: "",
});

const updateField = (name: string, value: any) => {
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};

const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
    updateField(e.target.name, e.target.value);
};
const handleEventImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
        const compressed = await compressImage(file);
        setFormData((prev) => {
            const updatedEvents = [...(prev.events || [])];
            updatedEvents[0] = { ...updatedEvents[0], image: compressed };
            return { ...prev, events: updatedEvents };
        });
    }
};
const handleEventLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => {
        const updatedEvents = [...(prev.events || [])];
        updatedEvents[0] = { ...updatedEvents[0], link: value };
        return { ...prev, events: updatedEvents };
    });
};

const normalizeURL = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
};




const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "coverPhoto" | "logo" | "events"
) => {
    const file = e.target.files?.[0] || null;
    if (file) {
        const compressed = await compressImage(file);
        updateField(field, compressed);
    }
};

const handleMultipleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
) => {
    const files = e.target.files ? Array.from(e.target.files).slice(0, 10) : [];
    const compressedFiles = await Promise.all(files.map(compressImage));
    updateField("images", compressedFiles);
};

const handleTopPageChange = (
    index: number,
    field: "title" | "description" | "link",
    value: string
) => {
    setFormData((prev) => {
        const updatedPages = prev.topPages.map((page, i) =>
            i === index ? { ...page, [field]: value } : page
        );
        return { ...prev, topPages: updatedPages };
    });
};

const addTopPage = () => {
    setFormData((prev) => ({
        ...prev,
        topPages: [...prev.topPages, { title: "", description: "", link: "" }],
    }));
};

const compressImage = async (file: File) => {
    try {
        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
        };
        return await imageCompression(file, options);
    } catch (error) {
        console.error("Image compression failed:", error);
        return file;
    }
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
        toast.loading("Saving website...");

        const form = new FormData();
        form.append("websiteName", formData.websiteName);
        form.append("overview", formData.overview);
        form.append("about", formData.about);
        form.append("tags", formData.tags);
        form.append("topPages", JSON.stringify(formData.topPages));
        form.append("whatsNew", formData.whatsNew);
        form.append("phone", formData.phone);
        form.append("email", formData.email);
        form.append("privacyPolicy", formData.privacyPolicy);
        form.append("address", formData.address);
        form.append("googleMapLink", normalizeURL(formData.googleMapLink)); // Normalize the URL

        if (formData.events && formData.events[0]?.image) {
            form.append("eventImage", formData.events[0].image); // ✅ Match this with backend field name
        }
        if(formData.events && formData.events[0]?.link) {
            form.append("eventLink", formData.events[0].link); // ✅ Match this with backend field name
        }

        if (formData.coverPhoto) form.append("coverPhoto", formData.coverPhoto);
        if (formData.logo) form.append("logo", formData.logo);

        formData.images.forEach((img) => form.append("images", img));

        const res = await fetch("/api/website", {
            method: "POST",
            body: form,
        });

        const data = await res.json();
        console.log("Backend response:", res.status, data);


        if (res.ok && data.success) {
            toast.dismiss();
            toast.success("✅ Website saved successfully!");

            router.push("/profile");

        } else {
            throw new Error(data.message || "Backend error");
        }
    } catch (error) {
        toast.dismiss();
        toast.error("❌ Upload failed");
        console.error("❌ Backend upload failed:", error);
    } finally {
        setIsSubmitting(false);
    }
};

return (
    <Card className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <CardHeader>
            <CardTitle>Website Details</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Website Name */}
                    <div className="col-span-full">
                        <Label htmlFor="websiteName">Website Name</Label>
                        <Input
                            id="websiteName"
                            name="websiteName"
                            maxLength={30}
                            value={formData.websiteName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Overview */}
                    <div className="col-span-full">
                        <Label htmlFor="overview">Overview</Label>
                        <Textarea
                            id="overview"
                            name="overview"
                            maxLength={169}
                            value={formData.overview}
                            onChange={handleInputChange}
                            rows={3}
                        />
                    </div>

                    {/* Cover Photo Upload */}
                    <div>
                        <Label>Cover Photo</Label>
                        <div className="border p-2 rounded-lg space-y-2 w-full max-w-xs">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const compressed = await compressImage(file);
                                        updateField("coverPhoto", compressed);
                                    }
                                }}
                            />
                            {formData.coverPhoto && (
                                <img
                                    src={URL.createObjectURL(formData.coverPhoto)}
                                    alt="Cover"
                                    className="h-28 w-28 object-cover rounded-md"
                                />
                            )}
                        </div>
                    </div>

                    {/* Logo Upload */}
                    <div>
                        <Label>Logo</Label>
                        <div className="border p-2 rounded-lg space-y-2 w-full max-w-xs">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const compressed = await compressImage(file);
                                        updateField("logo", compressed);
                                    }
                                }}
                            />
                            {formData.logo && (
                                <img
                                    src={URL.createObjectURL(formData.logo)}
                                    alt="Logo"
                                    className="h-20 w-20 object-cover rounded-full"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Website Images Upload (Multiple) */}
                <div>
                    <Label>Website Images</Label>
                    <div className="flex flex-wrap gap-4 overflow-x-auto py-2">
                        {formData.images?.map((img: any, index: number) => (
                            <div
                                key={index}
                                className="relative flex-shrink-0 border rounded-lg p-1 bg-white shadow-md"
                            >
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt={`Image ${index + 1}`}
                                    className="h-32 w-32 object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = [...formData.images];
                                        updated.splice(index, 1);
                                        updateField("images", updated);
                                    }}
                                    className="absolute top-1 right-1 text-white text-xs px-1 py-0.5 rounded"
                                >
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                    {formData.images?.length < 10 && (
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                const remainingSlots = 10 - (formData.images?.length || 0);
                                const limitedFiles = files.slice(0, remainingSlots);
                                const compressedImages = await Promise.all(
                                    limitedFiles.map(async (file) => await compressImage(file))
                                );
                                updateField("images", [...(formData.images || []), ...compressedImages]);
                            }}
                            className="mt-2"
                        />
                    )}
                </div>

                {/* Remaining Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* About */}
                    <div className="col-span-full">
                        <Label htmlFor="about">About</Label>
                        <Textarea
                            id="about"
                            name="about"
                            value={formData.about}
                            onChange={handleInputChange}
                            rows={4}
                        />
                    </div>

                    {/* Tags */}
                    <div className="col-span-full">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Events and Offers */}
                    <div className="col-span-full">
                        <Label>Events and Offers</Label>
                        <div className="border p-2 rounded-lg space-y-2 w-full max-w-xs">
                            <Input
                                type="file"
                                name="eventsImage"
                                accept="image/*"
                                onChange={handleEventImageChange}
                            />
                            {formData.events && formData.events[0]?.image && (
                                <img
                                    src={URL.createObjectURL(formData.events[0].image)}
                                    alt="event"
                                    className="h-28 w-28 object-cover rounded-md"
                                />
                            )}
                            <Input
                                type="text"
                                placeholder="Event Link"
                                value={formData.events[0]?.link || ""}
                                onChange={handleEventLinkChange}
                            />
                        </div>
                    </div>

                    {/* What's New */}
                    <div className="col-span-full">
                        <Label htmlFor="whatsNew">What's New</Label>
                        <Textarea
                            id="whatsNew"
                            name="whatsNew"
                            value={formData.whatsNew}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Top Pages */}
                    <div className="col-span-full space-y-4">
                        <Label>Top Pages</Label>
                        {formData.topPages.map((page, index) => (
                            <div key={index} className="border p-2 rounded-lg space-y-2">
                                <Input
                                    placeholder={`Title ${index + 1}`}
                                    value={page.title}
                                    onChange={(e) => handleTopPageChange(index, "title", e.target.value)}
                                />
                                <Textarea
                                    placeholder={`Description ${index + 1}`}
                                    value={page.description}
                                    onChange={(e) => handleTopPageChange(index, "description", e.target.value)}
                                    rows={2}
                                />
                                <Input
                                    placeholder={`Link ${index + 1}`}
                                    value={page.link}
                                    onChange={(e) => handleTopPageChange(index, "link", e.target.value)}
                                />
                            </div>
                        ))}
                        <Button type="button" onClick={addTopPage}>
                            ➕ Add Another Top Page
                        </Button>
                    </div>

                    {/* Website Support */}
                    <div className="col-span-full space-y-2">
                        <Label htmlFor="phone">Website Support</Label>
                        <Input
                            id="phone"
                            name="phone"
                            placeholder="Phone No."
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        <Input
                            id="email"
                            name="email"
                            placeholder="Support Email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Privacy Policy */}
                    <div className="col-span-full">
                        <Label htmlFor="privacyPolicy">Privacy Policy URL</Label>
                        <Input
                            id="privacyPolicy"
                            name="privacyPolicy"
                            value={formData.privacyPolicy}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Address */}
                    <div className="col-span-full">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            rows={3}
                        />
                    </div>

                    {/* Google Map Link */}
                    <div className="col-span-full">
                        <Label htmlFor="googleMapLink">Google Map Link</Label>
                        <Input
                            id="googleMapLink"
                            name="googleMapLink"
                            value={formData.googleMapLink}
                            onChange={handleInputChange}
                            placeholder="https://www.google.com/maps/place/..."
                        />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-4">
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? "Saving..." : "Save Website"}
                </Button>
            </CardFooter>
        </form>
    </Card>

);

}

