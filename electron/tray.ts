/*
 * @Date: 2024-11-05 14:47:15
 * @LastEditors: lixuedan
 * @FilePath: /electron/tray.ts
 * @Description: 托盘菜单管理
 */

import {
  app,
  Tray,
  Menu,
  MenuItemConstructorOptions,
  BrowserWindow,
  session,
  nativeImage,
} from "electron";
import { convertByte, isMac, quitApp } from "./utils";
import { join } from "node:path";
import { restoreMainWindow } from "./window";
import { ShellService } from "./shell";
let tray: Tray | null = null;
let _mainWindow: BrowserWindow | null = null;
// 托盘菜单
let template: MenuItemConstructorOptions[] = [
  // {
  //   label: "启动加速",
  //   click: () => {
  //     console.log("[tray] 启动加速");
  //     // updateTrayMenu("connect");
  //     _mainWindow?.webContents.send("update-status", "connect");
  //   },
  // },

  {
    label: "上行: 0.0kb/s",
  },
  {
    label: "下行: 0.0kb/s",
  },
  {
    label: "显示YoHub",
    click: () => {
      restoreMainWindow();
    },
  },
  {
    label: "退出",
    click: async () => {
      console.log("[tray] 退出");
      await quitApp();
    },
  },
];

/**
 * 初始化系统托盘。
 *
 * @param mainWindow - 主窗口对象，用于在托盘菜单中显示主窗口。
 * @returns 初始化后的托盘对象。
 */
export function setupTray(mainWindow: BrowserWindow | null) {
  _mainWindow = mainWindow;
  const iconPath = isMac
    ? join(__dirname, "../build/icons/trayIconOff.png")
    : join(__dirname, "../build/icons/icon.ico");
  const _tray = new Tray(nativeImage.createFromPath(iconPath));
  // 托盘图标，TODO: 适配不同主题色
  const contextMenu = Menu.buildFromTemplate(template);
  const titleHTML = "YoHub \r上行: 0.0kb/s \r下行: 0.0kb/s";
  _tray.setToolTip(titleHTML);

  // _tray.setTitle("0.0kb/s 0.0kb/s");
  _tray.setContextMenu(contextMenu);
  tray = _tray;
  return _tray;
}
// 设置托盘图标
export function setTrayImage(imagePath: string) {
  if (tray) {
    const iconPath = isMac
      ? join(__dirname, "../build/icons/" + imagePath)
      : join(__dirname, "../build/icons/icon.ico");
    tray.setImage(nativeImage.createFromPath(iconPath));
  }
}
// 更新托盘菜单
export function updateTrayLink(data: any) {
  if (!!data) {
    const _up = convertByte(data?.diffUp) || "0.00kb/s";
    const _down = convertByte(data?.diffDown) || "0.00kb/s";

    template[0] = {
      label: "上行: " + _up + "/s",
    };
    template[1] = {
      label: "下行: " + _down + "/s",
    };

    const trayMenu = Menu.buildFromTemplate(template);
    const titleHTML = `YoHub \r上行: ${_up}/s \r下行: ${_down}/s`;
    tray?.setToolTip(titleHTML);
    tray?.setContextMenu(trayMenu);
  }
}

// ---------------------------------------------

export function updateTrayMenu(status: "connect" | "disconnect") {
  template[0] = {
    label: status === "disconnect" ? "启动加速" : "停止加速",
    click: () => {
      _mainWindow?.webContents.send("update-status", status);
      if (status === "disconnect") {
        _mainWindow?.webContents.send("update-status", "connect");
      } else {
        _mainWindow?.webContents.send("update-status", "disconnect");
      }
    },
  };
  const trayMenu = Menu.buildFromTemplate(template);
  tray?.setContextMenu(trayMenu);
}
/**
 * 更新系统托盘的显示，以反映当前的上传和下载速度。
 *
 * @param up - 当前的上传速度，以 kb/s 为单位。
 * @param down - 当前的下载速度，以 kb/s 为单位。
 */
export function updateTrayTitle(data: any) {
  if (!!data) {
    const _up = convertByte(data?.diffUp) || "0.00kb/s";
    const _down = convertByte(data?.diffDown) || "0.00kb/s";
    // 如果托盘对象存在，则更新其标题以显示新的上传和下载速度。
    tray?.setTitle(`${_up}/s ${_down}/s`);
  } else {
    tray?.setTitle("0.0kb/s 0.0kb/s");
  }
}
