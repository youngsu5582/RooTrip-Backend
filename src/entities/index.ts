import User from './User';
import Post from './Post';

export default {User,Post};
export {User,Post};

export class Entities {
    
    constructor(){};
    get default(){
        return{
            User,
            Post,

        }
    }
}
