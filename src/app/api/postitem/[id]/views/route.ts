// app/api/posts/[id]/views/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// PATCH -> increment view count
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const result = await query(
      `UPDATE postitem 
       SET viewcount = COALESCE(viewcount, 0) + 1 
       WHERE id = $1 
       RETURNING id, viewcount`,
      [id]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "View count incremented",
      postId: id,
      views: result[0].views,
    });
  } catch (err: any) {
    console.error("❌ PATCH /views error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
