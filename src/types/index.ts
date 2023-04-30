import { ERROR } from "src/errors";

export interface ResponseForm<T> {
    status: true;
    message?: string;
    //requestToResponse : `${number}ms`;
    data: T;
  }
  
export type Try<T> = ResponseForm<T>;
export type TryCatch<T, E extends ERROR> = ResponseForm<T> | E;