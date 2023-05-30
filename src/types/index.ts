import { ERROR } from "../errors";

export interface ResponseForm<T> {
    status: true;
    message?: string;
    data: T;
  }
export type Try<T> = ResponseForm<T>;


export interface ErrorForm<T> {
  status:false;
  message ?:string;
}
export type Catch<T> = ErrorForm<T>;
export type TryCatch<T, E extends ERROR> = ResponseForm<T> | ErrorForm<E>;



export interface photoType {
  id:number;
  feedOrder : number;
  fileName:string;
  dateTime : Date;
  latitude : string;
  longitude : string;
}
export interface articleType  {
  title : string;
  content : string;
}