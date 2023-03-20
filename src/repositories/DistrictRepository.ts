import {  District } from "../entities";
import database from "../loaders/database";

export const DistrictRepository =  database.getRepository(District).extend({
    async getAddressByPoint(coordinate: string) {
    
    return this.query(`
        SELECT *
        FROM district
        ORDER BY ST_Distance_Sphere(coordinate, ST_GeomFromText('${coordinate}'))
        LIMIT 1;
        `
    ).catch(err=>console.log(err));
    }
});


    