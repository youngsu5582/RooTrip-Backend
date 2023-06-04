export interface ERROR {
  status: false;
  message: string;
}
export const isErrorCheck = (obj: any): obj is ERROR => {
  if (obj.status === false) return true;
  else return false;
};

