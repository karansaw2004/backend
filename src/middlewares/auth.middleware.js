import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandeler } from "../utils/asyncHandeler";
import jwt from "jsonwebtoken"

export const verifyJWT =  asyncHandeler( async(req,res,next)=>{
  try {
    const Token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    if (!Token) {
      throw new ApiError(401,"unauthorizie request is not valid")
    }
  
    const decodedToken = jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET);
   const user =  await User.findById(decodedToken?._id).select("-password -refreshToken");
   if (!user) {
      throw new ApiError(401,"Invalid acessToken")
   }
  
   req.user = user;
   next()
  } catch (error) {
    throw new ApiError(401,error?.message||"Invalid acessToken")
  }

}) 