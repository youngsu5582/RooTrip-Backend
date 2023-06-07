import { Service } from "typedi";
import { PhotoRepository, PostRepository } from "../repositories";
import { RegionType } from "../dtos/RouteDto";


@Service()
export class RouteService {
    constructor(private readonly postRepository: typeof PostRepository,
        private readonly photoRepository : typeof PhotoRepository){
        this.postRepository = PostRepository;
        this.photoRepository = PhotoRepository;
    }
    public async getPost(cities : Array<RegionType>){
        let matched = (await this.photoRepository.createQueryBuilder("photo").select("distinct post_id").where({city:cities[0]}).getRawMany()).map(packet=>packet.post_id);
        for(let i =1 ;i<cities.length;i++){
            matched = (await this.photoRepository.createQueryBuilder("photo").select("distinct post_id").where({city:cities[i]}).andWhere("post_id IN (:...matched)",{matched}).getRawMany()).map(packet=>packet.post_id); 
        }
        const posts = await this.postRepository.createQueryBuilder("post").where("id In(:...matched)",{matched}).andWhere("visibility = 'public'").getMany();
        return posts;
    }
}