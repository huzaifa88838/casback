import mongoose from "mongoose";
import { Schema } from "mongoose";

const playlistschema = new mongoose.Schema(

    {
        name:{
            type: String,
            required: true
        },
        description:{
            type:String,
            required: true
        },
        videos:[
            {
                type: Schema.Types.ObjectId,
                ref:"video"
            }
        ],
        owner:{
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    }
)

export const play = ("play",playlistschema)