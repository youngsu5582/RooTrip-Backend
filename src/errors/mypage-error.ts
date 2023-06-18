import { ERROR } from ".";

export interface PROFILE_IMAGE_UPLOAD_FAILED extends ERROR {
    status: false;
    message: "프로필 사진 등록에 실패했습니다.";
  }

export interface NICKNAME_CHANGE_FAILED extends ERROR {
    status : false;
    message : "닉네임 변경에 실패했습니다.";
  }

export interface GENDER_CHANGE_FAILED extends ERROR {
    status: false;
    message : "성별 변경에 실패했습니다.";
  }

export interface LIKED_POST_GET_FAILED extends ERROR {
  status: false;
  message: "추천한 게시글을 불러오는데 실패했습니다.";
}

export interface SAVED_POST_GET_FAILED extends ERROR {
  status: false;
  message: "저장된 게시글을 불러오는데 실패했습니다.";
}

export interface UPLOAD_POST_GET_FAILED extends ERROR {
  status: false;
  message: "작성한 게시글을 불러오는데 실패했습니다.";
}

export interface CHANGE_PASSWORD_FAILED extends ERROR {
  status: false;
  message: "비밀번호 변경에 실패했습니다.";
}

export interface WITHDRAWL_FAILED extends ERROR { 
  status: false;
  message: "회원탈퇴를 진핼할 수 없습니다.";
}

export interface GET_PROFILE_FAILED extends ERROR {
  stsuts: false;
  message: "프로필을 가져올 수 없습니다.";
}