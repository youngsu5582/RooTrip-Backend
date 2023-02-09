import { Service } from "typedi";
import { TestDto } from "../dtos/TestDto";
@Service()
export class TestService{
    /**
     * 테스트를 위한 Function
     * 
     */
    public async testFunction(test:TestDto){
        return test;
    }
}
