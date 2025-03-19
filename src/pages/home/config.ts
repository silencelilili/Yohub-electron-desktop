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
  proxy: {
    key: "proxy",
    value: true,
    name: "影音模式",
    desc: "加速主流流媒体服务",
    img: new URL(`@/assets/images/home/mode-policy@2x.png`, import.meta.url)
      .href,
  },
  global: {
    key: "global",
    value: false,
    name: "全局模式（RC）",
    desc: "加速常见网络游戏及部分客户端应用",
    img: new URL(`@/assets/images/home/mode-global@2x.png`, import.meta.url)
      .href,
  },
};

// 节点类型
enum NodeClass {
  /** 免费线路 */
  FREE = 0,
  /** 高速专线 */
  SPECIAL = 1,
  /** 游戏专线 */
  GAMES = 2,
}
// 节点组别
export enum NodeGroup {
  /** 0 中国大陆 */
  "中国大陆",
  /** 1 中国香港 */
  "中国香港",
  /** 2 美国 */
  "美国",
}

const DEFAULT_GROUPS = {
  [NodeGroup["中国大陆"]]: {
    name: "中国大陆",
    value: NodeGroup["中国大陆"],
    nodes: [],
    checked: false,
    disabled: true,
  },
  [NodeGroup["中国香港"]]: {
    name: "中国香港",
    value: NodeGroup["中国香港"],
    nodes: [],
    checked: false,
    disabled: true,
  },
  [NodeGroup["美国"]]: {
    name: "美国",
    value: NodeGroup["美国"],
    nodes: [],
    checked: false,
    disabled: true,
  },
};

export const NodesMap = {
  [NodeClass.FREE]: {
    name: "免费线路",
    desc: "免费线路，仅支持中国大陆地区",
    value: "free",
    groups: {
      ...DEFAULT_GROUPS,
    },
    nodes: [],
  },
  [NodeClass.SPECIAL]: {
    name: "高速专线",
    desc: "备用线路，仅支持中国大陆地区",
    value: "special",
    groups: {
      ...DEFAULT_GROUPS,
    },
    nodes: [],
  },
  [NodeClass.GAMES]: {
    name: "游戏专线",
    desc: "备用线路，仅支持中国大陆地区",
    value: "games",
    groups: {
      ...DEFAULT_GROUPS,
    },
    nodes: [],
  },
};

export const currentLineList = [
  {
    美国: [
      {
        line: "美国1",
        node_id: 7,
        detect_target: "node5.trustmatrix.cn",
        traffic_key: "node5",
        proxy_port: "10808",
      },
      {
        line: "美国2",
        node_id: 7,
        detect_target: "node5.trustmatrix.cn",
        traffic_key: "node5",
        proxy_port: "10808",
      },
      {
        line: "美国3",
        node_id: 7,
        detect_target: "node5.trustmatrix.cn",
        traffic_key: "node5",
        proxy_port: "10808",
      },
    ],
  },
];
