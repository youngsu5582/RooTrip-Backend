import { CreatePhotoDto } from "../dtos/PhotoDto";
import Photo from "../entities/Photo";
import database from "../loaders/database";
import { UUID } from "../utils/Uuid";

export const PhotoRepository = database.getRepository(Photo).extend({
  async getTopPhoto() {
    return await this.createQueryBuilder("photo")
      .distinctOn(["photo.city"])
      .orderBy("photo.city,photo.views", "DESC")
      .take(2)
      .getMany();
  },
  async createPhoto(createPhotoDto: CreatePhotoDto, postId: string,order:number) {
    const { city, coordinate, first, second, image_url } = createPhotoDto;
    return await this.query(
      `INSERT INTO photo (id, image_url, post_id, coordinate, city, first, second,photo_order) VALUES ("${await UUID()}", "${image_url}", "${postId}", ST_GeomFromText("POINT(${
        coordinate.y
      } ${coordinate.x})", 4326),"${city}", "${first}","${second}","${order}")`
    );
  },
  async getRandomPostIdEachCity(){
    return await this.query(`
    SELECT temp.post_id as id
    FROM (
        SELECT photo.city, post_id, ROW_NUMBER() OVER (PARTITION BY city ORDER BY RAND()) AS row_num
        FROM photo
    ) as temp
    WHERE row_num = 1;`
  ).then(result=>result.map(row=>row.id));

  } 
});
