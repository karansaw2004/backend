import {asyncHandeler} from "../utils/asyncHandeler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
// import {upload} from "../middlewares/multer.middleware.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from "../utils/ApiResponse.js"
import httpOnly from "http"
import  jwt from "jsonwebtoken"

// const generateAcessAndRefreshToken = async(userId)=>{
//     try {
//         const user = await User.findById(userId);
//         const accessToken = user.generateAccessToken();
//         const refreshToken = user.generateRefreshToken();
//         user.refreshToken = refreshToken;
//        await user.save({validationBeforeSave: false}); 
//        return {accessToken,refreshToken}
//     } catch (error) {
//         throw new ApiError(502,"erro in generating tokens")
//     }

// }
const generateAcessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Error in generating tokens:", error);
      throw new ApiError(502, "erro in generating tokens");
    }
  };



const registerUser = asyncHandeler(async (req,res)=>{
    const {fullName, email, password, username,} = req.body
    if (
        [username,password,email,fullName].some((field)=>field?.trim()==="")
    ) {
        throw new ApiError(400,"All fields is required")
    }

   const existedUser = await User.findOne({
        $or: [{username},{email}]
    });

    if (existedUser) {
        throw new ApiError(409,"User already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    } 
    
    
    if (!avatarLocalPath) {
        throw new ApiError(400,"Avatar Image is required");
    }

    // if (!coverImageLocalPath) {
    //     throw new ApiError(400,"Cover page is required")
    // }


    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

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
    const createdUser = await User.findById(user._id).select(
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

const loginUser = asyncHandeler(async(req,res)=>{



    //username
    //password
    //if username and password are same then
    //refreshtoken in response
    //send cookies
    const {email,username,password} = req.body;

    if(!email && !username){
        throw new ApiError(400,"email or username is required")
    }
   const user = await User.findOne({
        $or:[{email},{username}]
    });

    if (!user) {
        throw new ApiError(404,"user does't exist")
    }

    const isPasswordValid = user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(404,"wrong password1")
    }

    // const {accessToken,refreshToken} = await generateAcessAndRefreshToken(user._id);

    // const logedInUser = await User.findById(user._id).select("-password -refreshToken");

    // const options =  {
    //     httpOnly,
    //     secure: true, 
    // }

    // return res
    // .status(200)
    // .cookie("accessToken", accessToken,options)
    // .cookie("refreshToken", refreshToken, options)
    // .json(
    //     new ApiResponse(
    //         200,
    //         {
    //             user: logedInUser, accessToken, refreshToken
    //         },

    //         "user logedin sucessfully"
    //     )
    // )

    const {accessToken,refreshToken} = await generateAcessAndRefreshToken(user._id);

    const logedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options =  {
        httpOnly,
        secure: process.env.NODE_ENV === 'production', // Set secure flag based on environment 
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken,options) // Line 134
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: logedInUser, accessToken, refreshToken
            },
            "user logedin sucessfully"
        )
    )
});

const logOutUser = asyncHandeler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options) // Corrected method name
      .clearCookie("refreshToken", options) // Corrected method name
      .json(
        new ApiResponse(
          200,
          {},
          "user loged out sucessfully"
        )
      );
  });



  const refreshAccessToken = asyncHandeler(async(req,res)=>{

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401,"unautherized request");
      
    }

    try {
      const decodedRefreshToken =  jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      )
      const user = await User.findById(decodedRefreshToken?._id);
      if (!user) {
        throw new ApiError(401,"Invalid Refresh token")
      }
      if (incomingRefreshToken != user?.refreshToken) {
        throw new ApiError(401,"Refresh Token is Expired or Used")
      }
      const options = {
        httpOnly,
        secure: process.env.NODE_ENV === 'production', // Set secure flag based on environment 
      }
  
      const {accessToken,newrefreshToken} =  await generateAcessAndRefreshToken(user._id)
  
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",newrefreshToken,options)
      .json(
        new ApiResponse(
          200,
          {accessToken,refreshToken: newrefreshToken},
          "Acess token is refreshed sucessfully "
        )
      )
    } catch (error) {
      throw new ApiError(508, error?.message || "invalid refresh token")
    }

  })



export {registerUser,loginUser,logOutUser,refreshAccessToken};