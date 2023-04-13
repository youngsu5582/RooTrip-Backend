import { District } from "../entities";
import database from "../loaders/database";
import { logger } from "../utils/Logger";

export const DistrictRepository = database.getRepository(District).extend({
  async getAddressByPoint(coordinate: string) {
    return await this.query(
      `
        SELECT *
        FROM district
        ORDER BY ST_Distance_Sphere(coordinate, ST_GeomFromText('${coordinate}'))
        LIMIT 1;
        `
    )
      .then((data) => data[0])
      .catch((err) => logger.error(err));
  }
});
