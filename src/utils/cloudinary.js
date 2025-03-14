import { v2 as cloudinary } from "cloudinary";  
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if (!localFilePath) {
            return null;
        }
      const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        })
        console.log("file is uploaded successfully", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved file if not uploaded to Cloudinary
        console.log("Error uploading file to Cloudinary: ", error);
    }
}

export { uploadOnCloudinary };