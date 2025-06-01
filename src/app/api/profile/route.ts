import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import path from "path";
import fs from "fs";

// Helper function to save base64 image
function saveBase64Image(photo: string, email: string): string | null {
    if (!photo) return null;

    if (photo.startsWith("data:image")) {
        // Skip file writing in serverless environment like Vercel
        console.log("⚠️ Skipping image saving on serverless environment for base64 image");
        // You can later implement external image upload here (e.g. Cloudinary)
        return null;
    } else if (photo.startsWith("http")) {
        // It's a URL, return as-is
        return photo;
    } else {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("📥 Received POST data:");

        const { name, email, photo, userId } = body;

        if (!name || !email || !userId) {
            console.error("❗Missing required fields:");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user already exists by email
        const existingUser = await query("SELECT userid FROM users WHERE email = $1", [email]);

        if (existingUser.length > 0) {
            console.log(`User with email ${email} already exists. Skipping insert.`);
            return NextResponse.json({ message: "User already exists, no action taken.", userId: existingUser[0] }, { status: 200 });
        }

        // Save the base64 image or keep URL
        const savedPhoto = saveBase64Image(photo, email);

        // Insert new user profile
        const result = await query(
            `INSERT INTO users (userid, name, email, photo) VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, name, email, savedPhoto]
        );

        console.log("✅ Profile created:");
        return NextResponse.json({ message: "Profile created", userId: result[0].userid }, { status: 201 });

    } catch (err: any) {
        console.error("❌ Server error in POST /api/profile:", err.message || err);
        return NextResponse.json({ error: "Server error", details: err.message || err }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, name, email, bio, photo, place, interests, about } = body;

        if (!userId) {
            return NextResponse.json({ message: "User ID is required for update" }, { status: 400 });
        }

        // Adjust if your userId column name is 'userid' or 'id'
        const checkUser = await query("SELECT userid FROM users WHERE userid = $1", [userId]);

        if (checkUser.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // saveBase64Image is sync; no await needed
        const savedPhotoPath = typeof photo === "string" ? saveBase64Image(photo, userId.toString()) : null;

        const interestsArray = Array.isArray(interests) ? interests : [];

        const updateQuery = savedPhotoPath
            ? `UPDATE users SET name = $1, bio = $2, photo = $3, place = $4, interests = $5, about = $6, updated_at = CURRENT_TIMESTAMP WHERE userid = $7`
            : `UPDATE users SET name = $1, bio = $2, place = $3, interests = $4, about = $5, updated_at = CURRENT_TIMESTAMP WHERE userid = $6`;

        const values = savedPhotoPath
            ? [name, bio, savedPhotoPath, place, interestsArray, JSON.stringify(about), userId]
            : [name, bio, place, interestsArray, JSON.stringify(about), userId];

        await query(updateQuery, values);

        return NextResponse.json({ message: "Profile updated successfully" });

    } catch (error: any) {
        console.error("❌ PUT Error:", error.message || error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}



export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "Missing userId" }, { status: 400 });
        }

        const result = await query("SELECT userid, name, email, bio, photo, place, interests, about FROM users WHERE userid = $1", [userId]);

        if (result.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const user = result[0];

        // If about is stored as a JSON string in DB, parse it
        let parsedAbout = null;
        try {
            parsedAbout = typeof user.about === "string" ? JSON.parse(user.about) : user.about;
        } catch {
            parsedAbout = user.about;
        }

        return NextResponse.json({
            userId: user.userid,
            name: user.name,
            email: user.email,
            bio: user.bio,
            photo: user.photo,
            place: user.place,
            interests: user.interests,
            about: parsedAbout,
        });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
