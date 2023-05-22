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
import { PostService, GeoService, PhotoService, MachineService, CommentService } from "../services";
import { CreateCommentDto, CreatePostDto, CreateRatingDto, UpdatePostDto} from "../dtos/PostDto";
import { Request } from "express";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import typia from "typia";
import { ALREADY_EXISTED_COMMENT, POST_CREATE_FAILED, POST_NOT_MATCH_USER, POST_UPDATE_FAILED } from "../errors/post-error";
import { createResponseForm } from "../interceptors/Transformer";
import { isErrorCheck } from "../errors";

@JsonController("/post")
@Service()
export class PostController {
  constructor(
    private readonly _postService: PostService,
    private readonly _geoService: GeoService,
    private readonly _photoService: PhotoService,
    private readonly _machineService : MachineService,
    private readonly _commentService : CommentService,
  ) {}
  @HttpCode(200)
  @Get("/:postId")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "해당 게시글을 조회합니다"
  })
  public async getOne(@Param("postId") postId: string) {
    
    const result = await this._postService.getPostById(postId);
    return result;
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
        
        const photos = await Promise.all(
          createPostDto.newPhotos.map(async (photo) => {
            return {
              image_url: photo.image_url,
              ...(await this._geoService.getAddress({latitude : photo.latitude,longitude : photo.longitude})),
            };
          })
        );
        const post = await this._postService.createPost(createPostDto, userId);
        await this._photoService.createPhotos(photos, post.id);
        return createResponseForm(undefined);
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
      createResponseForm(undefined);
    } else {
        return typia.random<ALREADY_EXISTED_COMMENT>();
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
  public async getMany(@Req() req : Request){
    const userId = req.user.jwtPayload.userId;
    const posts = await this._machineService.getPostsByUserId(userId);
    
    const refined_posts = await this._postService.refinePost(posts);
    return refined_posts;
  }
  
  @HttpCode(201)
  @Post("/:postId/comment")
  @UseBefore(checkAccessToken)
  public async createCommnet(@Param("postId") postId: string,@Body() createCommentDto : CreateCommentDto,@Req() req:Request){
      const userId = req.user.jwtPayload.userId;
      await this._commentService.create(createCommentDto,postId,userId);
  }
}
