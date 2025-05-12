import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import e from "cors";

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function uploadToCloudinary(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const readableStream = Readable.from(Buffer.from(buffer));

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(error);
                }
                console.log("Cloudinary upload success:", result);
                resolve(result?.secure_url || "");
            }
        );
        readableStream.pipe(stream);
    });
}

// handle multiople posts
export async function GET() {
    console.log("get api hit");
    try {
        const result = await query(`
            SELECT id, website_name, overview, cover_photo ,email
            FROM website_details
            ORDER BY created_at DESC
            
        `);
        console.log("Total Posts from DB:", result.length);


        const posts = result.map((item: any) => ({
            id: item.id,
            websiteName: item.website_name,
            overview: item.overview,
            coverPhoto: item.cover_photo,
            email: item.email,
        }));
       

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Fetch all error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        // Text fields
        const websiteName = formData.get("websiteName") as string;
        const overview = formData.get("overview") as string;
        const about = formData.get("about") as string;
        const tags = formData.get("tags") as string;
        const whatsNew = formData.get("whatsNew") as string;
        const phone = formData.get("phone") as string;
        const email = formData.get("email") as string;
        const privacyPolicy = formData.get("privacyPolicy") as string;
        const address = formData.get("address") as string;
        const topPages = formData.get("topPages") as string;
        const parsedTopPages = topPages ? JSON.parse(topPages) : [];
        const eventLink = formData.get("eventLink") as string;
        const googleMapsLink = formData.get("googleMapsLink") as string;

        // File fields
        const coverPhoto = formData.get("coverPhoto") as File;
        const logo = formData.get("logo") as File;
        const images = formData.getAll("images") as File[];
        console.log("received images", images);

        // Upload files
        const coverPhotoUrl = coverPhoto ? await uploadToCloudinary(coverPhoto) : null;
        const logoUrl = logo ? await uploadToCloudinary(logo) : null;
        const imageUrls = images.length > 0
            ? await Promise.all(images.map((img) => uploadToCloudinary(img)))
            : [];

        // Handle event image (optional)
        const eventImage = formData.get("eventImage") as File;
        console.log("eventImage", eventImage);
        const eventImageUrl = eventImage ? await uploadToCloudinary(eventImage) : null;
        console.log("eventImageUrl", eventImageUrl);

        console.log("🧠 Saving data to DB:", {
            websiteName,
            coverPhotoUrl,
            logoUrl,
            imageUrls,
            eventImageUrl,
            
        });


        // Insert into database
        const result = await query(
            `INSERT INTO website_details
  (
    website_name,
    overview,
    about,
    tags,
    whats_new,
    phone,
    email,
    privacy_policy,
    address,
    top_pages,
    cover_photo,
    logo,
    images,
    event_image,
    event_link,  -- <-- Add comma here
    google_maps_link
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
  RETURNING id`,
            [
                websiteName,
                overview,
                about,
                tags,
                whatsNew,
                phone,
                email,
                privacyPolicy,
                address,
                JSON.stringify(parsedTopPages),
                coverPhotoUrl,
                logoUrl,
                `{${imageUrls.map((url) => `"${url}"`).join(",")}}`,
                eventImageUrl,
                eventLink,
                googleMapsLink
            ]
        );

        


        return NextResponse.json({
            success: true,
            websiteId: result[0].id,
            coverPhotoUrl,
            logoUrl,
            imageUrls,
            eventImageUrl
            
        });
    } catch (error: any) {
        console.error("❌ FULL BACKEND ERROR:", error);
        return NextResponse.json(
            { success: false, error: error?.message || "Unknown Error" },
            { status: 500 }
        );
    }
}










