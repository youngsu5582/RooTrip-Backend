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
    public async changeNickname(@Req() req:Request, @Body() updateNicknameDto: UpdateNicknameDto) {
        const userId = req.user.jwtPayload.userId;
        const nickname = updateNicknameDto.nickname;
        return await this._mypageService.changeNickname(userId,nickname);
    }
}