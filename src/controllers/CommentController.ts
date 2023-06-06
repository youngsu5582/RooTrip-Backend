import { Body, BodyParam, Delete, Get, HttpCode, JsonController, Param, Post, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { CommentService } from "../services";
import { createResponseForm } from "../interceptors/Transformer";
import typia from "typia";
import { CreateCommentDto } from "../dtos/PostDto";
import { Request } from "express";
import { ALREADY_EXISTED_LIKE, DB_CONNECT_FAILED } from "../errors/common-error";
import { COMMENT_DELETE_FAILED , COMMENT_CREATE_FAILED } from "../errors/comment-error";

@JsonController("/post/:postId/comment")
@UseBefore(checkAccessToken)
@Service()
export class CommentController {
    constructor(private readonly _commentService : CommentService,){}
    @HttpCode(200)
    @UseBefore(checkAccessToken)
    @Get()
    public async getComments(@Param("postId")postId : string){
      const comments = await this._commentService.getCommentsByPostId(postId);
      const result = comments.map(comment=>{
        const {user,...data} = comment;
        return{
          ...data,
          name:user.nickname?user.nickname:user.name,
        }
      });
      return createResponseForm(result);
    }
  
    @HttpCode(201)
    @Post()
    @UseBefore(checkAccessToken)
    public async createCommnet(@Param("postId") postId: string,@Body() createCommentDto : CreateCommentDto,@Req() req:Request){
        const userId = req.user.jwtPayload.userId;
        try{
          await this._commentService.create(createCommentDto,postId,userId);
          return createResponseForm(undefined);
        }
        catch {
          return typia.random<COMMENT_CREATE_FAILED>();
        }
  
    }
    @HttpCode(201)
    @Delete()
    @UseBefore(checkAccessToken)
    public async deleteCommnet(@Param("postId") postId: string,@Req() req:Request,@BodyParam("commentId")commentId:string){
        const userId = req.user.jwtPayload.userId;
        try{
          if(await this._commentService.checkUserIdWithPostId(userId,commentId,postId)){
            await this._commentService.delete(commentId);
            return createResponseForm(undefined);
          }
          else return typia.random<COMMENT_DELETE_FAILED>();
        }
        catch {
          return typia.random<DB_CONNECT_FAILED>();
        }
    }
    @HttpCode(201)
    @Post("/like")
    @UseBefore(checkAccessToken)
    public async likeCommnet(@Param("postId") postId: string,@Req() req:Request,@Param("commentId")commentId:string){
        const userId = req.user.jwtPayload.userId;
        
        const result = await this._commentService.likeComment(commentId,userId);
        if(result)
          return createResponseForm(undefined);
        else
          return typia.random<ALREADY_EXISTED_LIKE>();
    }
    
}