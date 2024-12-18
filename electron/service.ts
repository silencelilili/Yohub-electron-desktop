/*
 * @Date: 2024-10-15 23:19:44
 * @LastEditors: lixuedan
 * @FilePath: /electron/service.ts
 * @Description: 头部注释
 */
/* eslint-disable no-unused-vars */
import { IpcMainEvent, ipcMain } from "electron";
import { DialogService } from "./dialog";
import { ShellService } from "./shell";
import { updateTray } from "./tray";
import { YohubEventBus } from "./event-bus";
import { login } from "./net";

export class DesktopService {
  private static instance: DesktopService;

  static get shared(): DesktopService {
    if (!DesktopService.instance) {
      DesktopService.instance = new DesktopService();
    }
    return DesktopService.instance;
  }

  public init() {
    ipcMain.handle("desktop:service", async (event: any, params?: any) => {
      const type = params["type"];
      const data = params["data"];
      const callback = params["callback"];
      const func = functionMap[type];
      if (!func) {
        throw new Error(type + " 方法未实现");
      }
      return func(event, data, callback);
    });
    DialogService.shared.run();
  }
}
let prevData: any = null;
/**
 * 启动xray
 * @param _event
 * @returns
 */
const _startXray = async (_event: any) => {
  console.log("[DesktopService]---startXray---");
  ShellService.shared.startXray();
  return {};
};
const _stopXray = async (_event: any) => {
  console.log("[DesktopService]---stopXray---");
  ShellService.shared.stopXray();
  return {};
};
/**
 * 连接
 * @param _event
 * @param data
 * @returns
 */
const _connect = async (_event: any, data: any) => {
  console.log("[DesktopService]---connect---", data);
  ShellService.shared.connect(data);
  prevData = null;
  return {};
};
/**
 * 断开连接
 * @param _event
 * @returns
 */
const _disconnect = async (_event: any) => {
  console.log("[DesktopService]---disconnect---");
  ShellService.shared.disconnect();
  prevData = null;
  updateTray(null);
  return {};
};
/**
 * 获取流量
 * @param _event
 * @returns
 */
const _getTraffic = async (_event: any) => {
  console.log("[DesktopService]---getTraffic---");
  const _data = await ShellService.shared.getTraffic();
  // _event.sender.send("traffic-result", __data);
  const __data = calculateValueDiff(_data, prevData);
  updateTray(__data);
  prevData = _data;
  return __data;
};
/**
 * 根据总流量计算实时流量
 * @param curr
 * @param prev
 * @returns
 */
const calculateValueDiff = (curr: any, prev: any) => {
  const prevUplinkValue: number = (prev && prev?.up?.value) || 0;
  const prevDownlinkValue: number = (prev && prev?.down?.value) || 0;

  const currentUplink: number = curr?.up?.value || 0;
  const currentDownlink: number = curr?.down?.value || 0;

  console.log(
    `prev: prevUplinkValue: ${prevUplinkValue}, prevDownlinkValue: ${prevDownlinkValue}`
  );
  console.log(
    `curr: currentUplink: ${currentUplink}, currentDownlink: ${currentDownlink}`
  );
  let uplinkDiff = 0;
  let downlinkDiff = 0;

  // if (prevUplinkValue !== null && currentUplink !== undefined) {
  uplinkDiff = currentUplink - prevUplinkValue;
  // }
  // if (prevDownlinkValue !== null && currentDownlink !== undefined) {
  downlinkDiff = currentDownlink - prevDownlinkValue;
  // }
  console.log(`diff: uplinkDiff: ${uplinkDiff}, downlinkDiff: ${downlinkDiff}`);
  return {
    diffUp: uplinkDiff,
    diffDown: downlinkDiff,
    totalUp: currentUplink,
    totalDown: currentDownlink,
  };
};

/**
 * 获取延迟时长
 * @param _event
 * @param data
 * @returns
 */
async function _getLatency(_event: any, data?: any) {
  console.log("[DesktopService]---getTraffic---");
  const _data = await ShellService.shared.getLatency(data?.host);
  return _data;
}

async function _writeConfig(_event: any, data: any) {
  console.log("[DesktopService]---writeConfig---", data);
  ShellService.shared.writeConfig(data);
  return {};
}

/**
 * 打印
 */
// function _print(data: { id: number }) {
//   // const container = this.getCurrentTabContainer()
//   const container = ContainerManager.shared.getContainer(data.id);
//   container?.print();
// }
const _print = (_: IpcMainEvent, data: any) => {
  console.log("---print----", data);
};

const _login = (_: IpcMainEvent, data: any) => {
  return login(data);
};
export const functionMap: any = {
  startXray: _startXray,
  stopXray: _stopXray,
  connect: _connect,
  disconnect: _disconnect,
  print: _print,
  getTraffic: _getTraffic,
  getLatency: _getLatency,
  writeConfig: _writeConfig,
  mainLogin: _login,
};
