/**
 * @description: 工单相关接口
 */
import request from "./index";
// import request from "./_fetch";

/**
 * 获取工单列表
 * @param params
 * @returns
 */
export const getTicketList = () => {
  return request.post("/user/ticket/list", {});
};

/**
 * 创建工单
 * @param params
 * {
 *   title: string;
 *   content: string;
 *   type: string;
 * }
 * @returns
 */
export const createTicket = (params: any) => {
  return request.post("/user/ticket/create", params);
};

/**
 * 获取工单详情
 * @param params
 * @returns
 */
export const getTicketDetail = (params: any) => {
  return request.post("/user/ticket/view", params);
};
/**
 * 工单回复
 * @param params
 */
export const replyTicket = (params: any) => {
  return request.post(`/user/ticket/reply`, params);
};
