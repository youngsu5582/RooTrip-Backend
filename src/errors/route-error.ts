import { ERROR } from ".";

export interface RECOMMEND_ROUTE_FAILED extends ERROR { 
    status: false;
    message: "경로 추천 받는 걸 실패했습니다.";
  }
export interface GET_EMPTY_ROUTE extends ERROR {
    status : false;
    message : "해당 하는 경로가 없습니다.";
}