// app/api/places/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const input = req.nextUrl.searchParams.get("input");

    if (!input) {
        return NextResponse.json({ predictions: [] });
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&types=geocode`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error("❌ Error fetching Google Places:", err);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
