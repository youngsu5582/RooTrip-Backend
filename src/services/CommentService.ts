import { Service } from "typedi";
import { CreateCommentDto } from "../dtos/PostDto";
import { CommentRepository } from "../repositories";
import Comment from "../entities/Comment";
import { CommentLikeRepository } from "../repositories/CommentLikeRepository";
import CommentLike from "../entities/CommentLike";




@Service()
export class CommentService {
    private commentRepository : typeof CommentRepository;
    private commentLikeRepository : typeof CommentLikeRepository
    constructor(){
        this.commentRepository = CommentRepository;
        this.commentLikeRepository = CommentLikeRepository;
    }
    public async create(createCommentDto:CreateCommentDto,postId : string , userId:string){
        return await this.commentRepository.save(Comment.create({...createCommentDto,postId,userId}));
    }    
    public async getCommentsByPostId(postId:string){
        return await this.commentRepository.find({where:{postId}});
    }
    public async delete(commentId:string){
        return await this.commentRepository.delete(commentId);
    }
    public async checkUserIdWithPostId(userId:string,commentId:string,postId:string){
        return await this.commentRepository.findOne({where:{userId,id:commentId,postId}});
    }
    public async likeComment(commentId:string,userId:string){
        if (await this.commentLikeRepository.checkDuplicate(userId, commentId)) return false;
        return await this.commentLikeRepository.save(CommentLike.create({commentId,userId}));
    }
    public async checkUserIdWithCommentId(userId:string,commentId:string){
        return await this.commentLikeRepository.findOne({where:{userId,commentId}});
    }
}