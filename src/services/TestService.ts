import { Service } from "typedi";
import { TestDto } from "../dtos/TestDto";
import { DistrictRepository } from "../repositories/DistrictRepository";

@Service()
export class TestService{
    /**
     * 테스트를 위한 Function
     * 
     */
    constructor(private readonly districtRepository:typeof DistrictRepository){
        this.districtRepository = DistrictRepository;
    };
    public async testFunction(){
        const result = await this.districtRepository.getAddressByPoint("POINT(128.6240551 36.8056858)");
        console.log(result);
        return result.city;
    }
}   