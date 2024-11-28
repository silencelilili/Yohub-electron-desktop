/**
 * @description: 用户相关接口
 */
import request from "./index";

/**
 * @description: 获取用户信息
 * @return {*}
 */
export function getUserInfo(data: { user_id?: string }) {
  return request.post("/user/get_user", data);
}

/**
 * 修改用户名称
 */
export function updateUserName(data: { newusername: string }) {
  return request.post("/user/username", data);
}
/**
 * 修改密码
 */
export function updatePassword(data: {
  /** 原密码 */
  password: string;
  /** 新密码 */
  new_password: string;
  /** 确认新密码 */
  confirm_new_password: string;
}) {
  return request.post("/user/password", data);
}
/**
 * 重置密码
 */
export function resetPassword(data: { email: string }) {
  return request.post("/user/passwd_reset", data);
}

/**
 * 绑定手机号
 */
export function bindPhone(phone: string, code: string) {
  return request.post("/user/bindPhone", { phone, code });
}
/**
 * 绑定邮箱
 */
export function bindEmail(email: string, code: string) {
  return request.post("/user/bindEmail", { email, code });
}
