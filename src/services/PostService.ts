import { Service } from "typedi";
import { CreatePostDto, UpdatePostDto } from "../dtos/PostDto";
import { PostRepostiory } from "../repositories";
@Service()
export class PostService{
    constructor(private postRepository : PostRepostiory){}
    /**
     * 테스트를 위한 Function
     * 
     */
    public async createPost(createPostDto:CreatePostDto){
        return await this.postRepository.create(createPostDto);
        
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
}