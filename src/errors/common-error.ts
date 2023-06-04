import { ERROR } from ".";

export interface ALREADY_EXISTED_LIKE extends ERROR {
    status : false;
    message : "추천 중복입니다.";
}

export interface DB_CONNECT_FAILED extends ERROR {
    status : false;
    message : "DB 연결에 실패했습니다.";
  }