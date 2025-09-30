"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";
import { ChevronRightIcon } from "lucide-react";
import {ShareButton} from  "../../../components/common/ShareButton";

interface WebsiteData {
    websiteName: string;
    overview: string;
    about: string;
    tags?: string;
    eventImage?: string;
    eventLink?: string;
    whatsNew?: string;
    phone?: string;
    email?: string;
    address?: string;
    coverPhoto?: string;
    logo?: string;
    images?: string[];
    topPages?: {
        title: string;
        link: string;
        description?: string;
    }[];
    privacy_policy?:string;
    googleMapsLink?:string;
}
const handleScrollRight = () => {
    const container = document.getElementById("image-container");
    if (container) {
        container.scrollBy({
            left: 150, // Scroll right by 200px
            behavior: "smooth", // Smooth scroll effect
        });
    }
};

export default function PreviewPage() {
    const { id } = useParams(); // Use useParams to get the dynamic parameter from the URL
    const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scrolling, setScrolling] = useState(false); // State to control scrolling


    useEffect(() => {
        if (!id) return; // Don't fetch if id is not yet available

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/website/${id}`); // Fetch data using the dynamic `id`
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setWebsiteData(data);
            } catch (error) {
                setError("Error fetching data: " + (error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]); // Re-run effect when the id changes

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!websiteData) return <div>No data found.</div>;


    const {
        websiteName,
        overview,
        about,
        tags = "",
        eventImage,
        eventLink,
        whatsNew,
        phone,
        email,
        address,
        coverPhoto,
        logo,
        images = [],
        topPages = [],
        privacy_policy,
        googleMapsLink,
    } = websiteData;
    console.log("Fetched Data:", websiteData);


    return (
        <div className="bg-white text-gray-900 min-h-screen font-sans">
            {/* Hero Section */}
            <div className="relative w-full">
                {coverPhoto && (
                    <img
                        src={coverPhoto}
                        alt="Cover"
                        className="w-full h-[300px] object-cover"
                    />
                )}

                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">
                        {websiteName}
                        <span className="ml-2 text-sm font-normal">(Maximum 30 Characters)</span>
                    </h1>
                    <p className="text-sm max-w-xl">
                        {overview} <span className="text-xs">(169 Characters)</span>
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        {logo && (
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-12 h-12 rounded-full border border-white"
                            />
                        )}

                    </div>

                    <div className="mt-4 flex gap-4">
                       <a
                         href={topPages[0].link?.startsWith("http") ? topPages[0].link : `https://${topPages[0].link}`}

                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                        Visit <ExternalLinkIcon size={16} />
                        </a>

                <ShareButton
                title={websiteName}
                url={window.location.href}
                />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 md:flex md:gap-8">
                <div className="md:w-2/3 space-y-6">
                    {/* Gallery */}
                    {images.length > 0 && (
                        <div
                            className="relative overflow-x-auto space-x-4 flex items-center space-x-4"
                            id="image-container"

                        >
                            <div className="flex space-x-4">
                                {images.map((img, i) => (
                                    <div key={i} className="flex-shrink-0">
                                        <img
                                            src={img}
                                            alt={`Image ${i + 1} `}
                                            className="w-32 h-32 rounded-lg object-cover border"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Right Arrow Icon */}
                            {scrolling && (
                                <button
                                    onClick={handleScrollRight}
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2"
                                >
                                    <ChevronRightIcon size={20} />
                                </button>

                            )}

                        </div>


                    )}

                    {/* About */}
                    {about && (
                        <div>
                            <h2 className="text-xl font-semibold mb-1">About this website</h2>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{about}</p>
                        </div>
                    )}

                    {/* Tags */}
                    {tags && (
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Tags (Optional)</h2>
                            <div className="flex flex-wrap gap-2">
                                {tags.split(",").map((tag, i) => (
                                    <span
                                        key={i}
                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Events Section */}

                    {/* Events Section */}
                    {eventImage ? (
                        <div className="relative w-full h-[150px]">
                            <h2 className="text-xl font-semibold mb-1">Event and Offers</h2>
                            {eventLink ? (
                                <a
                                    href={
                                        eventLink.startsWith('http')
                                            ? eventLink
                                            : `https://${eventLink}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full"
                                >
                                    <img
                                        src={eventImage}
                                        alt="Event Image"
                                        className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                                    />
                                </a>
                            ) : (
                                <img
                                    src={eventImage}
                                    alt="Event Image"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="text-sm text-yellow-800">No event image available.</div>
                    )}

                    {/* What's New */}
                    {whatsNew && (
                        <div>
                            <h2 className="text-xl font-semibold mb-1">What's new</h2>
                            <ul className="list-disc list-inside text-sm text-gray-700 whitespace-pre-line">
                                {whatsNew.split("\n").map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="md:w-1/3 space-y-6 mt-10 md:mt-0">
                    <div className="bg-gray-50 p-4 rounded shadow-sm space-y-3">

                    </div>
                    {/* Website Support Section */}
                    <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Website Support</h2>

                        {/* Phone */}
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-gray-600 text-lg">
                                <i className="fas fa-phone-alt"></i>
                            </span>
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-gray-700">📞 Phone number</p>
                                <a
                                    href={`tel:${phone?.trim()}`}
                                    className="text-sm text-blue-600 hover:underline pl-6"
                                >
                                    {phone}
                                </a>

                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-3 mb-3">
                            <span className="text-gray-600 text-lg">
                                <i className="fas fa-envelope"></i>
                            </span>
                            <div>
                                <p className="text-sm font-medium text-gray-700">📧 Support email</p>
                                <a
                                    href={`mailto:${email?.trim()}`}
                                    className="text-sm text-blue-600 hover:underline pl-6"
                                >
                                    {email}
                                </a>

                            </div>
                        </div>


                        {/* Privacy Policy */}
                        <div className="flex items-start gap-3 mb-3">
                            <span className="text-gray-600 text-lg"><i className="fas fa-user-shield"></i></span>
                            <div>
                                <p>
                                <a href={privacy_policy} 
                                target="_blank" 
                                rel="noreferrer"
                                          
className="text-sm text-blue-600 hover:underline pl-6"
                                >📍 Privacy Policy</a>
                                </p>
                            </div>
                        </div>

                        {/* About the Developer */}
                        <div className="mt-5">
                            <p className="text-sm font-medium text-gray-800 mb-1">About the developer</p>
                            <p className="text-sm text-gray-900">{websiteName}</p>
                            <p className="text-sm text-gray-700">{email}</p>
                            <p className="text-sm text-gray-700">{address}</p>

                            <p className="text-sm text-gray-700">{phone}</p>
                        </div>
                    </div>


                    {topPages.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded shadow-sm">
                            <h2 className="text-xl font-semibold mb-2">Top Pages</h2>
                            <ul className="space-y-3 text-sm">
                                {topPages.map((page, i) => (
                                    <li key={i}>
                                        <a
                                            href={page.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 font-medium hover:underline"
                                        >
                                            {page.title}
                                        </a>
                                        <p className="text-gray-600">
                                            {page.description || "No description"}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );


}
