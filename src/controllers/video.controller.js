import mongoose, {isValidObjectId} from "mongoose"
import {video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import { uploadoncloudinary } from "../utils/cloudinary.js"
import { asynchandler } from "../utils/asychandler.utils.js"
// import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { apierror } from "../utils/apierror.utils.js"
import { apiresponse } from "../utils/apiresponse.utils.js"

const toggling = (async(videoid)=>{
const article = await video.findById(videoid)
article.ispublished= !article.ispublished
await article.save()
    

return article
})

const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType = 'asc', userId } = req.query;

const sortoptions = {}
if (sortBy) {
    sortoptions[sortBy] = sortType==="desc"?-1:1

}

const searchoption = {}
if (query) {
    searchoption.$or[{title: {$regex: query, $options: 'i'}},
    {description: {$regex: query, $options: 'i'}}
    

]

}
if (userId) {
    searchoption.user = userId
}

const Video = await video.find(searchoption)
.sort(sortoptions)

.limit(limit)
.skip((page-1)*limit)
return res.status(200).json(
   new apiresponse(200, video,"videos get", {
    currentpage:page,
    numberofpages: Math.ceil(await video.countDocuments(searchoption)/limit)
   })
)





}


)
const uploadvideo = asynchandler(async(req,res)=>{
    const{title,description} = req.body
    if (!title && !description) {
        throw new apierror(409,"all fields are required")
    }
    const uploadvideo = req.files?.videofile[0].path
    console.log("uploadvideo",uploadvideo)
    const thumbnail = req.files?.thumbnail[0].path
    
    
    
    const upthumb = await uploadoncloudinary(thumbnail)

    const uploading = await uploadoncloudinary(uploadvideo)
    const owner = await User.findById(req.user._id)
    
    const duration = uploading.duration
    
    if (!uploading) {
        throw new apierror(409, "something went wrong")
    }
    const upload = await video.create({
         videofile: uploading.url,
         thumbnail: upthumb.url,
         title,
         description,
         duration,
         owner
         
         

    }
    )
    

    return res.status(200).json(
        new apiresponse(200, upload,"video uploaded")
    )

})

const getVideoById = asynchandler(async (req, res) => {
    
    const userid = req.user._id

    if (!userid) {
        throw new apierror(400,"not found video")
    }

    
    
        const showvideo = await video.find({owner:userid})

        if (!showvideo) {
            throw new apierror(440,"video not found")
        }
    
    
        return res.status(200
        ).json(new apiresponse(200, showvideo, "videofound"))



    
})

const updatevideo = asynchandler(async(req,res)=>{
const {title,description} = req.body
const videoid = req.user._id
const owner = {owner: videoid}
if (!videoid) {
    throw new apierror(400,"video not found")
}
const update = await video.updateOne(owner,{
    $set:{
title: title,
description: description
    }
},
{
new : true
}
)

if (!update) {
    throw new apierror(400,"video not updated")
}
return res.status(200).json(new apiresponse(200,update, "video updatecd"))
})

const deletevideo = asynchandler(async(req,res)=>{
    const videoid = req.user._id
    const owner = {owner: videoid}

    const deletes = await video.deleteOne(owner)
    if (!deletes) {
        throw new apierror(400,"something went wrong")
    }

    return res.status(200).json(new apiresponse(200,{},"deleted"))
})
const togglepublishstatus = asynchandler(async(req,res)=>{
    const {videoid} = req.params
    // const owner = {owner: videoid}
const {article} = await toggling(videoid)



return res.status(200).json(new apiresponse(200,article, "video published"))
})
  
export{
    getAllVideos,
    uploadvideo,
    getVideoById,
    updatevideo,
    deletevideo,
    togglepublishstatus
}