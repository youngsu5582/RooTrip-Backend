import { Service } from "typedi";
import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Patch,
  Post,
  Req,
  UseBefore
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { PostService, GeoService, PhotoService } from "../services";
import {  CreatePostDto, CreateRatingDto, UpdatePostDto} from "../dtos/PostDto";
import { Request } from "express";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import typia from "typia";
import { ALREADY_EXISTED_LIKE, NOT_EXISTED_LIKE, POST_CREATE_FAILED, POST_GET_FAILED, POST_NOT_MATCH_USER, POST_UPDATE_FAILED } from "../errors/post-error";
import { createErrorForm, createResponseForm } from "../interceptors/Transformer";
import { isErrorCheck } from "../errors";
import {env} from '../loaders/env';

@JsonController("/post")
@Service()
export class PostController {
  private readonly s3URL = env.s3.bucketUrl;
  constructor(
    private readonly _postService: PostService,
    private readonly _geoService: GeoService,
    private readonly _photoService: PhotoService,
  ) {
  }
  @HttpCode(200)
  @Get("/:postId")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "해당 게시글을 조회합니다"
  })
  public async getOne(@Param("postId") postId: string,@Req() req:Request) {
    
    const userId = req.user.jwtPayload.userId;
    try{

      /**
       * 2023.05.28 Redis 의 pfAdd & pfCount 를 사용할 시 , 중복 Check를 할 필요가 없는거 같아 주석.
       */
      await this._postService.abacus(postId,userId);
      const postViews = await this._postService.getPostViews(postId);
      const post = await this._postService.getPostById(postId);
      const commentCount = await this._postService.getCommentCountByPostId(postId);
      const isLiked = await this._postService.checkUserLikePost(postId,userId);
      post.user = {
        id : post.user.id,
        name : post.user.nickname?post.user.nickname:post.user.name,
        profileImage : post.user.profileImage,
      }  as any;
      return createResponseForm({...{postViews,post,commentCount,isLiked}});
    }
    catch{
      return createErrorForm(typia.random<POST_GET_FAILED>());
    }
  }
  @HttpCode(200)
  @Post()
  @OpenAPI({
    description: "게시글을 생성합니다"
  })
  @UseBefore(checkAccessToken)
  public async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request
  ) {
    const userId = req.user.jwtPayload.userId;
      try{
        const createPhotoDto = await Promise.all(
          createPostDto.newPhotos.map(async (photo) => {
            return {
              image_url: `${this.s3URL}/${photo.fileName}`,
              ...(await this._geoService.getAddress({latitude : photo.latitude,longitude : photo.longitude})),
            };
          })
        );
        const post = await this._postService.createPost(createPostDto, userId);
        await this._photoService.createPhotos(createPhotoDto, post.id);
        return createResponseForm(undefined,"게시글 작성 완료");
      }
      catch{
        return typia.random<POST_CREATE_FAILED>();
      }
  }
  @HttpCode(200)
  @Patch("/:postId")
  @OpenAPI({
    description: "게시글 수정합니다"
  })
  @UseBefore(checkAccessToken)
  public async update(
    @Param("postId") postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    const userId = req.user.jwtPayload.userId;
    
    if (await this._postService.checkUser(userId, postId)) {
      try{
        await this._postService.updatePost(postId, updatePostDto);
        return createResponseForm(undefined);
      }
      catch{
        return typia.random<POST_UPDATE_FAILED>();
      }
    } else {
      return typia.random<POST_NOT_MATCH_USER>();
    }
  }

  @HttpCode(200)
  @Delete("/:postId")
  @OpenAPI({
    description: "게시글을 삭제합니다"
  })
  @UseBefore(checkAccessToken)
  public async delete(
    @Param("postId") postId: string,
    @Req() req: Request
  ) {
    const userId = req.user.jwtPayload.userId;
    
    if (await this._postService.checkUser(userId, postId)) {
      const result = this._postService.deletePost(postId);
      if(isErrorCheck(result))
        return result;
      return createResponseForm(undefined);
    } else {
      return typia.random<POST_NOT_MATCH_USER>();
    }
  }
  @HttpCode(200)
  @Post("/:postId/like")
  @OpenAPI({
    description: "게시글을 추천합니다"
  })
  @UseBefore(checkAccessToken)
  public async like(
    @Param("postId") postId: string,
    @Req() req: Request
  ) {
    const userId = req.user.jwtPayload.userId;
    const result = await this._postService.likePost(userId, postId);
    if (result) {
      return createResponseForm(undefined);
    } else {
        return typia.random<ALREADY_EXISTED_LIKE>();
    }
  }


  /***
   * 2023.06.03 Like 와 isLike 합쳐서 코드 짜는 방안으로 수정 계획 중 (미정)
   */
  @HttpCode(201)
  @Post("/:postId/unLike")
  @OpenAPI({
    description: "게시글 추천을 취소합니다"
  })
  @UseBefore(checkAccessToken)
  public async unLike(
    @Param("postId") postId: string,
    @Req() req: Request
  ) {
    const userId = req.user.jwtPayload.userId;
    const result = await this._postService.unLikePost(userId, postId);
    if (result) {
      return createResponseForm(undefined);
    } else {
        return typia.random<NOT_EXISTED_LIKE>();
    }
  }

  @HttpCode(201)
  @Post("/interaction")
  @OpenAPI({
    summary:"유저-게시글 상호작용 반영",
    description : "사용자 기반 머신러닝 추천 위한 유저-게시글 간 상호작용을 저장합니다.",
  })
  @UseBefore(checkAccessToken)
  public async interaction(@Body() createRatingDtos : CreateRatingDto[],@Req() req : Request){
    const userId = req.user.jwtPayload.userId;
    const result = await this._postService.createPostRating(userId,createRatingDtos);
    if(isErrorCheck(result))
      return result;
    return createResponseForm(undefined);
  }
  @Get("")
  @HttpCode(200)
  @OpenAPI({
    description:"사용자의 아이디를 받아 사용자 기반 게시글을 전달합니다."
  })
  @UseBefore(checkAccessToken)
  public async getMany  ( ){
    const posts = await this._postService.getRecoomendPost();
    
    const refinePosts = await Promise.all(posts.map(async (post) => {
      const id = post.id;
      const thumbnailImage = await this._photoService.getThumbnailByPostId(id);
        return {postId : id,...thumbnailImage};
    }));
    return createResponseForm(refinePosts);
  }

  
}
