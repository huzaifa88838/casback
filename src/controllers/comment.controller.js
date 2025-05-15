import { apierror } from "../utils/apierror.utils.js";
import { apiresponse } from "../utils/apiresponse.utils.js";
import { asynchandler } from "../utils/asychandler.utils.js"
import mongoose from "mongoose";
import {comment} from "../models/comments.model.js"


const getVideoComments = asynchandler(async (req, res) => {
    //TODO: get all comments for a video
    const videoId =  new mongoose.Types.ObjectId(req.params._id)
    if (!videoId) {
        throw new apierror(400,"video not found")
    }
    const {page = 1, limit = 10} = req.query
    const comments = await comment.find({videoId:videoId})
    if (!comments) {
        throw new apierror(400,"video not found")
    }
    const totalComments = comments.length;
    return res.status(200).json(new apiresponse(200,totalComments, "all comments",{
        currentpage: page,
        limit: limit
    }))
        
    })
const addcomment = asynchandler(async(req,res)=>{
    const {content} = req.body
    if (!content) {
        throw new apierror(400,"write ")
    }
    const videoId = new mongoose.Types.ObjectId(req.params._id)
    const addcomm = await comment.create(
      {
        videoId: videoId,
        content: content
      }
    )
    return res.status(200).json(new apiresponse(200, addcomm,"comment added"))
    
})
const update = asynchandler(async(req,res)=>{
    const {content} = req.body
    if (!content) {
        throw new apierror(400,"error")
    }
    const videoId = new mongoose.Types.ObjectId(req.params._id)
    const update = await comment.updateOne(
        {_id: videoId},
        {$set: {content: content}}
    )
    return res.status(200).json(new apiresponse(200, update,"updatecomment"))
})
// const updatecomment = new mongoose.Types.ObjectId(req.params._id)
const deletecomment = asynchandler(async(req,res)=>{
    const videoId = new mongoose.Types.ObjectId(req.params._id)

    const deletee = await comment.findById(videoId)
    const deletecom = await comment.deleteOne(deletee)

    return res.status(200).json(new apiresponse (200, deletecom, "deleted "))
})
        export{
            getVideoComments,
            addcomment,
            update,
            deletecomment
        }



