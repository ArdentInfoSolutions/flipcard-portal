import { NextRequest, NextResponse } from 'next/server';
import { query } from "@/lib/db";

export async function GET(req: NextRequest, context: { params:Promise< { id: string } > }) {
    const { id } = await context.params;

    console.log("✅ Received ID:", id);

    try {
        const result = await query(
            `SELECT * FROM website_details WHERE id = $1`, // ✅ WHERE clause!
            [id]
        );

        if (result.length === 0) {
            return NextResponse.json({ error: "Website not found" }, { status: 404 });
        }

        const website = result[0];

        // Assuming 'website.events' holds event data or event image(s)
        const eventImage = website.event_image ? website.event_image : null;  // Adjust field if needed
    // Assuming events is a JSON string

        return NextResponse.json({
            websiteName: website.website_name || null,
            overview: website.overview || null,
            about: website.about || null,
            tags: website.tags || null,
         
            eventImage: eventImage || null,  // Provide eventImage separately if needed
            eventLink: website.event_link || null,
            whatsNew: website.whats_new || null,
            phone: website.phone || null,
            email: website.email || null,
            address: website.address || null,
            googleMapsLink: website.google_maps_link || null,
            coverPhoto: website.cover_photo || null,
            logo: website.logo || null,
            images: website.images || [],
            topPages: website.top_pages || [],
            privacy_policy: website.privacy_policy || null,
        });
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch website data" }, { status: 500 });
    }
}
