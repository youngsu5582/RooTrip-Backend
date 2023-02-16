import mongoose, {Schema, Types } from "mongoose";
import UserSchema from "./UserSchema";

interface PostInterface{
  title : string;
  content : string;
  userId : Types.ObjectId;
}
const postSchema = new Schema<PostInterface>({
    title:{type:String},
    content:{type:String},
    userId:{type:Schema.Types.ObjectId},
    //,ref:'User'
})

export default mongoose.model('Post', postSchema);