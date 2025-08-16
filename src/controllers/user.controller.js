import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {
    // Your registration logic here
  // return res.status(200).json({
       // success: true,
       // message: "User registered successfully"
   // });

   const{fullName, email, username, password } = req.body
   console.log("email:",email);

  if (
    [fullName, email, username, password].some((field) => 
        field?.trim() === "")
 ) {
    throw new ApiError(400, "All fields are required");
 }
   // if(fullName === "" ){
   // throw new ApiError(400, "Full name is required");
  // }
   const existedUser = User.findOne({
        $or: [{ email },{ username }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath || !coverImageLocalPath) {
        throw new ApiError(400, "Avatar and cover image are required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar || !coverImage) {
        throw new ApiError(400, "Avatar and Cover Image is required");
    }

    const user = await User.create({
        fullName,
        email,
        username: username.tolowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage.url // || ""
    })

    const createdUser = await User.findById90(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    
    );

})

export { 
    registerUser,
} ;
