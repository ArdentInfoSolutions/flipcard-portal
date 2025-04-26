"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PreviewPage() {
    interface WebsiteData {
        name: string;
        logo?: string;
        coverPhoto?: string | null;
        about: string;
        tags: string;
        events: string;
        whatsNew: string;
        phone: string;
        email: string;
        privacyPolicy: string;
        address: string;
        topPages: { title: string; description: string; link?: string }[];
    }

    const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem("previewData");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setWebsiteData({
                ...parsedData,
                coverPhoto: typeof parsedData.coverPhoto === "string" ? parsedData.coverPhoto.trim() : null,
                logo: typeof parsedData.logo === "string" ? parsedData.logo.trim() : null,
            });
        }
    }, []);

    if (!websiteData) {
        return <p className="text-center text-gray-500">No data available. Please submit the form first.</p>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Cover Photo Section */}
            <div className="relative w-full h-60 md:h-80 bg-gray-200 rounded-lg overflow-hidden">
                {websiteData.coverPhoto ? (
                    <Image src={websiteData.coverPhoto} alt="Cover" layout="fill" objectFit="cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Cover Photo
                    </div>
                )}
                <div className="absolute bottom-4 left-4 text-white">
                    <h1 className="text-3xl font-bold">{websiteData.name}</h1>
                </div>
                <div className="absolute bottom-4 left-6 flex space-x-3">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg">Visit</button>
                    <button className="px-4 py-2 text-green">Share</button>
                    <button className="px-4 py-2 text-green">Add to Wishlist</button>
                </div>
            </div>

            {/* Website Info */}
            <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="col-span-2 space-y-6">
                    {websiteData.logo && (
                        <Image src={websiteData.logo} alt="Logo" width={100} height={100} className="rounded-full" />
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">{websiteData.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg text-gray-600">{websiteData.about}</p>
                        </CardContent>
                    </Card>
                    {websiteData.tags && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tags (Optional)</CardTitle>
                            </CardHeader>
                            <CardContent className="flex gap-2 flex-wrap">
                                {websiteData.tags.split(",").map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-200 rounded-full text-sm">{tag.trim()}</span>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle>Events & Offers (Optional)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="bg-yellow-100 px-4 py-2 rounded-lg">{websiteData.events}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>What's New?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{websiteData.whatsNew}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Website Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Phone:</strong> {websiteData.phone}</p>
                            <p><strong>Email:</strong> {websiteData.email}</p>
                            <p><strong>Privacy Policy:</strong> {websiteData.privacyPolicy}</p>
                            <p><strong>Address:</strong> {websiteData.address}</p>
                        </CardContent>
                    </Card>
                    {websiteData.topPages.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Pages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc ml-5">
                                    {websiteData.topPages.map((page, index) => (
                                        <li key={index}>
                                            <Link href={page.link || "#"} className="font-semibold text-blue-600 hover:underline">
                                                {page.title}
                                            </Link>
                                            <p className="text-sm text-gray-600">{page.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
