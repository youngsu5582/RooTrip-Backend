import { Service } from "typedi";
import {
  HttpCode,
  JsonController,
  Param,
  Post,
  Get,
  Res,
  UseBefore,
  Params,
  Body,
  QueryParam,
  BodyParam,
  Req
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { UserService } from "../services";
import { Request, Response } from "express";
import { checkAccessToken } from "../middlewares/AuthMiddleware";

@JsonController("/user")
@Service()
export class UserController {
  constructor(private readonly _userService: UserService) {}
  @HttpCode(201)
  @Post("/:followingId/follow")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자 팔로우를 합니다."
  })
  public async follow(
    @Param("followingId") followingId: string,
    @Res() res: Response
  ) {
    const followerId = res.locals.jwtPayload.userId;
    return this._userService.followUser(followerId, followingId);
  }

  @HttpCode(201)
  @Post("/:followingId/unfollow")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자 언팔로우를 합니다."
  })
  public async unfollow(
    @Param("followingId") followingId: string,
    @Res() res: Response
  ) {
    const followerId = res.locals.jwtPayload.userId;
    return this._userService.unfollowUser(followingId, followerId);
  }

  @HttpCode(201)
  @Post("/:userId/followlist")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자들의 팔로우 목록을 조회합니다."
  })
  public async followList(@Param("userId") userId: string) {
    return this._userService.followList(userId);
  }
}
