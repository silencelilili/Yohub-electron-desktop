/*
 * @Date: 2024-10-15 16:23:40
 * @LastEditors: lixuedan
 * @FilePath: /electron/main.ts
 * @Description: 主进程
 */
import { app, BrowserWindow, protocol, session } from "electron";
import path from "node:path";
import { createWindow, restoreMainWindow, mainWindow } from "./window";
import { DesktopService, downloadMap } from "./service";
import { store, StoreService } from "./store";
// import { loadExtension } from "./utils";
import ProtocolService from "./protocol";
import { setupMenu } from "./menu";
import { setupTray } from "./tray";
import useCookie from "./useCookie";
import { getXrayResourcePath, quitApp } from "./utils";
import { getSystemInfo } from "./systeminfo";
import log from "./log";

// The built directory structure

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

// 注册自定义协议
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

  getSystemInfo().then((info) => {
    store.set("systemInfo", info);
  });

  // 自定义协议
  const partition = session.fromPartition("persist:view");
  ProtocolService.registerStringProtocol(partition);
  // console.log("[session] partition", partition);

  // 处理微信扫码回调，获取到code
  protocol.registerHttpProtocol(ProtocolService.PROTOCOL_URL, (request) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (code) {
      mainWindow.webContents.send("wechat-login-callback", { code });
    }
  });

  // 菜单
  setupMenu(mainWindow);

  useCookie(mainWindow);
  // 托盘
  setupTray(mainWindow);

  // 监听下载
  const ses = session.defaultSession;
  ses.on("will-download", async (event, item) => {
    const url = new URL(item.getURL());
    const downloadId = url.searchParams.get("download_id");
    if (downloadId) {
      const info = downloadMap.get(downloadId);
      if (info) {
        const fileName = item.getFilename();
        const savePath = path.join(getXrayResourcePath(), fileName);
        try {
          item.setSavePath(savePath);
          item.once("done", (e, state) => {
            if (state === "completed") {
              mainWindow.webContents.send("download-complete", {
                path: savePath,
              });
            } else {
              log.error(`${fileName}-下载失败`);
              mainWindow.webContents.send("download-error", {
                error: "下载失败",
              });
            }
          });
        } catch (err) {
          log.error(`${fileName}-下载失败, 取消下载`);
          mainWindow.webContents.send("download-error", {
            error: "下载失败",
          });
          item.cancel();
        }
      }
    } else {
      item.cancel();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    quitApp();
  }
});
// 进程崩溃监听
app.on("render-process-gone", (event, webContents, details) => {
  log.error(
    `[render-process-gone]渲染器进程意外消失 Reason: ${details.reason}`
  );
});
app.on("child-process-gone", (event, details) => {
  log.error(
    `[child-process-gone]子进程意外消失 Reason: ${details.name} - ${details.type} - ${details.reason}`
  );
});
