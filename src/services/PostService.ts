import { Service } from "typedi";
import { CreatePostDto, CreateRatingDto, UpdatePostDto} from "../dtos/PostDto";
import { LikeRepository } from "../repositories/LikeRepository";
import { PostRepository } from "../repositories/PostRepository";
import { Post } from "../entities/index";
import { PostRatingRepository } from "../repositories/PostRatingRepository";
import typia from "typia";
import { POST_DELETE_FAILED, RATING_UPLOAD_FAILED } from "../errors/post-error";
import { In, IsNull } from "typeorm";

@Service()
export class PostService {
  constructor(
    private readonly postRepository: typeof PostRepository,
    private readonly likeRepository: typeof LikeRepository,
    private readonly postRatingRepository :typeof PostRatingRepository
  ) {
    this.postRepository = PostRepository;
    this.likeRepository = LikeRepository;
    this.postRatingRepository = PostRatingRepository;
  }

  public async createPost(createPostDto: CreatePostDto, userId: string) {
    return await this.postRepository.save(
      Post.create({ ...createPostDto.article,routes : createPostDto.routes, userId })
    );
  }
  public async getPostById(postId: string) {
    
    return await this.postRepository.getPostById(postId);
  }
  public async updatePost(postId: string, updatePostDto: UpdatePostDto) {
    return await this.postRepository.update(postId, updatePostDto);
  }
  public async checkUser(userId: string, postId: string) {
    return await this.postRepository.checkUserIdByPostId(userId, postId);
  }
  public async deletePost(postId: string) {
    try{
      await this.postRepository.delete(postId);
      return true;
    }
    catch{
      return typia.random<POST_DELETE_FAILED>();
    }
  }
  public async likePost(userId: string, postId: string) {
    if (await this.likeRepository.checkDuplicate(userId, postId)) return false;
    else return await this.likeRepository.save({ userId, postId });
  }
  public async createPostRating(userId : string,createRatingDtos : CreateRatingDto[]){
    try{
      createRatingDtos.forEach((createRatingDto)=>{
        this.postRatingRepository.save({...createRatingDto,userId})});
        return true;
    }
    catch(err){
        return typia.random<RATING_UPLOAD_FAILED>();
    }
  }


  public async refinePost(posts:string[]){
    const recommendPost = await this.postRepository.getRecentPosts();
    
    const refinePost = await this.postRepository.find({
      where:{
        id:In(posts),
        deletedAt:IsNull()
      }
    }).catch(()=>null);
    return [...recommendPost,...(refinePost||[])];
  }

}
