import {
    Body,
    Get,
    HttpCode,
    JsonController,
    Post,
    Req,
    UseBefore
  } from "routing-controllers";
  import { Service } from "typedi";
  import { OpenAPI } from "routing-controllers-openapi";
  import { UpdateNicknameDto } from "../dtos/UserDto";
  import { Request, Response } from "express";
  import {
    checkAccessToken
  } from "../middlewares/AuthMiddleware";
import { MypageService } from "../services/MypageService";
@JsonController("/mypage")
@Service()

export class MypageController {
    constructor(private readonly _mypageService: MypageService) {}
    @HttpCode(201)
    @Post("/account/edit/nickname")
    @UseBefore(checkAccessToken)
    @OpenAPI({
      description: "사용자의 닉네임을 변경합니다."
    })
    public async changeNickname(@Req() req:Request, @Body() updateNicknameDto: UpdateNicknameDto) {
        const userId = req.user.jwtPayload.userId;
        const nickname = updateNicknameDto.nickname;
        return await this._mypageService.changeNickname(userId,nickname);
    }

    @HttpCode(201)
    @Post("/account/personal_info/withdrawal")
    @UseBefore(checkAccessToken)
    @OpenAPI({
      description: "회원탈퇴를 합니다."
    })
    public async deleteUser(@Req() req:Request) {
      const userId = req.user.jwtPayload.userId;
      return await this._mypageService.deleteUser(userId);
    }

}