import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    //api environment variable: CLOUDINARY_URL=cloudinary://485393824585727:PTrdkYFm2N7X7d31y3IZiRpST24@dzvwn5ylm
});

export default cloudinary;
