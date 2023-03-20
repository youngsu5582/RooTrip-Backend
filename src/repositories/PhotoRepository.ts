import Photo from "../entities/Photo";
import database from "../loaders/database";


export const PhotoRepository =  database.getRepository(Photo).extend({
    async getTopPhoto(){
        return await this.createQueryBuilder('photo').distinctOn(['photo.city']).orderBy('photo.city,photo.views',"DESC").take(2).getMany();
    }




})