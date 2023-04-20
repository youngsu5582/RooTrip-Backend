import { Service } from "typedi";
import {
  HttpCode,
  JsonController,
  Param,
  Post,
  Req,
  UseBefore
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { UserService } from "../services";
import { Request } from "express";
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
    @Req() req: Request
  ) {
    const followerId = req.user.jwtPayload.userId;
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
    @Req() req: Request
  ) {
    const followerId = req.user.jwtPayload.userId;
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
