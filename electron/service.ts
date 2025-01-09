/*
 * @Date: 2024-10-15 23:19:44
 * @LastEditors: lixuedan
 * @FilePath: /electron/service.ts
 * @Description: 暴露给渲染进程的方法
 */
/* eslint-disable no-unused-vars */
import { IpcMainEvent, app, ipcMain } from "electron";
import { DialogService } from "./dialog";
import { ShellService } from "./shell";
import { updateTrayLink } from "./tray";
import { login } from "./net";
import { quitApp } from "./utils";
import path from "path";
import fs from "fs";
import { store } from "./store";
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
  ShellService.shared.startXray();
  return {};
};
/**
 * 停用xray
 * @param _event
 * @returns
 */
const _stopXray = async (_event: any) => {
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
  ShellService.shared.connect(data);
  prevData = null;
  // updateTrayMenu("connect");

  return {};
};
/**
 * 断开连接
 * @param _event
 * @returns
 */
const _disconnect = async (_event: any) => {
  try {
    const res = await ShellService.shared.disconnect();
    prevData = null;
    // 更新托盘菜单
    updateTrayLink(null);
    // updateTrayMenu("disconnect");

    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
/**
 * 获取流量
 * @param _event
 * @returns
 */
const _getTraffic = async (_event: any) => {
  const _data = await ShellService.shared.getTraffic();
  // _event.sender.send("traffic-result", __data);
  const __data = calculateValueDiff(_data, prevData);
  // 更新托盘菜单
  updateTrayLink(__data);
  // 更新流量记录文件
  _updateTrafficRecord(__data);
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

  let uplinkDiff = 0;
  let downlinkDiff = 0;

  uplinkDiff = currentUplink - prevUplinkValue;
  downlinkDiff = currentDownlink - prevDownlinkValue;
  return {
    diffUp: uplinkDiff,
    diffDown: downlinkDiff,
    totalUp: currentUplink,
    totalDown: currentDownlink,
  };
};
/**
 * 更新流量记录
 * @param count
 * @description 每隔1分钟写入一次，最多保留7天的数据，超过7天就清空
 */
const _updateTrafficRecord = (count: {
  totalUp: number;
  totalDown: number;
}) => {
  // 假设这是获取今日访问数的函数
  const filePath = path.join(__dirname, "trafficRecord.json");
  // 读取现有数据
  fs.readFile(filePath, "utf8", (err, data) => {
    let visitData: any = {};
    if (!err) {
      visitData = JSON.parse(data);
    }

    const today = new Date().toISOString().split("T")[0]; // 获取当前日期
    if (!visitData[today]) {
      visitData[today] = [0, 0];
    }

    // 累加今日访问数
    let [up = 0, down = 0] = visitData[today];
    up += count.totalUp;
    down += count.totalDown;
    visitData[today] = [up, down];

    // 限制只保留最近7天的数据
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysKey = sevenDaysAgo.toISOString().split("T")[0];

    for (const date in visitData) {
      if (date < sevenDaysKey) {
        delete visitData[date]; // 删除超过7天的数据
      }
    }

    // 写入更新后的数据
    fs.writeFile(filePath, JSON.stringify(visitData, null, 2), (err) => {
      if (err) {
        console.error("写入文件失败:", err);
      } else {
        console.log("今日访问流量已更新:", visitData);
      }
    });
  });
};
/**
 * 获取流量记录
 * @description 用于读取trafficRecord.json文件内容，并渲染柱状图
 */
function _getTrafficRecord(_event: any) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "trafficRecord.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件失败:", err);
        reject();
        return;
      }
      const visitData = JSON.parse(data);
      console.log("访问记录:", visitData);
      resolve(visitData);
    });
  });
}

/**
 * 获取延迟时长
 * @param _event
 * @param data
 * @returns
 */
async function _getLatency(_event: any, data?: any) {
  const _data = await ShellService.shared.getLatency(data?.host);
  return _data;
}
/**
 * config配置信息写入
 * @param _event
 * @param data
 * @returns
 */
async function _writeConfig(_event: any, data: any) {
  ShellService.shared.writeConfig(data);
  return {};
}

async function _getIpInfo() {
  const res = await ShellService.shared.getIpInfo();
  return res;
}

async function _pingAddress(_event: any, data: any) {
  const res = await ShellService.shared.pingAddress(data);
  return res;
}

/**
 * 设置是否开机自启动
 * @param _event
 * @param isAutoStart
 * @description Mac系统生效；Windows系统待验证，若不生效则采用修改注册表的形式
 */
async function _setAutoStart(_event: any, isAutoStart: boolean) {
  store.set("autoLaunch", isAutoStart);
  app.setLoginItemSettings({
    openAtLogin: isAutoStart, // 设置为 true 以启用开机自启动
    openAsHidden: false, // 设置为 true 可以在启动时隐藏主窗口
  });
}
/**
 * 退出应用
 */
export function _quitApp() {
  quitApp();
}

// 测试：主进程-登录
const _login = (_: IpcMainEvent, data: any) => {
  return login(data);
};

export const functionMap: any = {
  startXray: _startXray,
  stopXray: _stopXray,
  connect: _connect,
  disconnect: _disconnect,
  getTraffic: _getTraffic,
  getLatency: _getLatency,
  writeConfig: _writeConfig,
  getIpInfo: _getIpInfo,
  pingAddress: _pingAddress,
  getTrafficRecord: _getTrafficRecord,
  setAutoStart: _setAutoStart,
  quitApp: _quitApp,
  mainLogin: _login,
};
