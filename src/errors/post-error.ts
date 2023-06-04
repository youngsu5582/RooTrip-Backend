import {ERROR} from ".";
export interface POST_NOT_MATCH_USER extends ERROR {
    status : false;
    message : "로그인 유저와 게시글 작성자가 일치하지 않습니다.";
}
export interface ALREADY_EXISTED_LIKE extends ERROR {
    status : false;
    message : "추천 중복입니다.";
}
export interface NOT_EXISTED_LIKE extends ERROR {
    status :false;
    message : "추천이 없습니다.";
}
export interface POST_CREATE_FAILED extends ERROR {
    status : false;
    message : "게시글 생성에 실패했습니다.";
}
export interface POST_UPDATE_FAILED extends ERROR {
    status : false;
    message : "게시글 수정에 실패했습니다.";
}
export interface POST_DELETE_FAILED extends ERROR {
    status : false;
    message : "게시글 삭제에 실패했습니다.";
}
export interface RATING_UPLOAD_FAILED extends ERROR {
    status : false;
    message : "사용자-게시글 상호작용 업로드를 실패했습니다."
}
export interface POST_GET_FAILED extends ERROR {
    status : false;
    message : "게시글 받는걸 실패했습니다.";
}
export interface COMMENT_CREATE_FAILED extends ERROR{
    status : false;
    message : "댓글 생성에 실패했습니다.";
}