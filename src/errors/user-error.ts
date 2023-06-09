import { ERROR } from ".";

export interface NOT_EXISTED_USER extends ERROR {
    status: false;
    message: "존재하지 않는 회원입니다.";
}

export interface ALREADY_FOLLOWING extends ERROR {
    status: false;
    message: "이미 팔로잉 중 입니다."
}

export interface UNFOLLOW_FAILED extends ERROR {
    status: false;
    message: "이미 언팔로우 하였습니다.";
  }

export interface FOLLOW_FAILED extends ERROR {
    status: false;
    message: "팔로잉에 실패했습니다.";
}

export interface NOT_FOLLOWING extends ERROR {
    status: false;
    message: "팔로잉중이 아닙니다.";
}

export interface SELECT_FOLLOWING_LIST_FAILED extends ERROR {
    status: false;
    message: "팔로잉 목록 조회에 실패했습니다."
}

export interface SELECT_FOLLOWER_LIST_FAILED extends ERROR {
    status: false;
    message: "팔로워 목록 조회에 실패했습니다."
}