// 订阅方式
export const subscribeList = [
  {
    id: 1,
    name: "年卡 365天",
    price: "0.01", // 现在的价格
    originalPrice: "576", // 原价
    unitPrice: "¥24/月", // 单价
    content: ["免费使用", "支持自定义域名"],
  },
  {
    id: 2,
    name: "半年卡 92天",
    price: "96", // 现在的价格
    originalPrice: "192", // 原价
    unitPrice: "¥32/月", // 单价
    content: ["免费使用", "支持自定义域名"],
  },
  {
    id: 3,
    name: "季卡 92天",
    price: "96", // 现在的价格
    originalPrice: "192", // 原价
    unitPrice: "¥32/月", // 单价
    content: ["免费使用", "支持自定义域名"],
  },
  {
    id: 4,
    name: "月卡 31天",
    price: "40", // 现在的价格
    originalPrice: "80", // 原价
    unitPrice: "¥40/月", // 单价
    content: ["免费使用", "支持自定义域名"],
  },
  {
    id: 5,
    name: "100GB流量卡 不限时",
    price: "25", // 现在的价格
    originalPrice: "50", // 原价
    unitPrice: "¥0.25/GB", // 单价
    content: ["免费使用", "支持自定义域名"],
  },
  {
    id: 6,
    name: "500GB流量卡 不限时",
    price: "25", // 现在的价格
    originalPrice: "50", // 原价
    unitPrice: "¥0.25/GB", // 单价
    content: ["免费使用", "支持自定义域名"],
  },
  {
    id: 7,
    name: "1TB流量卡 不限时",
    price: "25", // 现在的价格
    originalPrice: "50", // 原价
    unitPrice: "¥0.25/GB", // 单价
    content: ["免费使用", "支持自定义域名"],
  },
];

// 支付方式
export const paymentOptions = [
  {
    label: "微信支付",
    value: "wechat",
    key: "wechat",
    icon: "pay-wechat.png",
  },
  {
    label: "支付宝",
    value: "alipay",
    key: "f2f",
    icon: "pay-ali.png",
  },
  // {
  //   label: "PayPal",
  //   value: "paypal",
  //   icon: "pay-pal.png",
  // },
  {
    label: "Stripe",
    value: "stripe",
    key: "stripe",
    icon: "pay-stripe.png",
  },
  {
    label: "余额支付",
    value: "balance",
    key: "banner",
    icon: "pay-balance.png",
  },
];
export const paymentOptionsMap = {
  wechat: {
    label: "微信支付",
    value: "wechat",
    key: "wechat",
    icon: "pay-wechat.png",
    img: new URL(`@/assets/images/pay-wechat.png`, import.meta.url).href,
  },
  f2f: {
    label: "支付宝",
    value: "alipay",
    key: "f2f",
    icon: "pay-ali.png",
    img: new URL(`@/assets/images/pay-ali.png`, import.meta.url).href,
  },
  stripe: {
    label: "Stripe",
    value: "stripe",
    key: "stripe",
    icon: "pay-stripe.png",
    img: new URL(`@/assets/images/pay-stripe.png`, import.meta.url).href,
  },
  balance: {
    label: "余额支付",
    value: "balance",
    key: "banner",
    icon: "pay-balance.png",
    img: new URL(`@/assets/images/pay-balance.png`, import.meta.url).href,
  },
};
export interface IProductItem {
  id: number | null;
  name: string;
  price: string;
  originalPrice?: string;
  unitPrice?: string;
  content?: string[];
  status?: number;
  type?: string;
  limit?: string;
  create_time?: string;
  [x: string]: any;
}
/**
 * 订单状态的枚举：
 * 'pending_payment' => '等待中',
    'pending_activation' => '待激活',
    'activated' => '已激活',
    'expired' => '已过期',
    'cancelled' => '已取消',
    default => '未知',
 */
export type TOrderStatus =
  | "pending_payment"
  | "pending_activation"
  | "activated"
  | "cancelled"
  | "default";
