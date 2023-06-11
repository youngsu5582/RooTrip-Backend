import { Service } from "typedi";
import { CreatePostDto, UpdatePostDto} from "../dtos/PostDto";
import { LikeRepository } from "../repositories/LikeRepository";
import { PostRepository } from "../repositories/PostRepository";
import { Post} from "../entities/index";
import typia from "typia";
import { POST_DELETE_FAILED } from "../errors/post-error";
import { checkPostViews, getPostViews, increasePostViews } from "../utils/Redis";
import { CommentRepository, FollowerRepository, TripRepository } from "../repositories";

@Service()
export class PostService {
  constructor(
    private readonly postRepository: typeof PostRepository,
    private readonly likeRepository: typeof LikeRepository,
    private readonly commentRepository : typeof CommentRepository,
    private readonly tripRepository: typeof TripRepository,
    private readonly followrRepository: typeof FollowerRepository,
  ) {
    this.postRepository = PostRepository;
    this.likeRepository = LikeRepository;
    this.commentRepository = CommentRepository;
    this.tripRepository = TripRepository;
    this.followrRepository = FollowerRepository;
  }

  public async createPost(createPostDto: CreatePostDto, userId: string) {
    
    return await this.postRepository.save(
      Post.create({ ...createPostDto.article,routes : createPostDto.routes, userId })
    );
  }
  public async getPostById(postId: string) {
    return await this.postRepository.getPostById(postId);
  }
  public async getPostsByIds(postIds:string[]){
    return await this.postRepository.getPostsByIds(postIds);
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
    const post = await this.postRepository.getPostById(postId);
    if (await this.likeRepository.checkDuplicate(userId, postId)) return false;
    else {
      try{
        await this.likeRepository.save(this.likeRepository.create({ userId, postId}))
        post.like++;
        await this.postRepository.save(post);
        return true;
      }
      catch{
        return false;
      }
      
    }
  }
  public async unLikePost(userId: string, postId: string) {
    const post = await this.postRepository.getPostById(postId);
    if (!await this.likeRepository.checkDuplicate(userId, postId)) return false;
    else {
      try{
        await this.likeRepository.delete({userId,postId});
        post.like--;
        await this.postRepository.save(post);
        return true;
      }
      catch{
        return false;
      }
      
    }
  }

  async savePost(userId: string, postId: string) {
    return await this.tripRepository.save({userId,postId});
  }

  /**
   * 2023.06.04 Prototype 완성 기한으로 인한 주석
   */
  // public async createPostRating(userId : string,createRatingDtos : CreateRatingDto[]){
  //   try{
  //     createRatingDtos.forEach((createRatingDto)=>{
  //       this.postRatingRepository.save(this.postRatingRepository.create({...createRatingDto,userId}))});
  //       return true;
  //   }
  //   catch(err){
  //       return typia.random<RATING_UPLOAD_FAILED>();
  //   }
  // }

  
  public async getRecoomendPost(){
    return await this.postRepository.getRecentPosts();
  }
  /**
   * 2023.05.28 Prototype 완성 기한으로 인한 주석
   */
  // public async refinePost(posts:string[]){
  //   const recommendPost = await this.postRepository.getRecentPosts();

  //   const refinePost = await this.postRepository.find({
      
  //     where:{
  //       id:In(posts),
  //       deletedAt:IsNull()
  //     }
  //   }).catch(()=>null);
  //   return [...recommendPost,...(refinePost||[])];
  // }
  /**
   * @summary Reddit 의 Nazar Consumer 와 유사한 기능
   * @description postId 와 userId 를 받아서 , 해당 조회가 조회수를 올릴때 유효한지 검증
   * 
   * @param postId 
   * @param userId 
   */
  public async nazar(postId:string,userId:string){
    return await checkPostViews(postId,userId);
  }
  
  /**
   * 
   * @summary Reddit 의 Abacus Consumer 와 유사한 기능
   * @description postId 와 userId를 받아서 , 조회수를 증가시키고 , set 에 userId 저장
   * 
   * @param postId 
   * @param userId 
   * @returns 
   */
  public async abacus(postId:string,userId:string){
    return await increasePostViews(postId,userId);
  }
  public async getPostViews(postId:string){
    const todayCount = await getPostViews(postId);
    const totalCount = (await this.postRepository.getTotalCount(postId)).viewCount;
    return todayCount +totalCount;
    
  }
  public async checkUserLikePost(postId:string,userId:string){
      return Boolean(await this.likeRepository.findOne({where:{postId,userId}}));
  }
  public async getCommentCountByPostId(postId:string){
      return await this.commentRepository.count({where:{postId}});
  }

  public async getPosts(userId:string, visibility?: "public" | "friend" | "private") {
    if(visibility==='public') {
      return await this.postRepository.getPublicPosts(visibility);
    }else if(visibility === 'friend') {
      const followingId = await this.followrRepository.getFollowingUserId(userId);
      return await this.postRepository.getFriendsPosts(followingId, visibility);
    }else {
      return await this.postRepository.getPrivatePosts(userId,visibility);
    }
  }
}