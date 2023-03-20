import {  District } from "../entities";
import database from "../loaders/database";
import { logger } from "../utils/Logger";

export const DistrictRepository =  database.getRepository(District).extend({
    async getAddressByPoint(coordinate: string) {
    
    return this.query(`
        SELECT *
        FROM district
        ORDER BY ST_Distance_Sphere(coordinate, ST_GeomFromText('${coordinate}'))
        LIMIT 1;
        `
    ).catch(err=>logger.log(err));
    }
});


