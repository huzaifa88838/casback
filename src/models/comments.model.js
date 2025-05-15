import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Schema } from "mongoose";
const commentschema = new mongoose.Schema(

    {
content:{
    type: String,
    required:true
},
video:{
type: Schema.Types.ObjectId,
ref:"video"
},
owner:{
    type: Schema.Types.ObjectId,
    ref:"user"
},


    },
    {timestamps:true}
)

commentschema.plugin(mongooseAggregatePaginate)
export const comment = mongoose.model("comment",commentschema)