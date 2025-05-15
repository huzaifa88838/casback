import mongoose from "mongoose";
import { Schema } from "mongoose";

const tweetchema = new mongoose.Schema(
    {
        content:{
            type: String,
            required: true
        },
        owner: {
type: Schema.Types.ObjectId,
ref: "user"
        }
    }
)

export const tweet = mongoose.model("tweet",tweetchema)