import { Service } from "typedi";

import { CreatePostDto, UpdatePostDto } from "../dtos/PostDto";
import {  Repository,EntityRepository} from 'typeorm';
import { Post } from "../entities";
import DataSource from '../loaders/database';
import { InjectRepository } from "typeorm-typedi-extensions";
import database from "../loaders/database";

export const PostRepository =  database.getRepository(Post).extend({
    async getPostById(postId:string){
        return await this.findOne({where:{id:postId}});
    },
    async checkUserIdByPostId(userId:string,postId:string){
        return Boolean(await this.findOne({where:{id:postId,user:{id:userId}}}));
    }   
})




// export class PostRepostiory extends Repository<Post>{
    
//     public async getPostById(postId:string){
//         return await this.findOne({where:{id:postId}});
//     }

//     // public async update(postId:string,updatePostDto:UpdatePostDto){
//     //     //return await Post.updateOne({_id:postId},updatePostDto);
//     // }
//     // public async delete(postId:string){
//     //     //return await Post.deleteOne({_id:postId});
//     // }
//     public async checkUserIdByPostId(userId:string,postId:string){
//         return Boolean(await this.findOne({where:{id:postId,user:{id:userId}}}));
//     }   

// }