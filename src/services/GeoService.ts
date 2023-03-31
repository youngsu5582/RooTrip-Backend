import  { Service } from "typedi";
import { CoordinateType } from "../common";
import { DistrictRepository } from "../repositories";

@Service()
export class GeoService{
    private districtRepository:typeof DistrictRepository;
    constructor(){
        this.districtRepository = DistrictRepository;
    };
    public async getAddress(coordinate:CoordinateType){
        const point = `POINT(${coordinate.longitude} ${coordinate.latitude})`;
        return await this.districtRepository.getAddressByPoint(point);

    }

}