import {
  Body,
  Get,
  HttpCode,
  JsonController,
  Post,
  QueryParams,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { AuthService } from "../services";
import { OpenAPI } from "routing-controllers-openapi";
import { CreateLocalUserDto, LoginUserDto } from "../dtos/UserDto";
import { Response } from "express";
import { generateAccessToken, generateToken } from "../utils/jwToken";
import { checkAccessToken, checkRefreshToken, extractAccessToken } from "../middlewares/AuthMiddleware";
import { CheckDto, EmailVerifyDto, SocialDto } from "../dtos/AuthDto";
import { SocialLoginType } from "../common";

@JsonController("/auth")
@Service()
export class AuthController {
  
}
