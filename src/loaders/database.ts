import mongoose from 'mongoose';
import {env} from './env';  
export async function sync():Promise<void>{
    const database = env.database;
    const mongoUrl = `mongodb+srv://${database.username}:${database.password}@${database.name}` || undefined;
if(typeof mongoUrl ==='undefined'){
    console.log('Please Define Databse Information in Env File ');
    process.exit(1);
}
else{
mongoose.connect(mongoUrl,{retryWrites:true})
.then(()=>console.log('Success Mongo DB Connect!'))
.catch((e:any)=>{console.error(e);console.log('Failed Mongo DB Connect!')});
}

}