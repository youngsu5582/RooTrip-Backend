import {Service} from 'typedi';
import {Get, HttpCode, JsonController, QueryParam} from 'routing-controllers';
import {OpenAPI} from 'routing-controllers-openapi';
import {GeoService} from '../services';
import {CoordinateType} from '../common';
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
        const coordinate : CoordinateType = {
            latitude : latitude,
            longitude : longitude
        }
        
        return await this.geoservice.getAddress(coordinate);
        
    }
}   