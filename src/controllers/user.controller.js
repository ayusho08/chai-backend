import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser= asyncHandler( async (req,res) =>{
   // get user details from frontend
   //validation - not empty 
   // check if user already exists : username,email
   //check images and check for avatar
   //upload them to cloudinary
   //create user object - create entry in db
   //remove password and refresh token field from response 
   //check for user creation 
   //return res
   const {fullName,email,username,password} = req.body
   // console.log("email:", email);

//    if(fullname === ""){
//     throw new ApiError(400, "fullname is required")
//    }

   if(
    [fullName,email,username,password].some(( field )=> field?.trim() === "")
   ){
      throw new ApiError(400,"all are required")
   }
   const existedUser = await User.findOne({
    $or: [{ username },{ email }]
   })
   if(existedUser){
    throw new ApiError(409,"user already exists")
   }
   // console.log(req.files);

//testing code 
let avatarLocalPath;
if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    avatarLocalPath = req.files.avatar[0].path; // REQUIRED: Reads the actual path
}

let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path; // REQUIRED: Reads the actual path
}

if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
}



//testing code end 
//    const avatarLocalPath = req.files?.avatar[0]?.path; // Note the [0] index accessor here!
//    const coverImageLocalPath = req.files?.coverImage[0]?.path; // Note the [0] index accessor here!

// // Validation check
// if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar file is required");
// }
   const avatar = await uploadOnCloudinary(avatarLocalPath)
//    if(!coverImageLocalPath){
//     throw new ApiError(400,"required coverimage")
//    }
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   if(!avatar){throw new ApiError(400,"required avatar")}
   
   const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
   })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser){
    throw new ApiError(500,"something went wrong")
   }
   

   return res.status(201).json(
    new ApiResponse(200,createdUser, "user created")
   )

} )
export {registerUser}