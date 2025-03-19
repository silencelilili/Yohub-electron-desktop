/*
 * @Date: 2024-10-15 22:42:36
 * @LastEditors: lixuedan
 * @FilePath: /src/utils/yohub.desktop.ts
 * @Description: 头部注释
 */
import { YohubEventManager } from "./event-manager";
import bus from "./bus";
import { useCountry } from "../hooks/useCountry";
import { getFlag } from "@/api/user";

declare global {
  interface Window {
    $Yohub: any;
    $log: any;
  }
}

YohubEventManager.shared.register();
export function startXray(name: string) {
  const data = { name };
  window.$Yohub.$desktop({ type: "startXray", data });
}
export function stopXray() {
  window.$Yohub.$desktop({ type: "stopXray" });
}
export function startSingBox() {
  window.$Yohub.$desktop({ type: "startSingBox" });
}
export function stopSingBox() {
  window.$Yohub.$desktop({ type: "stopSingBox" });
}
export async function connect(data: { mode: string; port: string }) {
  try {
    const response = await window.$Yohub.$desktop({ type: "connect", data });
    console.log(`「监听回调」connect:`, response);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}
export async function setProxy(data: { port: number | string }) {
  try {
    const response = await window.$Yohub.$desktop({ type: "setProxy", data });
    console.log(`「监听回调」setProxy`, response);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}
export async function disconnect() {
  try {
    const response = await window.$Yohub.$desktop({ type: "disconnect" });
    console.log(`「监听回调」disconnect:`, response);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}
export function getTraffic(lineName: string) {
  const response = window.$Yohub.$desktop({
    type: "getTraffic",
    data: lineName,
  });
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
    bus.emit("latency-result", data[0]);
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
export function writeConfig(data: any, fileName: "proxy" | "global") {
  const _data = { data, fileName };
  window.$Yohub.$desktop({ type: "writeConfig", data: _data });
}
/**
 * 获取当前IP信息
 */
export async function getIpInfo() {
  if (process.env.NODE_ENV === "development") {
    return;
  }
  const { data } = await getFlag();
  if (data.country === "China") {
    useCountry().open(() => {
      quitApp();
    });
  }
  // const response = window.$Yohub.$desktop({ type: "getIpInfo" });
  // response.then((data: any) => {
  //   console.log(`「监听回调」IP信息getIpInfo`, data);
  //   if (process.env.NODE_ENV === "development") {
  //     return;
  //   }
  //   if (data.country === "CN") {
  //     useCountry().open(() => {
  //       quitApp();
  //     });
  //   }
  // });
}
/**
 * 获取流量记录文件内容
 * @param callback
 */
export function getTrafficRecord(callback: Function) {
  const response = window.$Yohub.$desktop({ type: "getTrafficRecord" });
  response
    .then((data: any) => {
      console.log(`「监听回调」流量记录getTrafficRecord`, data);
      if (data) {
        callback(data);
      } else {
        const visitData: any = {};
        const today = new Date().toISOString().split("T")[0]; // 获取当前日期
        if (!visitData[today]) {
          visitData[today] = [0, 0];
        }
        callback(visitData);
      }
      // bus.emit("traffic-record-result", data);
    })
    .catch((err: any) => {
      console.log(`「监听回调」流量记录getTrafficRecord Error`, err);
      const visitData: any = {};
      const today = new Date().toISOString().split("T")[0]; // 获取当前日期
      if (!visitData[today]) {
        visitData[today] = [0, 0];
      }
      callback(visitData);
      // bus.emit("traffic-record-result", err);
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
export async function newPingAddress(address: string | string[]) {
  try {
    const response = await window.$Yohub.$desktop({
      type: "pingAddress",
      data: address,
    });
    const _latency = Number(response[0]?.latency) || 0;
    console.log(`「监听回调」地址延迟探测 newPingAddress`, address, _latency);
    return Promise.resolve(_latency);
  } catch (error) {
    return Promise.reject(error);
  }
}
export async function pingAddress(
  address: string | string[],
  callback: Function
) {
  const response = window.$Yohub.$desktop({
    type: "pingAddress",
    data: address,
  });
  response.then((data: any) => {
    callback(data);
    console.log(`「监听回调」pingAddress`, data);
  });
}

/**
 * 设置是否开机自启动
 */
export function setAutoLaunch(isAutoLaunch: boolean) {
  window.$Yohub.$desktop({ type: "setAutoStart", data: isAutoLaunch });
}
/**
 * 获取文件MD5
 * @param name
 * @returns
 */
export async function getMd5(name: string) {
  try {
    const response = await window.$Yohub.$desktop({
      type: "getMd5",
      data: name,
    });
    console.log(`「监听回调」获取文件MD5`, name, response);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function downloadFile(url: string) {
  return window.$Yohub.$desktop({ type: "downloadFile", data: { url } });
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

export function clearAppCookies() {
  console.log("clearAppCookies");
  return window.$Yohub.$desktop({ type: "clearAppCookies" });
}
export function handleWindow(type: string) {
  return window.$Yohub.$desktop({ type: "handleWindow", data: type });
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
