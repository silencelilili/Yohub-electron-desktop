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
 * 忘记密码-发送邮箱验证码
 * @param {
 * scene_type: 0 注册; 1 忘记密码; 2 修改邮箱
 * email: string
 * }
 */
export const sendEmailCode = (data: { email: string; scene_type: number }) => {
  return request.post("/user/send_code", data);
};

/**
 * 忘记密码-验证邮箱验证码
 */
export const verifyEmailCode = (data: {
  email: string;
  email_code: string;
}) => {
  return request.post("/user/verify_code", data);
};
/**
 * 忘记密码-设置新密码
 */
export function resetPassword(data: {
  new_password: string;
  confirm_new_password: string;
}) {
  return request.post("/user/reset_pwd", data);
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
export function updateEmail(data: { newemail: string; email_code: string }) {
  return request.post("/user/email", data);
}
/**
 * 绑定邮箱 / 修改邮箱 - 发送邮箱验证码
 * @param data
 * @returns
 */
export const sendEmailVerifyCode = (data: {
  newemail: string;
  scene_type: number;
}) => {
  return request.post("/user/email_verify_code", data);
};

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
// export type SubType = "json" | "clash" | "singbox" | "v2rayjson" | "sip008";
export function getConfigSub(token: string, subtype: string) {
  return request.post(`/sub/${token}/${subtype}`, {});
}

/**
 * 获取链路列表
 */
export function getNodesList() {
  return request.post("/user/query_nodes", {});
}
/**
 * 获取线路列表
 * @param data
 * @returns
 * @description 返回加密了的线路列表信息，需要进行对称解密
 */
export function getLinesList() {
  return request.post("/user/query_lines", {});
}

/**
 * 信息上报
 */

export const report = (data: IReportParams) => {
  return request.post("/user/clients/report", data);
};

/**
 * 获取在线终端列表
 */
export const getTerminals = () => {
  return request.post("/user/query_online_terminals", {});
};

/**
 * 终端解绑
 * @param data {
 * user_client_rel_id: '用户与终端关系ID，唯一标识；在线终端接口返回值里的ID；'
 * }
 */
export const delTerminals = (data: { user_client_rel_id: string }) => {
  return request.post("/user/del_terminal", data);
};

/**
 * 获取国旗/位置
 */
export const getFlag = () => {
  return request.post("/user/clients/flag");
};
