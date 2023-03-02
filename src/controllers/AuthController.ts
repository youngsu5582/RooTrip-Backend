import {Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParam, Req, Res, Session, SessionParam, UseBefore} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthService } from '../services';


@JsonController('/auth')
@Service()
export class AuthController{
    constructor(private authService:AuthService){};
    
}