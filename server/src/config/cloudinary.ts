import { v2 as cloudinary } from "cloudinary";

// Uses CLOUDINARY_URL from env (format: cloudinary://api_key:api_secret@cloud_name)
cloudinary.config();

export { cloudinary };
