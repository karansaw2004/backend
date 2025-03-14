import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';



const userSchema = new Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String,//cloudanary url
        required:true,
    },
    coverImage:{
        type:String, //cloudanary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
     refreshToken:{
        type:String,
     }
     
},{timestamps:true})


userSchema.pre("save",async function(next) {
    if(this.isModified("password")){

        this.password = await bcrypt.hash(this.password,10)
        next()
    }
    else{
        next() 
    };
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password,this.password)
}

// userSchema.methods.generateAcessToken = async function () {
//    return jwt.sign({
//          _id:this._id,
//          email:this.email,
//          fullName:this.fullName,
//          username:this.username
//     },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACESS_TOKEN_EXPIRY,
//         }

// )
// }
// userSchema.methods.generateRefreshToken = async function () {
//     jwt.sign({
//         _id:this._id,
       
//    },
//        process.env.REFRESH_TOKEN_SECRET,
//        {
//            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//        }

// )
// }
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
        username: this.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  };
  
  userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  };


export const User = mongoose.model("User", userSchema);