import request from "./index";
// import request from "./_fetch";
/**
 * 可购买商品列表
 */
export const getProductList = () => {
  return request.post("/user/product", {});
};

/**
 * 校验优惠码(OK)
 * @param params
 * {
 *  coupon: 优惠码
 *  product_id: 商品id
 * }
 * @returns {
 *  ret: 1,
 *  msg: "优惠码可用",
 *  discount: "优惠价格",
 *  buy_price: "购买价格"
 * }
 */

export const checkCoupon = (params: {
  coupon: string;
  product_id: string | number;
}) => {
  return request.post("/user/coupon", params);
};

/**
 * 获取订单列表(OK)
 */
export const getOrderList = () => {
  return request.post("/user/order/list", {});
};

/**
 * 订单详情
 * @param params
 * @returns
 */
export const getOrderDetail = (id: string | number) => {
  return request.post("/user/order/detail", { id });
};

/**
 * 创建订单
 * {
 *  coupon?: 优惠码
 *  product_id: 商品id
 * }
 */
export const createOrder = (params: {
  product_id: string | number;
  coupon?: string;
}) => {
  return request.post("/user/order/create", params);
};

/**
 * 支付宝支付二维码
 * @param data 
 * {
  invoice_id: 订单id
  amount: 订单金额
 },
 @returns {
  qrcode: 支付二维码链接
  pid: 支付网关单号
 }
 */

export interface IAlipayQrcodeParams {
  /** 订单id */
  invoice_id: string | number;
  /** 订单金额 */
  amount: string | number;
}
export interface IAlipayQrcodeResult {
  /** 支付二维码链接 */
  qrcode: string;
  /** 支付网关单号 */
  pid: string;
  /** 接口状态 */
  ret: number;
}
export const getAlipayQrcode = (data: {
  invoice_id: string | number;
  amount: string;
}) => {
  return request.post("/user/payment/purchase/f2f", data);
};

/**
 * 支付宝 查询支付的状态
 * @param pid: 支付id
 */
export const getAlipayStatus = (pid: string | number) => {
  const formData = new FormData();
  formData.append("pid", String(pid));
  return request.post("/payment/status/f2f", formData);
};

/**
 * Stripe支付
 */
export interface IStripeParams {
  /** 订单id */
  invoice_id: string | number;
  /** 订单金额 */
  price: string | number;
  /**8位订单随机码（例如：cd21f237，每次点支付随机生成）*/
  pid: string | number;
}
export const stripePayment = (data: IStripeParams) => {
  return request.post("/user/payment/purchase/stripe", data);
};
/**
 * Stripe查询订单支付状态
 * @param data { pid: 支付id }
 */
export const getStripeStatus = (pid: string | number) => {
  const formData = new FormData();
  formData.append("pid", String(pid));
  return request.post("/payment/status/stripe", formData);
};
