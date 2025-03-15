



// import { User } from "../models/user.model.js";
// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandeler } from "../utils/asyncHandeler.js";
// import jwt from "jsonwebtoken";


// export const verifyJWT =  asyncHandeler( async(req,res,next)=>{
//   try {
//     const Token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
//     if (!Token) {
//       throw new ApiError(401,"unauthorizie request is not valid")
//     }
//     console.log("Token received:", Token); // Add this line to log the token
//     const decodedToken = jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET);
//    const user =  await User.findById(decodedToken?._id).select("-password -refreshToken");
//    if (!user) {
//       throw new ApiError(401,"Invalid acessToken")
//    }

//    req.user = user;
//    next()
//   } catch (error) {
//     throw new ApiError(401,error?.message||"Invalid acessToken")
//   }

// }) 


import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandeler(async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.accessToken;
    const tokenFromHeader = req.header("Authorization")?.replace("Bearer ", "").trim();

    console.log("Token from cookie:", tokenFromCookie); // Log token from cookie
    console.log("Token from header:", tokenFromHeader); // Log token from header

    const Token = tokenFromCookie || tokenFromHeader;
    if (!Token) {
      throw new ApiError(401, "Unauthorized request: token is not valid");
    }

    console.log("Token received:", Token); // Log the final token

    const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid accessToken");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error); // Log the error
    throw new ApiError(401, error?.message || "Invalid accessToken");
  }
});