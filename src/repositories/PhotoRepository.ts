import { CreatePhotoDto } from "../dtos/PhotoDto";
import { CityType } from "../dtos/PostDto";
//import { CityType } from "../dtos/PostDto";
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
    SELECT distinct temp.post_id as id
    FROM (
        SELECT photo.city, post_id, ROW_NUMBER() OVER (PARTITION BY city ORDER BY RAND()) AS row_num
        FROM photo
    ) as temp
    WHERE row_num = 1;` 
  ).then(result=>result.map(row=>row.id));

  },
  async getPostByPolygon(cityType:CityType){
    const {polygon,markerCount} = cityType;
    return await this.query(`SELECT distinct post_id
    FROM photo
    WHERE photo_order = 0 and ST_Within(coordinate,ST_GeomFromText('${polygon}', 4326))
    LIMIT ${markerCount};`).then(result=>result.map(row=>row.post_id));
    //.then(result=>result.map(row=>row.post_id));
//    return await this.createQueryBuilder('photo').where(`ST_Within(photo.coordinate, ST_GeomFromText(:polygon, 4326))`, { polygon }).limit(markerCount).select("id").getMany();
  } 
});
