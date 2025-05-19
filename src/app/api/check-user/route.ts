import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ exists: false });
    }

    const result = await query("SELECT * FROM users WHERE uuid = $1", [userId]);
    return NextResponse.json({ exists: result.length > 0 });
}



// import { NextRequest, NextResponse } from "next/server";
// import { query } from "@/lib/db"; // Adjust path to your db handler

// export async function GET(req: NextRequest) {
//     const email = req.nextUrl.searchParams.get("email");

//     if (!email) {
//         return NextResponse.json({ exists: false });
//     }

//     try {
//         const result = await query(
//             `SELECT 1 FROM users WHERE email = $1 LIMIT 1`,
//             [email]
//         );

//         return NextResponse.json({ exists: result.length > 0 });
//     } catch (err) {
//         console.error("Error checking user existence:", err);
//         return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//     }
// }


