import { UserRepository } from "../repositories";


export class UserService{
    constructor(private readonly _userRepository : typeof UserRepository ){
        this._userRepository = UserRepository;
    };
    //둘다 이미 Follow 중인지도 확인
    public async followUser(followId:string , followingId:string){
        //followingId 가 followId 를 Follow 하게 구현
        //반대편으로 followId 도 follower 로 followingId를 가지고 있어야함.
        return followId+"\t"+followingId;
    }
    public async unfollowUser(followId:string , followingId:string){
        return followId+"\t"+followingId;
    }
}