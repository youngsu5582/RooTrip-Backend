import { Body, HttpCode, JsonController,  Post, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { OpenAPI } from "routing-controllers-openapi";
import {  RouteDto } from "../dtos/RouteDto";
import { RouteService } from "../services/RouteService";
import { createResponseForm } from "../interceptors/Transformer";

@JsonController("/route")
@Service()
@UseBefore(checkAccessToken)
export class RouteController {
    constructor(private readonly _routeService:RouteService){}
    @HttpCode(201)
    @Post()
    @OpenAPI({
      description: "해당 게시글을 조회합니다"
    })
    public async recommend(@Body()routeDto : RouteDto) {
        const result = await this._routeService.getPost(routeDto.cities);
        return createResponseForm(result);
    }
}