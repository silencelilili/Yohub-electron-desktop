// import { useLocale } from "@/hooks/useLocale";
// const { t } = useLocale();

// 连接状态 枚举
export enum connectionStatusEnum {
  /** 连接中 */
  CONNECTING = "connecting",
  /** 已连接 */
  CONNECTED = "connected",
  /** 未连接/已断开 */
  DISCONNECTED = "disconnected",
}
// 连接状态
export const connectionStatusMap = {
  [connectionStatusEnum.CONNECTING]: {
    status: connectionStatusEnum.CONNECTING,
    text: "home.connecting",
    className: "dot-online dot-loading",
    tips: "home.connectingTips",
  },
  [connectionStatusEnum.CONNECTED]: {
    status: connectionStatusEnum.CONNECTED,
    text: "home.connected",
    className: "dot-online",
    tips: "home.connectedTips",
  },
  [connectionStatusEnum.DISCONNECTED]: {
    status: connectionStatusEnum.DISCONNECTED,
    text: "home.disconnected",
    className: "dot-offline",
    tips: "home.disconnectedTips",
  },
};
// 订阅状态 枚举
export enum subscriptionStatusEnum {
  SUBSCRIBED = "subscribed",
  UNSUBSCRIBED = "unsubscribed",
}
export const ModeList = {
  policy: {
    key: "policy",
    value: false,
    name: "策略模式",
    desc: "仅加速常见APP和网页访问",
  },
  global: {
    key: "global",
    value: false,
    name: "全局模式",
    desc: "加速全部流量",
  },
};

export const LineList = [
  {
    label: "免费线路",
    value: "free",
    type: "group",
    children: [
      {
        label: "中国",
        desc: "免费线路，仅支持中国大陆地区",
        value: "free",
        children: [
          {
            label: "中国1",
            desc: "免费线路，仅支持中国大陆地区",
            value: "free",
            speed: 100,
          },
          {
            label: "中国2",
            desc: "备用线路，仅支持中国大陆地区",
            value: "free2",
            speed: 100,
          },
        ],
      },
      {
        label: "美国",
        desc: "备用线路，仅支持中国大陆地区",
        value: "free2",
      },
    ],
  },
  {
    label: "高速专线",
    desc: "备用线路，仅支持中国大陆地区",
    value: "free2",
    type: "group",
    children: [
      {
        label: "中国",
        desc: "免费线路，仅支持中国大陆地区",
        value: "free",
      },
      {
        label: "美国",
        desc: "备用线路，仅支持中国大陆地区",
        value: "free2",
      },
    ],
  },
  {
    label: "游戏专线",
    desc: "备用线路，仅支持中国大陆地区",
    value: "free2",
    type: "group",
    children: [
      {
        label: "中国",
        desc: "免费线路，仅支持中国大陆地区",
        value: "free",
      },
      {
        label: "美国",
        desc: "备用线路，仅支持中国大陆地区",
        value: "free2",
      },
    ],
  },
];
