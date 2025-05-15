import mongoose from "mongoose";
import { Schema } from "mongoose";

const likeschema = new mongoose.Schema(

    {

        video:{
            type: Schema.Types.ObjectId,
            ref:"video"
            },
            comment:{
                type: Schema.Types.ObjectId,
                ref:"comment"
                },
                tweet:{
                    type: Schema.Types.ObjectId,
                    ref:"tweet"
                    },
                    likeby:{
                        type: Schema.Types.ObjectId,
                        ref:"user"
                        },
    },
    {timestamps:true}
)

export const like = mongoose.model("like",likeschema)