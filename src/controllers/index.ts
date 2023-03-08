import {AuthController} from'./AuthController';
import {PostController} from './PostController';
import {TestController} from './TestController';
import { PhotoController } from './PhotoController';
export class Controllers {
    constructor(){};
    get default(){
        return{
            AuthController,
            PostController,
            TestController,
            PhotoController,
        }
    }
}


export {AuthController,PostController,TestController,PhotoController};