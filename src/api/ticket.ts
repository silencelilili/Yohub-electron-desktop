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
 * 修改工单
 * @param params
 */
// export const updateTicket = (id: string, params: any) => {
//   return request.put(`/user/ticket/${id}`, params);
// };
