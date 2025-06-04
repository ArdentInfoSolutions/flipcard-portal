import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

// Async helper to upload base64 image to Cloudinary
async function saveBase64Image(photo: string, userId: string): Promise<string | null> {
    if (!photo) return null;

    if (photo.startsWith("data:image")) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(photo, {
                folder: "user_profiles",
                public_id: `profile-${userId}`,
                overwrite: true,
            });
            return uploadResponse.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return null;
        }
    } else if (photo.startsWith("http")) {
        // If photo is already a URL, just return it
        return photo;
    } else {
        return null;
    }
}
function formatAbout(about: any): string {
    if (!Array.isArray(about)) return "";
    return about
        .map((item) => `${item.title}\n${item.detail}`)
        .join("\n\n"); // double line break between sections
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("📥 Received POST data:", body);

        const { name, email, photo, userId } = body;

        if (!name || !email || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user already exists by email
        const existingUser = await query("SELECT userid FROM users WHERE email = $1", [email]);
        if (existingUser.length > 0) {
            return NextResponse.json({ message: "User already exists, no action taken.", userId: existingUser[0].userid }, { status: 200 });
        }

        // Upload photo to Cloudinary and get URL
        const savedPhoto = await saveBase64Image(photo, userId.toString());

        // Insert new user profile
        const result = await query(
            `INSERT INTO users (userid, name, email, photo) VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, name, email, savedPhoto]
        );

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

        // Check if user exists
        const checkUser = await query("SELECT userid FROM users WHERE userid = $1", [userId]);
        if (checkUser.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const savedPhotoPath = (typeof photo === "string" && photo) ? await saveBase64Image(photo, userId.toString()) : null;

        const interestsArray = Array.isArray(interests) ? interests : [];

        // Save 'about' as JSON string if it's an array, else empty string or null
        const aboutJson = Array.isArray(about) ? JSON.stringify(about) : null;
        // Update query depending on if photo was uploaded or not
        const updateQuery = savedPhotoPath
            ? `UPDATE users SET name = $1, bio = $2, photo = $3, place = $4, interests = $5, about = $6, updated_at = CURRENT_TIMESTAMP WHERE userid = $7`
            : `UPDATE users SET name = $1, bio = $2, place = $3, interests = $4, about = $5, updated_at = CURRENT_TIMESTAMP WHERE userid = $6`;

        const values = savedPhotoPath
            ? [name, bio, savedPhotoPath, place, interestsArray, aboutJson, userId]
            : [name, bio, place, interestsArray, aboutJson, userId];

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
            about: parsedAbout,  // array or null
        });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


// export async function PUT(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const { userId, name, email, bio, photo, place, interests, about } = body;

//         if (!userId) {
//             return NextResponse.json({ message: "User ID is required for update" }, { status: 400 });
//         }

//         // Check if user exists
//         const checkUser = await query("SELECT userid FROM users WHERE userid = $1", [userId]);
//         if (checkUser.length === 0) {
//             return NextResponse.json({ message: "User not found" }, { status: 404 });
//         }

//         // Upload photo to Cloudinary if new photo string is provided
//         const savedPhotoPath = (typeof photo === "string" && photo) ? await saveBase64Image(photo, userId.toString()) : null;

//         const interestsArray = Array.isArray(interests) ? interests : [];

//         // Update query depending on if photo was uploaded or not
//         const updateQuery = savedPhotoPath
//             ? `UPDATE users SET name = $1, bio = $2, photo = $3, place = $4, interests = $5, about = $6, updated_at = CURRENT_TIMESTAMP WHERE userid = $7`
//             : `UPDATE users SET name = $1, bio = $2, place = $3, interests = $4, about = $5, updated_at = CURRENT_TIMESTAMP WHERE userid = $6`;

//         const values = savedPhotoPath
//             ? [name, bio, savedPhotoPath, place, interestsArray, JSON.stringify(about), userId]
//             : [name, bio, place, interestsArray, JSON.stringify(about), userId];

//         await query(updateQuery, values);

//         return NextResponse.json({ message: "Profile updated successfully" });

//     } catch (error: any) {
//         console.error("❌ PUT Error:", error.message || error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }



// export async function GET(req: NextRequest) {
//     try {
//         const userId = req.nextUrl.searchParams.get("userId");

//         if (!userId) {
//             return NextResponse.json({ message: "Missing userId" }, { status: 400 });
//         }

//         const result = await query("SELECT userid, name, email, bio, photo, place, interests, about FROM users WHERE userid = $1", [userId]);

//         if (result.length === 0) {
//             return NextResponse.json({ message: "User not found" }, { status: 404 });
//         }

//         const user = result[0];

//         // If about is stored as a JSON string in DB, parse it
//         let parsedAbout = null;
//         try {
//             parsedAbout = typeof user.about === "string" ? JSON.parse(user.about) : user.about;
//         } catch {
//             parsedAbout = user.about;
//         }

//         return NextResponse.json({
//             userId: user.userid,
//             name: user.name,
//             email: user.email,
//             bio: user.bio,
//             photo: user.photo,
//             place: user.place,
//             interests: user.interests,
//             about: parsedAbout,
//         });
//     } catch (error) {
//         console.error("GET Error:", error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }
