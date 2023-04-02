import {Service} from 'typedi';
import {HttpCode, JsonController, Param,Post, Get, Res, UseBefore, Params, Body, QueryParam, BodyParam} from 'routing-controllers';
import {OpenAPI} from 'routing-controllers-openapi';
import {UserService} from '../services';
import {Response} from 'express';
import {checkAccessToken} from '../middlewares/AuthMiddleware';

@JsonController('/user')
@Service()
export class UserController{

    constructor(private readonly _userService :UserService){};
    @HttpCode(201)
    @Post("/follow")
    // @UseBefore(checkAccessToken)
    @OpenAPI({
        description:'사용자 팔로우를 합니다.'
    })
    public async follow(@BodyParam('followerId') followerId:string, @BodyParam("followingId") followingId:string) {
        return this._userService.followUser(followerId, followingId);
    }

    @HttpCode(201)
    @Post("/unfollow")
    // @UseBefore(checkAccessToken)
    @OpenAPI({
        description:'사용자 언팔로우를 합니다.'
    })
    public async unfollow(@BodyParam("followingId") followingId:string, @BodyParam('followerId') followerId:string){
        return this._userService.unfollowUser(followerId, followingId);
    }
}