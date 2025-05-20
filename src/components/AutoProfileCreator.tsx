
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function AutoProfileCreator() {
    const { data: session, status } = useSession();

    useEffect(() => {
        const syncProfile = async () => {
            if (status !== "authenticated" || !session?.user?.email) return;

            const { email, name, image, id } = session.user;

            console.log("🔍 AutoProfileCreator: Session Data:", {
                email,
                name,
                image,
                id,
            });

            try {
                // Check if user already exists
                const checkRes = await fetch(`/api/check-user?userId=${encodeURIComponent(id || "")}`);
                const checkData = await checkRes.json();
                console.log("📡 Check user response:", checkData);

                if (!checkData.exists) {
                    const profileData = {
                        email: email || "",
                        name: name || "",
                        photo: image || "",
                        userId: id || "",
                    };

                    console.log("📤 Sending profile creation request with data:", profileData);

                    const createRes = await fetch("/api/profile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(profileData),
                    });

                    const resJson = await createRes.json();
                    console.log("✅ Profile creation response:", resJson);

                    if (!createRes.ok) {
                        console.error("❌ Profile creation failed:", resJson);
                    }
                } else {
                    console.log("✅ User already exists, skipping profile creation");
                }
            } catch (err) {
                console.error("❌ AutoProfileCreator error:", err);
            }
        };

        syncProfile();
    }, [session, status]);

    return null;
}

// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect } from "react";

// export default function AutoProfileCreator() {
//     const { data: session, status } = useSession();

//     useEffect(() => {
//         const syncProfile = async () => {
//             if (status !== "authenticated" || !session?.user?.email) return;

//             const { email, name, image, id } = session.user;

//             // Check if user exists by userId (must be id, not email)
//             const checkRes = await fetch(`/api/check-user?userId=${encodeURIComponent(id || "")}`);
//             const { exists } = await checkRes.json();

//             if (!exists) {
//                 await fetch("/api/profile", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         email: email || "",
//                         name: name || "",
//                         photo: image || "",
//                         userId: id || "",  // <-- Must send id here
//                     }),
//                 });
//             }
//         };

//         syncProfile();
//     }, [session, status]);

//     return null;
// }
