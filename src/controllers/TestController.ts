import { Service } from "typedi";
import {
  JsonController,
  HttpCode,
  Get,
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import typia from "typia";
import { CreatePostInterface } from "../testing/CreatingPost";
import { GeoService, PhotoService, PostService, UserService } from "../services";
import { POST_CREATE_FAILED } from "../errors/post-error";
import { createResponseForm } from "../interceptors/Transformer";

@JsonController("/testingData")
@Service()
export class TestDataController {
  constructor(private readonly _userService : UserService,
      private readonly _postService : PostService,
      private readonly _geoService : GeoService,
      private readonly _photoService : PhotoService,
    )
   {}

  @Get("/post")
  @HttpCode(200)
  @OpenAPI({
    description:"임의의 포스팅 데이터를 삽입합니다."
  })
  public async insertTestingPost(){
    
    for(let i = 0;i<50;i++){
      const userId = await this._userService.getRandomUser();

      const createPostDto = typia.random<CreatePostInterface>();
      try{
        const photos = await Promise.all(
          createPostDto.newPhotos.map(async (photo) => {
            return {
              image_url: photo.image_url,
              ...(await this._geoService.getAddress({latitude : photo.latitude,longitude : photo.longitude} as any)),
            };
          })
        );
        const post = await this._postService.createPost(createPostDto as any, userId as any);
        await this._photoService.createPhotos(photos, post.id);
      }
      catch{
        return typia.random<POST_CREATE_FAILED>();
      }
    }
    return createResponseForm(undefined);
  }
}
