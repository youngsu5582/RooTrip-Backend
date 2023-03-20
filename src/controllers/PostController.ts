import {Service} from 'typedi';
import {Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, Res, UseBefore} from 'routing-controllers';
import {OpenAPI} from 'routing-controllers-openapi';
import {PostService} from '../services';
import {CreatePostDto, UpdatePostDto} from '../dtos/PostDto';
import {Response} from 'express';
import {checkAccessToken} from '../middlewares/AuthMiddleware';



@JsonController('/post')
@Service()
export class PostController{
     constructor(private postService :PostService){};
    
    
    @HttpCode(200)
    @Get("/:postId")
    @UseBefore(checkAccessToken)
    @OpenAPI({
        description:'해당 게시글을 조회합니다'
    })
    
    public async getOne(@Param('postId')postId:string,@Res() res : Response){
        console.log(res.locals.jwtPayload);
        const result = await this.postService.getPostById(postId);
        return "sibal";   
    }
    @HttpCode(200)
    @Post()
    @OpenAPI({
        description : '게시글을 생성합니다'
    })
    @UseBefore(checkAccessToken)
    public async create(@Body() createPostDto:CreatePostDto,@Res() res:Response){
        const userId = res.locals.jwtPayload.userId;
        const result = await this.postService.createPost(createPostDto,userId);
        
        return result;
    }
    @HttpCode(200)
    @Patch("/:postId")
    @OpenAPI({
        description:'게시글 수정합니다',
        
    })  
    @UseBefore(checkAccessToken)
    public async update(@Param('postId')postId:string,@Body() updatePostDto:UpdatePostDto,@Res() res:Response){
        const userId = res.locals.jwtPayload.userId;
        
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
    @UseBefore(checkAccessToken)
    public async delete(@Param('postId')postId:string,@Res() res:Response){
        const userId = res.locals.jwtPayload.userId;
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