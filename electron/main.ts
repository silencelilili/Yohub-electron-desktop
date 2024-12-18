/*
 * @Date: 2024-10-15 16:23:40
 * @LastEditors: lixuedan
 * @FilePath: /electron/main.ts
 * @Description: 主进程
 */
import { app, BrowserWindow, session } from "electron";
import path from "node:path";
import { createWindow, restoreMainWindow, mainWindow } from "./window";
import { DesktopService } from "./service";
import { StoreService } from "./store";
// import { loadExtension } from "./utils";
import ProtocolService from "./protocol";
import { setupMenu } from "./menu";
import { setupTray } from "./tray";
import useCookie from "./useCookie";

// The built directory structure

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

ProtocolService.setDefaultProtocol();

// 请求单例锁，避免打开多个electron实例
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

// 忽略证书相关错误 在ready前使用
app.commandLine.appendSwitch("ignore-certificate-errors");
// 禁用chromium的BlockInsecurePrivateNetworkRequests特性
app.commandLine.appendSwitch(
  "disable-features",
  "BlockInsecurePrivateNetworkRequests"
);
// app.commandLine.appendSwitch("disable-site-isolation-trials");
// 如果有第二个实例 将重启应用
app.on("second-instance", () => {
  restoreMainWindow();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  console.log("[appPath.userData]:::::::", app.getPath("userData"));
  // 通信
  DesktopService.shared.init();
  StoreService.shared.init();

  // 创建窗口
  createWindow();

  // 自定义协议
  const partition = session.fromPartition("persist:view");
  ProtocolService.registerStringProtocol(partition);
  // console.log("[session] partition", partition);

  // 菜单
  setupMenu(mainWindow);

  useCookie(mainWindow);
  // 托盘
  setupTray(mainWindow);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
