import { Service } from "typedi";
import {
  JsonController,
  HttpCode,
  Get,
  QueryParam,
  Post
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { TestService } from "../services/TestService";
import { getFile } from "../utils/s3";

@JsonController("/test")
@Service()
export class TestController {
  constructor(private readonly testService: TestService) {}
  @HttpCode(200)
  @Get("")
  @OpenAPI({
    summary: "Test Function"
  })
  public async test() {
    const result = await this.testService.testFunction();
    return result;
  }

  @Post("/image")
  @OpenAPI({
    summary: "Test Image Function"
  })
  @Get("/id")
  @OpenAPI({
    summary: "Test Get Image Function"
  })
  public async getImage(@QueryParam("path") path: string) {
    const result = await getFile(path);
    return result;
  }
}
