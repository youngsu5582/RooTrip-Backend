import {Service} from 'typedi';
import {Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParam, QueryParams, Req, Res, Session, SessionParam, UseBefore} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { GeoService } from '../services';
import { Coordinate } from '../common';

@JsonController('/photo')
@Service()
export class PhotoController{
    constructor(private geoservice :GeoService){};
    @HttpCode(200)
    @Get('/temp')
    @OpenAPI({
        description : '사진 좌표'
    })
    public async Address (@QueryParam('latitude') latitude : string,@QueryParam('longitude')longitude : string){
        //어케 받아오는지 생각해야함
        const coordinate : Coordinate = {
            latitude : latitude,
            longitude : longitude
        }
        
        return await this.geoservice.getAddress(coordinate);
        
    }
}   