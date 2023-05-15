import { ERROR } from ".";

export interface EMAIL_SEND_FAILED extends ERROR {
    status : false;
    message : "이메일 전송에 실패했습니다.";
  }
  export interface NOT_COORECT_NUMBER extends ERROR{
    status : false;
    message : "인증번호가 일치하지 않습니다.";
  }