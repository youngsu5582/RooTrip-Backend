export interface ERROR {
  status: false;
  message: string;
}
export const isErrorCheck = (obj: any): obj is ERROR => {
  if (obj.status === false) return true;
  else return false;
};

export interface DB_CONNECT_FAILED extends ERROR {
  status : false;
  message : "DB 연결에 실패했습니다.";
}