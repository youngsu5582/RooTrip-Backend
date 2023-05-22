import { Service } from "typedi";
import axios from "axios";
import {env} from '../loaders/env';
const machine = env.machine;
@Service()
export class MachineService {
  constructor() {
  }
  public async connect() {
    const result = await axios.get(`${machine.url}/machine/connect`).catch(()=>(null));
    if(result)
        return true
    else
        return false
  }
  public async getPostsByUserId(userId:string){
    const result = await axios.post(`${machine.url}/machine/getPosts`,{userId}).catch(()=>null) as string[];
    return result;
  }
}
