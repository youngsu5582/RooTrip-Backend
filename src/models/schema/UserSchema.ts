import mongoose, {Schema, Types } from "mongoose";

interface Userinterface{
  email : string;
  password : string;
}
const userSchema = new Schema<Userinterface>({
  email:{type:String},
  password:{type:String},
})

export default mongoose.model('User', userSchema);