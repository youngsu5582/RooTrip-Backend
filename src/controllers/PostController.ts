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
  QueryParams,
  Req,
  UseBefore
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { PostService, GeoService, PhotoService, UserService } from "../services";
import {   CreatePostDto,    UpdatePostDto, ViewType} from "../dtos/PostDto";
import { Request } from "express";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import typia from "typia";
import {  NOT_EXISTED_LIKE, POST_CREATE_FAILED, POST_GET_FAILED, POST_NOT_MATCH_USER, POST_UPDATE_FAILED, SAVE_POST_FAILED } from "../errors/post-error";
import { createErrorForm, createResponseForm } from "../interceptors/Transformer";
import { isErrorCheck } from "../errors";
import {env} from '../loaders/env';
import { ALREADY_EXISTED_LIKE } from "../errors/common-error";

@JsonController("/post")
@Service()
@UseBefore(checkAccessToken)
export class PostController {
  private readonly s3URL = env.s3.bucketUrl;
  constructor(
    private readonly _postService: PostService,
    private readonly _geoService: GeoService,
    private readonly _photoService: PhotoService,
    private readonly _userService:UserService,
  ) {
  }
  @HttpCode(200)
  @Get("/:postId")
  
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
      const photos = await this._photoService.getPhotosByPostId(post.id);
      const profile = await this._userService.getProfile(post.userId);
      /**
       * 2023.06.06 Redis 로 수정해야함.
       */
      const commentCount = await this._postService.getCommentCountByPostId(postId);
      const isLiked = await this._postService.checkUserLikePost(postId,userId);
      post.user = {
        id : post.userId,
        name : profile.nickname?profile.nickname:profile.name,
        profile : profile.profileImage
      }  as any;
      return createResponseForm({...{postViews,post,photos,commentCount,isLiked}});
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
        const photos = await this._photoService.createPhotos(createPhotoDto, post.id);
        const thumbnailImage = {
          id:photos[0].id,
          coordinate:photos[0].coordinate,
          imageUrl:photos[0].imageUrl,
        }
        return createResponseForm({postId:post.id,...thumbnailImage},"게시글 작성 완료");
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
  @Post("/:postId/save")
  @OpenAPI({
    description: "게시글을 저장합니다"
  })
  public async savePost(
    @Param("postId") postId: string,
    @Req() req: Request
  ) {
    try {
      const userId = req.user.jwtPayload.userId;
      await this._postService.savePost(userId, postId);
      return createResponseForm(undefined);
    }
    catch {
      createErrorForm(typia.random<SAVE_POST_FAILED>());
    }
  }

  @Get("")
  @HttpCode(200)
  @OpenAPI({
    description:"사용자의 아이디를 받아 사용자 기반 게시글을 전달합니다.",
    parameters: [
      {
        name: 'viewType',
        in: 'query',
        required: true,
        schema: {
          type: 'string',
          enum: ['region', 'city'],
        },
      },
      {
        name: 'polygon',
        in: 'query',
        required: false,
        schema: {
          type: 'string',
        },
      },
      {
        name:'markerCount',
        in:'query',
        required:false,
        schema:{
          type:'number'
        }
      }
    ],
  })
  public async getMany(@QueryParams() getPostsDto : ViewType){
//const posts = await this._postService.getRecoomendPost();
    // 2023.06.09 한 경로가 4곳을 이동 했을 거 와 같은 경우 우연히 겹치는 경우 생각해야함.
    try{
      
    const postIds = await this._photoService.getPostIdByType(getPostsDto);
    const refinePosts = await Promise.all(postIds.map(async (postId) => {
      
      const thumbnailImage = await this._photoService.getThumbnailByPostId(postId);
        return {postId,...thumbnailImage};
    }));
    return createResponseForm(refinePosts);
    }
    catch{
      return;
    }
  }

  /*
  게시글 공개 여부
  전체 공개: public
  친구 공개: friends
  나만 보기: private
  */
  // @Get("/")
  // @HttpCode(201)
  // @OpenAPI({
  //   description:"게시글 공개범위 설정 테스트용"
  // })
  // public async getMany (@Req() req:Request, @QueryParam("visibility") visibility?: "public" | "friend" | "private"){
  //   const userId = req.user.jwtPayload.userId;
  //   const posts = await this._postService.getPosts(userId, visibility);
  //   const refinePosts = await Promise.all(posts.map(async (post) => {
  //     const id = post.id;
  //     const thumbnailImage = await this._photoService.getThumbnailByPostId(id);
  //       return {postId : id,...thumbnailImage};
  //   }));
  //   return createResponseForm(refinePosts);
  // }

}
