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
  Res,
  UseBefore
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { PostService, GeoService, PhotoService } from "../services";
import { CreatePostDto, CreateRatingDto, UpdatePostDto } from "../dtos/PostDto";
import { Request, Response } from "express";
import { checkAccessToken } from "../middlewares/AuthMiddleware";

@JsonController("/post")
@Service()
export class PostController {
  constructor(
    private readonly _postService: PostService,
    private readonly _geoService: GeoService,
    private readonly _photoService: PhotoService
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
    const photos = await Promise.all(
      createPostDto.newPhotos.map(async (photo) => {
        return {
          image_url: photo.image_url,
          ...(await this._geoService.getAddress({latitude : photo.latitude,longitude : photo.longitude})),
        };
      })
    );

    const post = await this._postService.createPost(createPostDto, userId);
    return await this._photoService.createPhotos(photos, post.id);
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
    @Res() res: Response
  ) {
    const userId = req.user.jwtPayload.userId;

    if (await this._postService.checkUser(userId, postId)) {
      const result = await this._postService.updatePost(postId, updatePostDto);
      // 수정못할시도 구현해야함.
      return result;
    } else {
      res.status(401).send({
        status: "nok",
        message: "로그인 유저와 게시글 작성자가 일치하지 않습니다."
      });
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
    @Res() res: Response,
    @Req() req: Request
  ) {
    const userId = req.user.jwtPayload.userId;
    if (await this._postService.checkUser(userId, postId)) {
      const result = await this._postService.deletePost(postId);
      if (result) {
        return {
          status: "ok",
          message: "삭제 성공했습니다."
        };
      } else {
        return {
          status: "nok",
          message: "삭제 실패했습니다."
        };
      }
    } else {
      res.status(401).send({
        status: "nok",
        message: "로그인 유저와 게시글 작성자가 일치하지 않습니다."
      });
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
    @Res() res: Response,
    @Req() req: Request
  ) {
    const userId = req.user.jwtPayload.userId;
    const result = await this._postService.likePost(userId, postId);
    if (result) {
      return {
        status: true,
        message: "게시글 추천을 완료했습니다."
      };
    } else {
      return {
        status: false,
        message: "추천 중복입니다!"
      };
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
    await this._postService.createPostRating(userId,createRatingDtos);
    return true;
  }
}
