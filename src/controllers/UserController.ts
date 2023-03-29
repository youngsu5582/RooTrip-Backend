import {Service} from 'typedi';
import {HttpCode, JsonController, Param,Post, Res, UseBefore} from 'routing-controllers';
import {OpenAPI} from 'routing-controllers-openapi';
import {UserService} from '../services';
import {Response} from 'express';
import {checkAccessToken} from '../middlewares/AuthMiddleware';

@JsonController('/user')
@Service()
export class UserController{

    constructor(private readonly _userService :UserService){};
    @HttpCode(201)
    @Post("/:userId/follow")
    @UseBefore(checkAccessToken)
    @OpenAPI({
        description:'사용자 팔로우를 합니다.'
    })
    public async follow(@Param('userId')userId:string,@Res()res :Response){
        console.log(userId);
        const followingId = res.locals.jwtPayload.userId;
        const result = await this._userService.followUser(userId,followingId);
        return result;
    }
    @HttpCode(201)
    @Post("/:userId/unfollow")
    @UseBefore(checkAccessToken)
    @OpenAPI({
        description:'사용자 언팔로우를 합니다.'
    })
    public async unfollow(@Param('userId')userId:string,@Res()res :Response){
        console.log(userId);
        const followingId = res.locals.jwtPayload.userId;
        const result = await this._userService.unfollowUser(userId,followingId);
        return result;
    }
}