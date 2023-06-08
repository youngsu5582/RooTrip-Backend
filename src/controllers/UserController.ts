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
import { createErrorForm, createResponseForm } from "../interceptors/Transformer";
import typia from "typia";
import { SELECT_FOLLOWING_LIST_FAILED} from "../errors/user-error";
import { isErrorCheck } from "../errors";

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
    const result = await this._userService.followUser(followerId, followingId);

    if(isErrorCheck(result)) {
      return createErrorForm(result);
    }
    return createResponseForm(undefined);
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
    const result = await this._userService.unfollowUser(followingId, followerId);

    if(isErrorCheck(result)) {
      return createErrorForm(result);
    }
    return createResponseForm(undefined);
    }

  @HttpCode(201)
  @Post("/:userId/followlist")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자들의 팔로우 목록을 조회합니다."
  })
  public async followList(@Param("userId") userId: string) {
    try {
      const list = await this._userService.followList(userId);
      return createResponseForm(list);
    }
    catch {
      return createErrorForm(typia.random<SELECT_FOLLOWING_LIST_FAILED>());
    }
  }
}
  