import { Service } from "typedi";
import { CreatePhotoDto } from "../dtos/PhotoDto";
import { PhotoRepository } from "../repositories";

@Service()
export class PhotoService {
  constructor(private readonly _photoRepository: typeof PhotoRepository) {
    this._photoRepository = PhotoRepository;
  }
  public async createPhotos(createPhotoDtos: CreatePhotoDto[], postId: string) {
    try {
      await Promise.all(createPhotoDtos.map(async (createPhotoDto,index)=>(await this._photoRepository.createPhoto(createPhotoDto, postId,index))));
      return await this._photoRepository.find({where:{postId},order:{order:"desc"}});
    } catch {
      throw Error;
    }
  }
  public async getThumbnailByPostId(postId:string){
    const result =  await this._photoRepository.findOne({where:{postId},select:["id","coordinate","imageUrl"]});
    return result;
  }
  public async getPhotoslByPostId(postId:string){
    return await this._photoRepository.find({where:{postId},order:{order:"desc"}});
  }
}
