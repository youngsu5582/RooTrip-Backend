import  { Service } from "typedi";
import { GoogleUserDto, KakaoUserDto, CreateLocalUserDto, NaverUserDto, LoginUserDto } from "../dtos/UserDto";
import { UserRepository } from "../repositories";
import { CustomJwtPayload, ResponseType, SocialLoginType } from "../common";
import { env } from "../loaders/env";
import axios from "axios";
import { addBlacklist } from "../utils/Redis";
import {encrypt} from '../utils/Crypto';

const key = env.key;

@Service()
export class AuthService{

}