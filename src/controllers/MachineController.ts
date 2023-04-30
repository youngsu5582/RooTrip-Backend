import { Service } from "typedi";
import { Body, Get, HttpCode, JsonController, Post, Res } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";

import { MachineService } from "../services";



@JsonController("/machine")
@Service()
export class MachineController {
    constructor(
        private readonly _machineService : MachineService
    ){}
    @HttpCode(200)
    @Get("/connect")
    @OpenAPI({
      summary: "머신러닝 서버 연결 테스트",
      description: "env 안에 들어있는 MACHINE_URL 이 제대로 들어가서 서버와 연결한다면 true 를 반환한다.",
      responses: {
        "200": {}
      }
    })
    public async testConnection() {
        return await this._machineService.connect();
    }
}