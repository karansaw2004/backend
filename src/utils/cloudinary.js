import { v2 as cloudinary } from "cloudinary";  
import fs from 'fs';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:CLOUDINARY_CLOUD_SECRET,
    api_secret:CLOUDINARY_CLOUD_SECRET,
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if (!localFilePath) {
            return null;
        }
      const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        })
        console.log("file is uploaded sucessfully",response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)// remove the localy save file if dont upload in cloudanary
    }
}