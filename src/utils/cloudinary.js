import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadoncloudinary = async (localpath) => {
    try {
        if (!localpath || !fs.existsSync(localpath)) {
            console.log("File not found, skipping upload.");
            return null;
        }

        const response = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto"
        });

        console.log("Uploaded to Cloudinary:", response.secure_url);

        // Check if file exists before deleting
        if (fs.existsSync(localpath)) {
            fs.unlinkSync(localpath);
            console.log("Local file deleted:", localpath);
        }

        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        // Only delete file if it exists
        if (fs.existsSync(localpath)) {
            fs.unlinkSync(localpath);
            console.log("Local file deleted after error:", localpath);
        }

        return null;
    }
};

export { uploadoncloudinary };
