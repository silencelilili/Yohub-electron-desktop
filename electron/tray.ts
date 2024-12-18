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
} from "electron";
import { convertByte, isMac } from "./utils";
import { join } from "node:path";
import { restoreMainWindow } from "./window";

let tray: Tray | null = null;

/**
 * 初始化系统托盘。
 *
 * @param mainWindow - 主窗口对象，用于在托盘菜单中显示主窗口。
 * @returns 初始化后的托盘对象。
 */
export function setupTray(mainWindow: BrowserWindow | null) {
  console.log("[tray] setupTray");
  // 托盘图标，TODO: 适配不同主题色
  const iconPath = isMac
    ? join(__dirname, "../build/icons/trayIconTemplate.png")
    : join(__dirname, "../build/icons/icon.ico");

  // 托盘菜单
  const template: MenuItemConstructorOptions[] = [
    // {
    //   label: "上传0.0kb/s",
    // },
    // {
    //   label: "下载0.0kb/s",
    // },
    // {
    //   type: "separator",
    // },
    {
      label: "启动加速",
      click: () => {},
    },
    {
      label: "显示YoHub",
      click: () => {
        console.log("[tray] 显示YoHub", mainWindow);
        restoreMainWindow();
      },
    },
    {
      label: "退出",
      click: async () => {
        console.log("[tray] 退出");
        await session.defaultSession.clearCache();
        app.quit();
      },
    },
  ];
  const _tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate(template);

  _tray.setToolTip("YoHub");
  _tray.setTitle("0.0kb/s 0.0kb/s", { fontType: "monospacedDigit" });
  _tray.setContextMenu(contextMenu);
  tray = _tray;
  return _tray;
}

/**
 * 更新系统托盘的显示，以反映当前的上传和下载速度。
 *
 * @param up - 当前的上传速度，以 kb/s 为单位。
 * @param down - 当前的下载速度，以 kb/s 为单位。
 */

export function updateTray(data: any) {
  if (!!data) {
    const _up = convertByte(data?.diffUp) || "0.00kb";
    const _down = convertByte(data?.diffDown) || "0.00kb";
    // 如果托盘对象存在，则更新其标题以显示新的上传和下载速度。
    tray?.setTitle(`${_up}/s ${_down}/s`);
  } else {
    tray?.setTitle("0.0kb/s 0.0kb/s");
  }
}
