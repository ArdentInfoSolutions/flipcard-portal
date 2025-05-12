import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { query } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        try {
            // Get session from NextAuth
            const session = await getSession({ req });
            if (!session || !session.user?.id) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            // Extract data from the request body
            const { name, email, bio, photo, place, interests, about } = req.body;

            // Update the user profile in the database
            const updatedUser = await query(
                `UPDATE users 
                 SET name = $1, 
                     email = $2, 
                     bio = $3, 
                     photo = $4, 
                     place = $5, 
                     interests = $6, 
                     about = $7 
                 WHERE id = $8 
                 RETURNING *`,
                [
                    name,
                    email,
                    bio,
                    photo,
                    place,
                    interests,
                    JSON.stringify(about || []), // Ensure 'about' is stored as a JSON array or string
                    session.user.id,
                ]
            );

            // Return the updated user data
            return res.status(200).json(updatedUser[0]);
        } catch (error) {
            console.error("Error updating profile:", error);
            return res.status(500).json({ message: "Error updating profile" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
