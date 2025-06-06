import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query || typeof query !== 'string') {
        return NextResponse.json({
            code: 400,
            message: "Query parameter is required",
            data: null,
            error: {
                errorCode: "INVALID_QUERY",
                errorMessage: "Please provide a valid location query string",
            },
        }, { status: 400 });
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`, {
            headers: {
                'User-Agent': 'MyNextApp/1.0' // Required by Nominatim's policy
            }
        });

        const places = await response.json();

        const results = places.map((place: any) => ({
            name: place.display_name,
            lat: parseFloat(place.lat),
            lon: parseFloat(place.lon),
            city: place.address?.city || place.address?.town || place.address?.village || null,
            state: place.address?.state || null,
            country: place.address?.country || null,
            postcode: place.address?.postcode || null,
        }));
        

        return NextResponse.json({
            code: 200,
            message: "Success",
            data: results,
            error: null,
        });
    } catch (error: any) {
        return NextResponse.json({
            code: 500,
            message: "Internal Server Error",
            data: null,
            error: {
                errorCode: error.name || "UNKNOWN_ERROR",
                errorMessage: error.message || "Something went wrong",
            },
        }, { status: 500 });
    }
}
