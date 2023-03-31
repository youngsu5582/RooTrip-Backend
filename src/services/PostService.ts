import {Service} from "typedi";
import { CreatePostDto, UpdatePostDto } from "../dtos/PostDto";
import { LikeRepository } from "../repositories/LikeRepository";
import {PostRepository} from "../repositories/PostRepository";

@Service()
export class PostService{
    constructor(private readonly postRepository : typeof PostRepository ,
            private readonly likeRepository : typeof LikeRepository
        )
         {
            this.postRepository = PostRepository;
            this.likeRepository = LikeRepository;
         }

    public async createPost(createPostDto:CreatePostDto,userId:string){
        
       const post = createPostDto.toEntity(userId);
        return await this.postRepository.save(post);
    }
    public async getPostById(postId : string){
        return await this.postRepository.getPostById(postId);
    }
    public async updatePost(postId:string,updatePostDto:UpdatePostDto){
        return await this.postRepository.update(postId,updatePostDto);
    }
    public async checkUser(userId:string,postId:string){
        return await this.postRepository.checkUserIdByPostId(userId,postId);
    }
    public async deletePost(postId:string){
        return await this.postRepository.delete(postId);
    }
    public async likePost(userId:string,postId:string){ 
        if(await this.likeRepository.checkDuplicate(userId,postId))
            return false;
        else
            return await this.likeRepository.save({userId,postId});
    }

}