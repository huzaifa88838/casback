import mongoose, { Types } from "mongoose";

import { Schema } from "mongoose";
const subscribtionschema = new mongoose.Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"

    },

    channel: {
type: Schema.Types.ObjectId,
ref: "User"
    }

},
{timestamps:true}
)

export const subscribtion = mongoose.model("subscribtion",subscribtionschema)