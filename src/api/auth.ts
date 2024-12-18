/**
 * @description: 认证相关接口
 */
import { handleMainLogin } from "@/utils/yohub.desktop";
import request from "./index";
import type { ILoginParams, IRegisterParams } from "./types";
// import request from "./_fetch";

/**
 * 登录
 * @param {Object} data
 * @returns
 */
export function login(data: ILoginParams) {
  return request.post("/auth/login", data);
  // return handleMainLogin(data);
  // return new Promise((resolve, reject) => {
  //   fetch(`${import.meta.env.VITE_BASE_DOMAIN}/auth/login`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((response) => response.json())
  //     .then((res) => {
  //       resolve(res);
  //       console.log("login data", res);
  //     })
  //     .catch((err) => {
  //       reject(err);
  //       console.log("login err", err);
  //     });
  // });
}

/**
 * 注册
 * @param {Object} data
 * @returns
 */
export function register(data: IRegisterParams) {
  return request.post("/auth/register", data);
}
/**
 * 退出登录
 */
export function logout() {
  return request.post("/user/logout/ajax");
}

/** 其他登录方式 */
/**
 * 获取微信二维码接口(OK)
 * @param {}
 * @returns
 */
export const getWechatQrcode = () => {
  return request.post("/auth/get_wechat_qrcode", {});
};
/**
 * 微信扫码登录
 * @param params
 * @returns
 */
export const wechatLogin = (params: any) => {
  return request.post("/auth/loginWechat", params);
};

/**
 * 获取QQ二维码接口
 */
export const getQqQrcode = () => {
  return request.post("/auth/get_qq_qrcode", {});
};
