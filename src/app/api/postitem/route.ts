import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Helper: Upload a remote image/video URL to Cloudinary and get secure URL
async function uploadToCloudinaryUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            url,
            { resource_type: "auto" }, // auto detects image/video/etc
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(error);
                }
                resolve(result?.secure_url || "");
            }
        );
    });
}

export async function GET() {
    try {
        const result = await query("SELECT * FROM postitem ORDER BY id DESC");

        // Parse links_or_images from string to array if needed
        const parsedResult = result.map((item: any) => ({
            ...item,
            links_or_images: typeof item.links_or_images === 'string'
                ? JSON.parse(item.links_or_images)
                : item.links_or_images,
        }));

        return NextResponse.json(parsedResult);
    } catch (error: any) {
        console.error("❌ GET post error:", error.message);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            title,
            promo,
            description,
            postType,
            categories,
            webLinks,
            videoLinks,
            images,
            userId,
        } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // 1. Fetch user profile photo from database (pseudo-code)
        const userProfile = await query(
            "SELECT photo FROM user_profile WHERE user_id = $1",
            [userId]
        );

        const profilePhoto = userProfile?.[0]?.photo || null;

        let content: any = null;

        if (postType === "web") {
            // For web posts, just save links as is
            content = webLinks;
        } else if (postType === "videos" && Array.isArray(videoLinks)) {
            // Upload all video URLs to Cloudinary, get back their URLs
            content = await Promise.all(
                videoLinks.map(async (url: string) => await uploadToCloudinaryUrl(url))
            );
        } else if (postType === "images" && Array.isArray(images)) {
            // Upload all image URLs to Cloudinary, get back their URLs
            content = await Promise.all(
                images.map(async (url: string) => await uploadToCloudinaryUrl(url))
            );
        }

        const result = await query(
            `INSERT INTO postitem (title, promo, description, post_type, categories, links_or_images)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [title, promo, description, postType, categories, JSON.stringify(content)]
        );

        return NextResponse.json(result[0]);
    } catch (error: any) {
        console.error("❌ Backend POST error:", error.message);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
