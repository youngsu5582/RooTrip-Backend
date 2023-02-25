import {Service} from 'typedi';
import {Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParam, Req, Res, Session, SessionParam, UseBefore} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { PostService } from '../services';
import { CreatePostDto, UpdatePostDto } from '../dtos/PostDto';
import { Request, Response } from 'express';
import { checkLogin } from '../middlewares/AuthMiddleware';


@JsonController('/post')
@Service()
export class PostController{
    constructor(private postService :PostService){};
    
    
    @HttpCode(200)
    @Get("/:postId")
    @OpenAPI({
        description:'해당 게시글을 조회합니다'
    })
    public async getOne(@Param('postId')postId:string){
        const result = await this.postService.getPostById(postId);
        return result;   
    }
    @HttpCode(200)
    @Post()
    @OpenAPI({
        description : '게시글을 생성합니다'
    })
    public async create(@Body() createPostDto:CreatePostDto){
        console.log('post');
        const result = await this.postService.createPost(createPostDto,'550e8400-e29b-41d4-a716-446655440000');
        
        return result;
    }
    @HttpCode(200)
    @Patch("/:postId")
    @OpenAPI({
        description:'게시글 수정합니다',
        
    })  
    @UseBefore(checkLogin)
    public async update(@SessionParam('userId')userId:string,@Param('postId')postId:string,@Body() updatePostDto:UpdatePostDto,@Res() res:Response){
        if(await this.postService.checkUser(userId,postId)){
            const result = await this.postService.updatePost(postId,updatePostDto);
            // 수정못할시도 구현해야함.
            return result;
        }
        else{
            res.status(401).send({
                status:'nok',
                message:'로그인 유저와 게시글 작성자가 일치하지 않습니다.'
            })
        }
    }

    @HttpCode(200)
    @Delete("/:postId")
    @OpenAPI({
        description:'게시글을 삭제합니다'
    })
    @UseBefore(checkLogin)
    public async delete(@SessionParam('userId')userId : string,@Param('postId')postId:string,@Res() res:Response){
        if(await this.postService.checkUser(userId,postId)){
        const result = await this.postService.deletePost(postId);
        // 삭제못할시도 구현해야함.
        return {
            status:'ok',
            message:'삭제 성공했습니다.'
        }
        }
        else{
            res.status(401).send({
                status:'nok',
                message:'로그인 유저와 게시글 작성자가 일치하지 않습니다.'
            })
        }
    }

}