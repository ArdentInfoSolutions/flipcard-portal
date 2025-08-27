import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

// 🔧 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// 📤 Upload remote file (image/video) to Cloudinary
async function uploadToCloudinaryUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      url,
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result?.secure_url || "");
      }
    );
  });
}

// 📥 GET posts
export async function GET() {
  try {
    const result = await query("SELECT * FROM postitem ORDER BY id DESC");

    const parsedResult = result.map((item: any) => {
      let raw = item.links_or_images;
      if (typeof raw === "string") {
        try {
          raw = JSON.parse(raw);
        } catch {
          raw = [];
        }
      }

      const safe = (raw || [])
        .map((img: any) => {
          if (typeof img === "string" && img.startsWith("data:image")) {
            return { url: img, title: "" };
          }

          if (typeof img === "string") {
            const url = img.trim();
            if (url) {
              const valid = url.startsWith("http") ? url : `https://${url}`;
              try {
                new URL(valid);
                return { url: valid, title: "" };
              } catch { }
            }
            return null;
          }

          if (typeof img === "object") {
            const src = img.base64 || img.url;
            if (!src) return null;

            let url = src.trim();
            if (!url.startsWith("http") && !url.startsWith("data:image")) {
              url = `https://${url}`;
            }

            try {
              new URL(url);
              return { url, title: img.title || "" };
            } catch { }
          }

          return null;
        })
        .filter(Boolean);

      return {
        ...item,
        links_or_images: safe,
      };
    });

    return NextResponse.json(parsedResult);
  } catch (err: any) {
    console.error("GET error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 📤 POST new post
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
      videosurl,
      images,
      userId,
      profilePhoto,
      isShortvideo,
      user_name,
      thumbnail,
      videoweburl, // from frontend (session)
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 📸 Try to get user's DB profile photo
    const userResult = await query(
      `SELECT photo FROM users WHERE userid = $1`,
      [userId]
    );

    console.log("👤 DB user photo result:", userResult);

    let finalPhoto = profilePhoto || ""; // fallback if needed

    const dbPhoto = userResult[0]?.photo;
    if (typeof dbPhoto === "string" && dbPhoto.trim() !== "") {
      finalPhoto = dbPhoto;
    }
    

    console.log("🖼 Final profile photo to insert:", finalPhoto);

    // 📦 Prepare post content
    let content: any = null;

    if (postType === "web") {
      content = webLinks;
    } else if (postType === "videos") {
      /*content = await Promise.all(
        videos.map(async (item: any) => ({
          videoUrl: await uploadToCloudinaryUrl(item.videoUrl),
          url: item.url,
        }))
      );*/
    } else if (postType === "images") {
      content = await Promise.all(
        images.map(async (item: any) => ({
          base64: await uploadToCloudinaryUrl(item.base64),
          url: item.url,
        }))
      );
    }
    
    // 💾 Insert post into DB
    const result = await query(
      `INSERT INTO postitem 
      (title, promo, description, post_type, categories, links_or_images, user_id, profile_photo,is_short_video,user_name,
      videosurl,
        videoweburl,videothumb)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13)
      RETURNING *`,
      [
        title,
        promo,
        description,
        postType,
        categories,
        JSON.stringify(content),
        userId,
        finalPhoto,
        isShortvideo,
        user_name,
        videosurl,
        videoweburl,
        thumbnail,
      ]
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



// import { NextRequest, NextResponse } from "next/server";
// import { query } from "@/lib/db";
// import { v2 as cloudinary } from "cloudinary";

// // Configure Cloudinary with your environment variables
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//     api_key: process.env.CLOUDINARY_API_KEY!,
//     api_secret: process.env.CLOUDINARY_API_SECRET!,
// });

// // Helper: Upload a remote image/video URL to Cloudinary and get secure URL
// async function uploadToCloudinaryUrl(url: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload(
//             url,
//             { resource_type: "auto" }, // auto detects image/video/etc
//             (error, result) => {
//                 if (error) {
//                     console.error("Cloudinary upload error:", error);
//                     return reject(error);
//                 }
//                 resolve(result?.secure_url || "");
//             }
//         );
//     });
// }

// export async function GET() {
//     try {
//         const result = await query("SELECT * FROM postitem ORDER BY id DESC");

//         // Parse links_or_images from string to array if needed
//         const parsedResult = result.map((item: any) => ({
//             ...item,
//             links_or_images: typeof item.links_or_images === 'string'
//                 ? JSON.parse(item.links_or_images)
//                 : item.links_or_images,
//         }));

//         return NextResponse.json(parsedResult);
//     } catch (error: any) {
//         console.error("❌ GET post error:", error.message);
//         return NextResponse.json(
//             { error: error.message || "Something went wrong" },
//             { status: 500 }
//         );
//     }
// }


// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();

//         const {
//             title,
//             promo,
//             description,
//             postType,
//             categories,
//             webLinks,
//             videoLinks,
//             images,
//             userId,
//         } = body;

//         if (!userId) {
//             return NextResponse.json({ error: "User ID is required" }, { status: 400 });
//         }

//         // 1. Fetch user profile photo from database (pseudo-code)
//         const userProfile = await query(
//             "SELECT photo FROM users WHERE user_id = $1",
//             [userId]
//         );

//         const profilePhoto = userProfile?.[0]?.photo || null;

//         let content: any = null;

//         if (postType === "web") {
//             // For web posts, just save links as is
//             content = webLinks;
//         } else if (postType === "videos" && Array.isArray(videoLinks)) {
//             // Upload all video URLs to Cloudinary, get back their URLs
//             content = await Promise.all(
//                 videoLinks.map(async (url: string) => await uploadToCloudinaryUrl(url))
//             );
//         } else if (postType === "images" && Array.isArray(images)) {
//             // Upload all image URLs to Cloudinary, get back their URLs
//             content = await Promise.all(
//                 images.map(async (url: string) => await uploadToCloudinaryUrl(url))
//             );
//         }

//         const result = await query(
//             `INSERT INTO postitem (title, promo, description, post_type, categories, links_or_images)
//        VALUES ($1, $2, $3, $4, $5, $6)
//        RETURNING *`,
//             [title, promo, description, postType, categories, JSON.stringify(content)]
//         );

//         return NextResponse.json(result[0]);
//     } catch (error: any) {
//         console.error("❌ Backend POST error:", error.message);
//         return NextResponse.json(
//             { error: error.message || "Something went wrong" },
//             { status: 500 }
//         );
//     }
// }
