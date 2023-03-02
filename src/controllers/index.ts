import {AuthController} from'./AuthController';
import {PostController} from './PostController';
import {TestController} from './TestController';

export class Controllers {
    constructor(){};
    get default(){
        return{
            AuthController,
            PostController,
            TestController,

        }
    }
}


export {AuthController,PostController,TestController};