import {
    Body,
    HttpCode,
    JsonController,
    Post,
    Req,
    UseBefore
  } from "routing-controllers";
  import { Service } from "typedi";
  import { OpenAPI } from "routing-controllers-openapi";
  import { UpdateNicknameDto, UpdateGenderDto, UpdatePasswordDto } from "../dtos/UserDto";
  import { Request } from "express";
  import {
    checkAccessToken
  } from "../middlewares/AuthMiddleware";
import { MypageService } from "../services/MypageService";
import { ProfileDto } from "../dtos/ProfileDto";
import { createErrorForm, createResponseForm } from "../interceptors/Transformer";
import {CHANGE_PASSWORD_FAILED, GENDER_CHANGE_FAILED, GET_PROFILE_FAILED, LIKED_POST_GET_FAILED, NICKNAME_CHANGE_FAILED, PROFILE_IMAGE_UPLOAD_FAILED, SAVED_POST_GET_FAILED, UPLOAD_POST_GET_FAILED, WITHDRAWL_FAILED} from "../errors/mypage-error"
import typia from "typia";
@JsonController("/mypage")
@Service()
export class MypageController {
  constructor(private readonly _mypageService: MypageService) {}

  @HttpCode(201)
  @Post("/account/profile")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자의 프로필을 조회합니다."
  })
  public async getProfile(@Req() req: Request) {
    try {
      const userId = req.user.jwtPayload.userId;
      const profile = await this._mypageService.getProfile(userId)
      return createResponseForm(profile);
    }
    catch{
      return createErrorForm(typia.random<GET_PROFILE_FAILED>());
    }
  }

  @HttpCode(201)
  @Post("/account/edit/profile")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자의 프로필을 변경합니다."
  })
  public async uploadProfileImage(
    @Req() req: Request,
    @Body() profileDto: ProfileDto
  ) {
    try {
      const userId = req.user.jwtPayload.userId;
      const profile = await this._mypageService.uploadProfileImage(userId, profileDto);
      return createResponseForm(profile);
    }
    catch{
      return createErrorForm(typia.random<PROFILE_IMAGE_UPLOAD_FAILED>());
    }
  }
  

  @HttpCode(201)
  @Post("/account/edit/nickname")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자의 닉네임을 변경합니다."
  })
  public async changeNickname(
    @Req() req: Request,
    @Body() updateNicknameDto: UpdateNicknameDto
  ) {
    try {
      const userId = req.user.jwtPayload.userId;
      const nickname = updateNicknameDto.nickname;
      await this._mypageService.changeNickname(userId, nickname);
      return createResponseForm(undefined);
    }
    catch {
      return createErrorForm(typia.random<NICKNAME_CHANGE_FAILED>());
    }
  }

  @HttpCode(201)
  @Post("/account/edit/gender")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자의 성별을 수정합니다."
  })
  public async changeGender(
    @Req() req: Request,
    @Body() updateGenderDto: UpdateGenderDto
  ) {
    try {
      const userId = req.user.jwtPayload.userId;
      const gender = updateGenderDto.gender;
      await this._mypageService.changeGender(userId, gender);
      return createResponseForm(undefined);
    }
    catch {
      return createErrorForm(typia.random<GENDER_CHANGE_FAILED>());
    }
  }

  @HttpCode(201)
  @Post("/activity/likes")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자가 추천한 게시글들을 보여줍니다."
  })
  public async likedPostList(@Req() req: Request) {
    try {
      const userId = req.user.jwtPayload.userId;
      const likedPost = await this._mypageService.likedPostList(userId);
      return createResponseForm(likedPost);
    }
    catch {
      return createErrorForm(typia.random<LIKED_POST_GET_FAILED>());
    }
  }

  @HttpCode(201)
  @Post("/activity/saved/trip-posts")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자가 저장한 게시글들을 보여줍니다."
  })
  public async savedTripList(@Req() req: Request) {
    try {
      const userId = req.user.jwtPayload.userId;
      const savedPost = await this._mypageService.savedTripList(userId);
      return createResponseForm(savedPost);
    }
    catch {
      createErrorForm(typia.random<SAVED_POST_GET_FAILED>())
    }
  }

  @HttpCode(201)
  @Post("/activity/upload-post")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자가 작성한 게시글들을 보여줍니다."
  })
  public async uploadPostList(@Req() req: Request) {
    try {
      const userId = req.user.jwtPayload.userId;
      const uploadPost = await this._mypageService.uploadPostList(userId);
      return createResponseForm(uploadPost);
    }
    catch {
      return createErrorForm(typia.random<UPLOAD_POST_GET_FAILED>());
    }
  }

  @HttpCode(201)
  @Post("/account/personal-info/change-password")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "사용자의 비밀번호를 수정합니다."
  })
  public async changePassword(
    @Req() req: Request,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    try {
      const userId = req.user.jwtPayload.userId;
      const password = updatePasswordDto.password;
      await this._mypageService.changePassword(userId, password);
      return createResponseForm(undefined);
    }
    catch {
      return createErrorForm(typia.random<CHANGE_PASSWORD_FAILED>());
    }
  }

  @HttpCode(201)
  @Post("/account/personal-info/withdrawal")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "회원탈퇴를 합니다."
  })
  public async deleteUser(@Req() req: Request) {
    try {
      const userId = req.user.jwtPayload.userId;
      await this._mypageService.deleteUser(userId);
      return createResponseForm(undefined);
    }
    catch {
      return createErrorForm(typia.random<WITHDRAWL_FAILED>());
    }
  }
}