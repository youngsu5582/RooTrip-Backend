import { Body, HttpCode, JsonController,  Post, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { OpenAPI } from "routing-controllers-openapi";
import {  RouteDto } from "../dtos/RouteDto";
import { RouteService } from "../services/RouteService";
import { createResponseForm } from "../interceptors/Transformer";
import { PhotoService, PostService } from "../services";

@JsonController("/route")
@Service()
@UseBefore(checkAccessToken)
export class RouteController {
    constructor(private readonly _routeService:RouteService,
      private readonly _photoService : PhotoService,
      private readonly _postService : PostService){}
    @HttpCode(201)
    @Post()
    @OpenAPI({
      description: "해당 게시글을 조회합니다"
    })
    public async recommend(@Body()routeDto : RouteDto) {
        const posts = await this._routeService.getPost(routeDto.cities);
        const refinePosts = await Promise.all(posts.map(async (post) => {
          const id = post.id;
          const thumbnailImage = await this._photoService.getThumbnailByPostId(id);
          const commentCount = await this._postService.getCommentCountByPostId(id);
            return {post,...thumbnailImage,commentCount};
        }));
        return createResponseForm(refinePosts);
    }
}