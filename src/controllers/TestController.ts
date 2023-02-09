import {Service} from 'typedi';
import {JsonController,
    HttpCode,
    Get,
    QueryParam,
    } from "routing-controllers";
import {OpenAPI} from "routing-controllers-openapi";
import { Request, Response } from 'express';
import { TestService } from '../services/TestService';
import { TestDto } from '../dtos/TestDto';

@JsonController('/test')
@Service()
export class AuthController{
    constructor(private testService:TestService){};
    @HttpCode(200)
    @Get("")
    @OpenAPI({
        summary:"Test Function"
    })
    public async test(@QueryParam("test")test:TestDto){
        const result = await this.testService.testFunction(test);
        return result;
    }
}