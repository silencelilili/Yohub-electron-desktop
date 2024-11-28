/**
 * @description: 认证相关接口
 */
import request from "./index";

/**
 * 登录
 * @param {Object} data
 * @returns
 */
export interface ILoginParams {
  /** 账号/邮箱 */
  email: string;
  /** 密码 */
  password: string;
  remember_me: boolean;
  /** 用户两步验证码 */
  mfa_code?: string;
  /** cookie内容 */
  redir?: string;
}
export function login(data: ILoginParams) {
  return request.post("/auth/login", data);
}

/**
 * 注册
 * @param {Object} data
 * @returns
 */
export function register(data: {
  /** 账号/邮箱 */
  email: string;
  /** 密码 */
  password: string;
  /** 确认密码 */
  password_confirmation: string;
  /** 用户名 */
  name: string;
  /** 邀请码 */
  code?: string;
  /** 方式 */
  imtype?: string;
  /** 联系方式账号*/
  wechat?: string;
}) {
  return request.post("/auth/register", data);
}
/**
 * 退出登录
 */
export function logout() {
  return request.post("/user/logout/ajax");
}

/** 其他登录方式 */
