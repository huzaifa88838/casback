import { asynchandler } from "../utils/asychandler.utils.js";
import {apierror} from '../utils/apierror.utils.js'
import {apiresponse} from '../utils/apiresponse.utils.js'
import { uploadoncloudinary } from "../utils/cloudinary.js";
 import {User} from '../models/user.model.js'
import jwt from "jsonwebtoken"
import { response } from "express";
import mongoose from "mongoose";
const generateaccessandreferhtoken = (async(userid)=>{
const user = await User.findById(userid)
const accesstoken =  user.generateaccesstoken ()
const refershtoken = user.generaterefreshtoken()
user.refreshToken = refershtoken
await user.save({validateBeforesave: false})

return{accesstoken,refershtoken}
})


const registerUser = asynchandler(async (req, res) => {
    const {
        username,
        fullName,
        email,
        password,
        phone,
        dateOfBirth,
        gender,
        address,
        bio,
        qualification,
        university,
        graduationYear,
        specialization,
        experience,
        subjects,
        teachingLevel,
        previousInstitutions,
        references,
        availableTimings,
        // preferredMode,
        expectedSalary,
        teachingMethodology,
        languages,
        skills,
        achievements
    } = req.body;

    // Check if required fields are empty
    if (
        [fullName, username, email,  password, phone, dateOfBirth, gender, address].some(field => field?.trim() === "")
    ) {
        throw new apierror(400, "All required fields must be filled");
    }

    // Check if user already exists (email or username)
    const existedUser = await User.findOne({
        $or: [{ email },{username}]
    });

    if (existedUser) {
        throw new apierror(409, "User with email or username already exists");
    }

    // Handling file uploads
    let cnicFront = "";
    let cnicBack = "";
    let lastDegree = "";
    let profilePicture=""
   ;

    if (req.files?.cnicFront) {
        const uploadedFile = await uploadoncloudinary(req.files.cnicFront[0].path);
        cnicFront = uploadedFile?.url || "";
    }
    if (req.files?.profilePicture) {
        const uploadedFile = await uploadoncloudinary(req.files.profilePicture[0].path);
        profilePicture = uploadedFile?.url || "";
    }

    if (req.files?.cnicBack) {
        const uploadedFile = await uploadoncloudinary(req.files.cnicBack[0].path);
        cnicBack = uploadedFile?.url || "";
    }

    if (req.files?.lastDegree) {
        const uploadedFile = await uploadoncloudinary(req.files.lastDegree[0].path);
        lastDegree = uploadedFile?.url || "";
    }

  

    // Create user in pending state
    const user = await User.create({
        fullName,
        email,
        username,
        password,
        phone,
        dateOfBirth,
        gender,
        address,
        bio,
        qualification,
        university,
        graduationYear,
        specialization,
        experience,
        subjects,
        teachingLevel,
        previousInstitutions,
        references,
        availableTimings,
        // preferredMode,
        expectedSalary,
        teachingMethodology,
        languages,
        skills,
        achievements,
        cnicFront,
        cnicBack,
        lastDegree,
        profilePicture,

        isApproved: false // 🛑 User will be in pending state
    });

    return res.status(201).json(
        new apiresponse(201, user, "User registration request submitted. Waiting for admin approval.")
    );
});
const approveUser = asynchandler(async (req, res) => {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new apierror(404, "User not found");
    }

    user.isApproved = true; // ✅ Approve the user
    await user.save();

    return res.status(200).json(new apiresponse(200, user, "User approved successfully"));
});

const getApprovedUsers = asynchandler(async (req, res) => {
    const approvedUsers = await User.find({ isApproved: true });

    if (!approvedUsers || approvedUsers.length === 0) {
        throw new apierror(404, "No approved users found");
    }

    return res.status(200).json(new apiresponse(200, approvedUsers, "Approved users fetched successfully"));
});


const getSingleUser = asynchandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new apierror(400, "Invalid user ID format");
    }

    const user = await User.findById(id);

    if (!user) {
        throw new apierror(404, "User not found");
    }

    return res.status(200).json(new apiresponse(200, user, "User fetched successfully"));
});

