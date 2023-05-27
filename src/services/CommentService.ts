import { Service } from "typedi";
import { CreateCommentDto } from "../dtos/PostDto";
import { CommentRepository } from "../repositories";
import Comment from "../entities/Comment";




@Service()
export class CommentService {
    private commentRepository : typeof CommentRepository;
    constructor(){
        this.commentRepository = CommentRepository;
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
}