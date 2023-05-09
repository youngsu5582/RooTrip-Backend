import { ERROR } from "../errors";

export interface ResponseForm<T> {
    status: true;
    message?: string;
    //requestToResponse : `${number}ms`;
    data: T;
  }
  
export type Try<T> = ResponseForm<T>;
export type TryCatch<T, E extends ERROR> = ResponseForm<T> | E;



export interface photoType {
  id:number;
  feedOrder : number;
  fileName:string;
  image_url: string;
  dateTime : Date;
  latitude : string;
  longitude : string;
}
export interface articleType  {
  title : string;
  content : string;
}