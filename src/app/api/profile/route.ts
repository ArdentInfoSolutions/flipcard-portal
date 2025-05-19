import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import path from "path";
import fs from "fs";

// Helper function to save base64 image
function saveBase64Image(photo: string, email: string): string | null {
    if (!photo) return null;

    if (photo.startsWith("data:image")) {
        const cleanedBase64 = photo.split(",")[1];
        if (!cleanedBase64) return null;

        const buffer = Buffer.from(cleanedBase64, "base64");
        const fileName = `${Date.now()}-${email.replace(/[^a-zA-Z0-9]/g, "")}.jpg`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fullPath = path.join(uploadDir, fileName);
        fs.writeFileSync(fullPath, buffer);

        return `/uploads/${fileName}`;
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
        console.log("📥 Received POST data:", body);

        const { name, email, photo, userId } = body;

        if (!name || !email || !userId) {
            console.error("❗Missing required fields:", { name, email, userId });
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user already exists by email
        const existingUser = await query("SELECT userid FROM users WHERE email = $1", [email]);

        if (existingUser.length > 0) {
            // User exists, do nothing and return success
            console.log(`User with email ${email} already exists. Skipping insert.`);
            return NextResponse.json({ message: "User already exists, no action taken.",userId: existingUser[0] }, { status: 200 });
        }

        // Save the base64 image or keep URL
        const savedPhoto = saveBase64Image(photo, email);

        // Insert new user profile
        const result = await query(
            `INSERT INTO users (userid, name, email, photo) VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, name, email, savedPhoto]
        );

        console.log("✅ Profile created:", result);
        return NextResponse.json({ message: "Profile created", userId: result[0].userId }, { status: 201 });

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

        // Adjust this if your userId column name is 'userid' or 'id'
        const checkUser = await query("SELECT userid FROM users WHERE userid = $1", [userId]);

        if (checkUser.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // saveBase64Image is sync; remove await
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

    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

  

// export async function PUT(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { name, email, bio, photo, place, interests, about } = body;

//         if (!email) {
//             return NextResponse.json({ message: "Email is required for update" }, { status: 400 });
//         }

//         const savedPhotoPath = typeof photo === "string" ? saveBase64Image(photo, email) : null;
//         const interestsArray = Array.isArray(interests) ? interests : [];
//         const interestsString = `{${interestsArray.join(",")}}`; // For Postgres array format

//         const updateQuery = savedPhotoPath
//             ? `UPDATE users SET name = $1, bio = $2, photo = $3, place = $4, interests = $5, about = $6, updated_at = CURRENT_TIMESTAMP WHERE email = $7`
//             : `UPDATE users SET name = $1, bio = $2, place = $3, interests = $4, about = $5, updated_at = CURRENT_TIMESTAMP WHERE email = $6`;

//         const values = savedPhotoPath
//             ? [name, bio, savedPhotoPath, place, interestsString, JSON.stringify(about), email]
//             : [name, bio, place, interestsString, JSON.stringify(about), email];

//         await query(updateQuery, values);

//         return NextResponse.json({ message: "Profile updated successfully" });
//     } catch (error) {
//         console.error("PUT Error:", error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }
