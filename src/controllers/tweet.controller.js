import mongoose from "mongoose";
import { apierror } from "../utils/apierror.utils.js";
import { apiresponse } from "../utils/apiresponse.utils.js";
import { asynchandler } from "../utils/asychandler.utils.js";
import { tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

const createtweet = asynchandler(async(req,res)=>{
    const {content} = req.body
    const user = await User.findById(req.user._id)
    if (!user) {
        throw new apierror(440,"not available")
    }
const create = await tweet.create(
    {
        UserId: user._id,
        content: content
    }
)
return res.status(200).json(new apiresponse(200,create,"add"))
})

const getusertweets = asynchandler(async(req,res)=>{
    const user =  req.params._id
    console.log("user",user)
    const get = await  tweet.find({user:user})
    console.log("get",get)
    return res.status(200).json(new apiresponse(200,"get ",get))

})
const updatetweet = asynchandler(async(req,res)=>{
    const {content} = req.body
    const user = await User.findById(req.user._id)
    if (!user) {
        throw new apierror(440,"not available")
    }

    const update = await tweet.updateOne(
        {
            user: user
        },
        {
            $set: {content:content}
        }
    )
    return res.status(200).json(new apiresponse(200,"correct",update))
})

export{
    createtweet,
    getusertweets,
    updatetweet
}