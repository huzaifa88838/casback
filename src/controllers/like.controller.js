import mongoose from "mongoose";
import { like } from "../models/like.model.js";
import { apierror } from "../utils/apierror.utils.js";
import { apiresponse } from "../utils/apiresponse.utils.js";
import { asynchandler } from "../utils/asychandler.utils.js";
// import { video } from "../models/video.model.js";

const toggleVideoLike = asynchandler(async (req, res) => {
    const { liked } = req.body; // Destructure 'liked' from the request body

    // Convert the video ID from the request parameters to a MongoDB ObjectId
    const videoId = new mongoose.Types.ObjectId(req.params._id);
    console.log(videoId)
    // const likedVideo = await like.findOne({video: videoId}  );
    // console.log("liked",likedVideo)

    // // If no video is found, return an error response
    // if (!likedVideo) {
    //    throw new apierror(400,"video not found")
    // }

    // Update the 'liked' status of the video
    await like.updateOne(
        { _id: videoId },
        { $set: { liked: liked } } // Use $set to update the 'liked' field
    );

    // Return a success response
    return res.status(200).json(new apiresponse(200, "Video liked successfully", null));
});
const likeoncomment = asynchandler(async(req,res)=>{
    const {likeco} = req.body
    if (!likeco) {
        throw new apierror(400,"req")
    }
    const comment = new mongoose.Types.ObjectId(req.params._id)

    await like.updateOne(
        { _id: comment },
        { $set: { likeco: likeco } } // Use $set to update the 'liked' field
    );
    return res.status(200).json(new apiresponse(200, "Video liked successfully okay this fv", null));
})
export{
    toggleVideoLike,
    likeoncomment
}