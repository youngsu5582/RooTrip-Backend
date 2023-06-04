import { ERROR } from ".";

export interface COMMENT_CREATE_FAILED extends ERROR{
    status : false;
    message : "댓글 생성에 실패했습니다.";
}
export interface COMMENT_DELETE_FAILED extends ERROR{
    status : false;
    message : "댓글 삭제를 실패했습니다.";
}