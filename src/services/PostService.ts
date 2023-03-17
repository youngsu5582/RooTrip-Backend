import {Service } from "typedi";
import { CreatePostDto, UpdatePostDto } from "../dtos/PostDto";
import {PostRepository} from "../repositories/PostRepository";


@Service()

export class PostService{
    
    private postRepository:typeof PostRepository
    constructor(
        
         ){
            this.postRepository = PostRepository;
         }
    /**
     * 테스트를 위한 Function
     * 
     */
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
}