const loginuser = asynchandler(async(req,res)=>{

    const { email, password } = req.body;
    if (!email) {
        throw new apierror(409,"email username required")
        
    }
    const user = await User.findOne({
        $or:[{email}]
    })
    if (!user) {
        throw new apierror(409, "user not available")
    }
    if (!user.isApproved) {
        throw new apierror(403, "Your account is pending approval. Please wait for admin approval.");
    }
const checkpassword = await user.ispasswordcorrect(password)
if (!checkpassword) {
    throw new apierror(430, "your password is incorrect")
}
const {accesstoken,refershtoken} = await generateaccessandreferhtoken(user._id)
const final = await User.findById(user._id).select("-password -refershtoken")

let options= {
    httpOnly:true,
    secure: true
}

return res 
.status(200)
.cookie("accesstoken",accesstoken,options)
.cookie("refershtoken",refershtoken,options).json(
new apiresponse(200, 

{
   user:  final,accesstoken,refershtoken
},
"user logged in"
)
)

})
 const logout = asynchandler(async(req,res)=>{
await User.findByIdAndUpdate(
    req.user_id,
  {
    $unset:{
        refershtoken1:1
    },
   
  },
  {
    new: true
  }
)
let options = {
    httpOnly:true,
    secure: true
}
return res 
.cookie("accesstoken",options)
.cookie("refershtoken",options)
.json(
    new apiresponse(200,{}, "user logged out")
)

 })

 const getAllUsers = asynchandler(async (req, res) => {
    try {
        const allUsers = await User.find({}); // 🔹 सभी यूजर्स को डेटाबेस से लाओ
        res.status(200).json(allUsers); // 🔹 JSON response भेजो
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});
 const rreshtokens = asynchandler(async(req,res)=>{
    const token = req.cookies.refershtoken|| req.body.refershtoken
    console.log("token",token)
    const decodedtoken = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
    console.log("decoded",decodedtoken)
    const user = await User.findById(decodedtoken?._id)
    console.log("user",user)
   

    req.user = user
let options = {
    httpOnly:true,
    secure: true
}
const {accesstoken,refershtoken} = await generateaccessandreferhtoken(user._id)
return res 
.status(200)
.cookie(accesstoken,"accesstoken",options)
.cookie(refershtoken,"refershtoken",options)
.json(new apiresponse(200,),
{
    user,accesstoken,refershtoken
},
"refershtokenis upfated"
)
 })
const changepassword = asynchandler(async(req,res)=>{
    const {oldpassword,newpassword} = req.body
    const user = await User.findById(req.user?._id)

    const checkoldpass =  await user.ispasswordcorrect(oldpassword)
    if (!checkoldpass) {
        throw new apierror(400,"your passord is incorrect")
    }
 
    user.password = newpassword
    await user.save({validateBeforesave: false})

    return res 
    .status(200)
    .json(new apiresponse(200,user, "your password is changed"))
})

const currentuser = asynchandler(async(req,res)=>{
    return res
    .status(200)
    .json(200,req.user,"user details")
})
 const changeuser = asynchandler(async(req,res)=>{
    const {email,fullname} = req.body
    if (!email|| !fullname) {
        throw new apierror(404,"all frields are required ")
    }
    const user = await User.findByIdAndUpdate(req.user_id,
    {
        $set:{
email:email,
fullnmae: fullname

        }
    },
    {
        new: true
    }
    ).select("-passord")
return res 
.status(200)
.json(new apiresponse(200, user,"updates are changed"))

 })
 const updatedavtar = asynchandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new apierror(400,"avatar required")
    }
    const avatar = await uploadoncloudinary(avatarLocalPath)
    if (!avatar) {
        throw new apierror(420,"something went wrong")
    }
    const user = User.findByIdAndUpdate(req.user?._id,
    {
        $set:{
avatar: avatar?.url
        }
    },
    {
        new: true
    }
    
    ).select("-password")
    return res .status(200)
    .json((200,user,"avatara changed"))
 })
 const updatedcoverimage = asynchandler(async(req,res)=>{
    const upcoverimage = req.file?.path
    if (!upcoverimage) {
        throw new apierror(400,"avatar required")
    }
    const coverimage = await uploadoncloudinary(upcoverimage)
    if (!coverimage) {
        throw new apierror(420,"something went wrong")
    }
    const user = User.findByIdAndUpdate(req.user?._id,
    {
        $set:{
coverimage: coverimage?.url
        }
    },
    {
        new: true
    }
    
    ).select("-password")
    return res .status(200)
    .json((200,user,"avatara changed"))
 })
 const subscribtionbased = asynchandler(async(req,res)=>{


 const {username} = req.params
 if (!username?.trim()) {
    throw new apierror(400,"user not find")
 }
 const channel = User.aggregate([
    {
$match:{username: username}
 },
{
    $lookup:{
        from: "subscribtions",
        localField: "_id",
        foreignField: "channel",
        as : "subscribers"
    }
},
{
    $lookup:{
        from: "subscribtions",
        localField: "_id",
        foreignField: "subscriber",
        as : "subscribertodo"
    }
},
{
$addFields:{
    subscribercount :{
        $size:"$subscribers"
    },
    channelsubscribed: {
        $size: "$subscribertodo"
    },
    issubscribed: {
       $cond: {
        if: {$in: [req.user?._id, "$subscribers","$subscriber"]},
        then: true,
        else: false
       }
    }
}
},
 {
    $project:{
fullname:1,
username:1,
email:1,
avatar:1,
coverimage:1,
subscribercount:1,
channelsubscribed:1
    }
 },
 
])
// if (!channel.length) {
//     throw new apierror(400,"something went wrong")
// }
return res .status(200)
.json(new apiresponse (200,channel[0],"user channel fetched"))
})
const calwatchhistory = asynchandler(async(req,res)=>{
    const user = await User.aggregate([
        {

            $match:{
                _id: new mongoose.Types.ObjectId(req.user_id)
            },
            
    },

    {
       $lookup: {
        from: "videos",
        localField: "watchhistory",
        foreignField: "_id",
        as: "watchhistory"
       } ,
       pipeline:([{
        $lookup:{
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",

            pipeline:([{
                $project: {
                    fullname:1,
                    avatar: 1,
                    username: 1
                }
            }])
        }
       }])
       
    },
    {
$addFields: {
    owner: {
        $first: "owner"
    }
}
    }
   
])
return res .status(200)
.json(new apiresponse(200, user[0].watchhistory,"user fteched"))
})
export{
    registerUser,
    loginuser,
    logout,
    rreshtokens,
    changepassword,
    updatedavtar,
    updatedcoverimage,
    currentuser,
    changeuser,
    subscribtionbased,
    calwatchhistory,
    getAllUsers,
    approveUser,
    getApprovedUsers,
   getSingleUser 
    
    

}