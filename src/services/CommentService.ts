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
        this.commentRepository.save(Comment.create({...createCommentDto,postId,userId}));
    }    
    public async getCommentsByPostId(postId:string){
        this.commentRepository.find({where:{postId}});
    }
}