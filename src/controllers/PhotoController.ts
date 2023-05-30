import { Service } from "typedi";
import {
  Body,
  Get,
  HttpCode,
  JsonController,
  Post,
  QueryParam
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { GeoService } from "../services";
import { CoordinateType } from "../common";
import { signedUrl } from "../utils/s3";
import { createResponseForm } from "../interceptors/Transformer";

@JsonController("/photo")
@Service()
export class PhotoController {
  constructor(private geoservice: GeoService) {}
  @HttpCode(200)
  @Get("/reverse")
  @OpenAPI({
    description: "사진 좌표"
  })
  public async Address(
    @QueryParam("latitude") latitude: string,
    @QueryParam("longitude") longitude: string
  ) {
    //어케 받아오는지 생각해야함
    const coordinate: CoordinateType = {
      latitude: latitude,
      longitude: longitude
    };
    const result = await this.geoservice.getAddress(coordinate)
    return createResponseForm(result);
  }

  @HttpCode(201)
  @Post("/signed")
  public async getSigned(@Body() fileNames: string[]) {
    const result = await signedUrl(fileNames);
    return createResponseForm(result);
  }
}
