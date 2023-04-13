import { Service } from "typedi";
import { CreatePhotoDto } from "../dtos/PhotoDto";
import { PhotoRepository } from "../repositories";
import { logger } from "../utils/Logger";

@Service()
export class PhotoService {
  constructor(private readonly _photoRepository: typeof PhotoRepository) {
    this._photoRepository = PhotoRepository;
  }
  public async createPhotos(createPhotoDtos: CreatePhotoDto[], postId: string) {
    try {
      for (const createPhotoDto of createPhotoDtos) {
        await this._photoRepository.createPhoto(createPhotoDto, postId);
      }
    } catch (err) {
      logger.error(err);
    }
  }
}
