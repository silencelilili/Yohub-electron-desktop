/*
 * @Date: 2024-10-15 22:42:36
 * @LastEditors: lixuedan
 * @FilePath: /src/utils/yohub.desktop.ts
 * @Description: 头部注释
 */
import { YohubEventManager } from "./event-manager";
import bus from "./bus";
import { useCountry } from "../hooks/useCountry";

declare global {
  interface Window {
    $Yohub: any;
  }
}

YohubEventManager.shared.register();
export function startXray() {
  window.$Yohub.$desktop({ type: "startXray" });
}
export function stopXray() {
  window.$Yohub.$desktop({ type: "stopXray" });
}
export function connect(data: any) {
  window.$Yohub.$desktop({ type: "connect", data });
}
export async function disconnect() {
  try {
    const response = await window.$Yohub.$desktop({ type: "disconnect" });
    console.log(`「监听回调」disconnect:`, response);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject("disconnect失败");
  }
}
export function getTraffic() {
  const response = window.$Yohub.$desktop({ type: "getTraffic" });
  response.then((data: any) => {
    console.log(`「监听回调」实时流量getTraffic`, data);
    bus.emit("traffic-result", data);
  });
}
export function getLatency() {
  const response = window.$Yohub.$desktop({
    type: "pingAddress",
    data: "8.8.8.8",
  });
  response.then((data: any) => {
    console.log(`「监听回调」网络延迟getLatency`, data);
    const [host = "", latency = "0 ms"] = data[0].split(":_:");
    const res = {
      host,
      latency,
    };
    bus.emit("latency-result", res);
  });
}
// 未使用
export function __onTrafficResult(
  source: any,
  callback: (data: any) => void
): any {
  YohubEventManager.shared.on(source, "traffic-result", (data) => {
    console.log(`「监听」流量traffic-result`, data);
    callback(data);
  });
}
/**
 * 写入配置文件
 * @param data
 */
export function writeConfig(data: any) {
  window.$Yohub.$desktop({ type: "writeConfig", data });
}
/**
 * 获取当前IP信息
 */
export function getIpInfo() {
  const response = window.$Yohub.$desktop({ type: "getIpInfo" });
  response.then((data: any) => {
    console.log(`「监听回调」IP信息getIpInfo`, data);
    // TODO:开发阶段不用
    // if (data.country === "CN") {
    //   useCountry().open(() => {
    //     quitApp();
    //   });
    // }

    // bus.emit("ip-info-result", data);
  });
}
/**
 * 获取流量记录文件内容
 * @param callback
 */
export function getTrafficRecord(callback: Function) {
  const response = window.$Yohub.$desktop({ type: "getTrafficRecord" });
  response.then((data: any) => {
    console.log(`「监听回调」流量记录getTrafficRecord`, data);
    callback(data);
    // bus.emit("traffic-record-result", data);
  });
}

/**
 * 退出应用
 */
export function quitApp() {
  window.$Yohub.$desktop({ type: "quitApp" });
}
/**
 * 地址延迟探测
 * @param address
 * @param callback
 */
export function pingAddress(address: string | string[], callback: Function) {
  const response = window.$Yohub.$desktop({
    type: "pingAddress",
    data: address,
  });
  response.then((data: any) => {
    const _data = data
      .filter((it: string) => !!it)
      .map((item: string) => {
        const [host = "", latency = "0 ms"] = item.split(":_:");
        return {
          host,
          latency,
        };
      });
    callback(_data);
    console.log(`「监听回调」pingAddress`, _data);
  });
}

/**
 * 设置是否开机自启动
 */
export function setAutoLaunch(isAutoLaunch: boolean) {
  window.$Yohub.$desktop({ type: "setAutoStart", data: isAutoLaunch });
}
/**
 * 框架准备完毕
 */
export function frameDidReadyOnTabPage(): void {
  window.$Yohub.$desktop({ type: "frameDidReadyOnTabPage" });
}

/**
 * 打印
 */
export function handlePrint(data: any) {
  window.$Yohub.$desktop({ type: "print", data });
}

export function handleMainLogin(_data: any) {
  console.log("handleMainLogin", _data);
  return window.$Yohub.$desktop({ type: "mainLogin", data: { ..._data } });
}
// ====================== 监听主进程发送的事件 ======================
/**
 * 「监听」连接
 */
export function onConnectStatus(callback: () => void): any {
  // YohubEventManager.shared.on(source, "desktop.onConnect", () => {
  //   console.log(`「监听」「监听」连接`);
  //   callback();
  // });
}
/**
 * 「监听」断开连接
 */
export function onDisconnect(source: any, callback: Function): any {
  YohubEventManager.shared.on(source, "desktop.onDisconnect", () => {
    alert(`「监听」断开连接`);
    callback();
  });
}

// // 书签收藏
// export function setPageInfo(item: any) {
//   bus.emit("page-info", item);
// }

// // 书签收藏
// export function changeCollect(item: any) {
//   bus.emit("change-collect", item);
// }
