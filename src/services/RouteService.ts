import { Service } from "typedi";
import { PhotoRepository, PostRepository } from "../repositories";
import { RegionsType } from "../dtos/RouteDto";
import typia from "typia";
import { GET_EMPTY_ROUTE } from "../errors/route-error";


@Service()
export class RouteService {
    constructor(private readonly postRepository: typeof PostRepository,
        private readonly photoRepository : typeof PhotoRepository){
        this.postRepository = PostRepository;
        this.photoRepository = PhotoRepository;
    }
    public async getPost(cities : Array<RegionsType>){
        let matched = (await this.photoRepository.createQueryBuilder("photo").select("distinct post_id").where({city:cities[0]}).getRawMany()).map(packet=>packet.post_id);
        try{
        for(let i =1 ;i<cities.length;i++){
                matched = (await this.photoRepository.createQueryBuilder("photo").select("distinct post_id").where({city:cities[i]}).andWhere("post_id IN (:...matched)",{matched}).getRawMany()).map(packet=>packet.post_id); 
            }
            const posts = await this.postRepository.createQueryBuilder("post").where("id In(:...matched)",{matched}).andWhere("visibility = 'public'").getMany();
            return posts;
        }
        catch{
            return typia.random<GET_EMPTY_ROUTE>();
        }
    }
}