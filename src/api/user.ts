/**
 * @description: 用户相关接口
 */
import request from "./index";
import { IReportParams } from "./types";
// import request from "./_fetch";

/**
 * @description: 获取用户信息
 * @return {*}
 */
export function getUserInfo(data?: { user_id?: string }) {
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
export function bindEmail(data: { email: string; code: string }) {
  return request.post("/user/bindEmail", data);
}
/**
 * 修改邮箱
 */
export function updateEmail(data: { newemail: string; code: string }) {
  return request.post("/user/email", data);
}

/**
 * 获取用户邀请信息
 */
export const getInviteInfo = () => {
  return request.post("/user/query_invite", {});
};
/**
 * 获取用户公告/消息内容
 */
export const getNoticeContent = () => {
  return request.post("/user/announcement", {});
};

/**
 * 通过订阅地址拉取配置-PC
 */
/** 订阅类型 */
export type SubType = "json" | "clash" | "singbox" | "v2rayjson" | "sip008";
export function getConfigSub(token: string, subtype: SubType) {
  return request.post(`/sub/${token}/${subtype}`, {});
}

/**
 * 获取链路列表
 */
export function getNodesList() {
  return request.post("/user/query_nodes", {});
}

/**
 * 信息上报
 */

export const report = (data: IReportParams) => {
  return request.post("/user/clients/report", data);
};
