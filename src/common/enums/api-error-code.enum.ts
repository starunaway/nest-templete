export enum ApiErrorCode {
  SUCCESS = 200, // 成功
  Forbidden = 403,
  USER_EXIST = 10001, // 用户id无效
  PERMISSSION_EXIST = 20001,
  ROLE_EXIST = 30001,
  DATABASE_ERROR = 100001,
}
