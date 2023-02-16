import { Service } from "typedi";
import { Post } from "../models/schema";
import { CreatePostDto, UpdatePostDto } from "../dtos/PostDto";
@Service()
export class PostRepostiory{
    public async getPostById(postId:string){
        return await Post.findById(postId);
    }
    public async create(createPostDto:CreatePostDto){
        return await Post.create(createPostDto);
    }
    public async update(postId:string,updatePostDto:UpdatePostDto){
        return await Post.updateOne({_id:postId},updatePostDto);
    }
    public async delete(postId:string){
        return await Post.deleteOne({_id:postId});
    }
    public async checkUserIdByPostId(userId:string,postId:string){
        return Boolean(await Post.findOne({userId:userId,_id:postId}));
    }   

}