
import { apierror } from "../utils/apierror.utils.js";
import { asynchandler } from "../utils/asychandler.utils.js";
import { apiresponse } from "../utils/apiresponse.utils.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"




const logouting = asynchandler(async(req,res,next)=>{
    const token = req.cookies.accessToken

if (!token) {
    throw new apierror(400,"something went wrong")
}
const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
const user = await User.findById(decodedtoken?._id).select("-password -refershtoken")


req.user =  user

next()

})


export {logouting}