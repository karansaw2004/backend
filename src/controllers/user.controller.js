import {asyncHandeler} from "../utils/asyncHandeler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
// import {upload} from "../middlewares/multer.middleware.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandeler(async (req,res)=>{
    const {fullName, email, password, username} = req.body
    if (
        [username,password,email,fullName].some((field)=>field?.trim()==="")
    ) {
        throw new ApiError(400,"All fields is required")
    }

   const existedUser = User.findOne({
        $or: [{username},{email}]
    });

    if (existedUser) {
        throw new ApiError(409,"User already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar Image is required");
    }

    // if (!coverImageLocalPath) {
    //     throw new ApiError(400,"Cover page is required")
    // }
    uploadOnCloudinary

    const avatar = uploadOnCloudinary(avatarLocalPath);
    const coverImage = uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400,"Avatar Image is required");
    }

   const user =  await User.create({
        password,
        email,
        avatar: avatar.url,
        coverImage:coverImage?.url||"",
        fullName,
        username: username.toLowerCase()
    });
    const createdUser = User.findById(user._id).select(
        "-password -refrehToken"
    );
    if (!createdUser) {
        console.log("fail to register user");
       throw new ApiError(500,"Fail to register user");
    }
    console.log("Usser created sucessfully:",user._id);
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user is registered Sucessfully")
    )
})
 
export {registerUser};