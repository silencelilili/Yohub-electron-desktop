/*
 * @Date: 2024-10-15 21:48:42
 * @LastEditors: lixuedan
 * @FilePath: /electron/window.ts
 * @Description: 创建主窗口
 */
import { BrowserWindow, session } from "electron";
import path from "node:path";
import {
  eventKey,
  getPreloadPath,
  getSendEventJS,
  handleOnWebRequest,
  handleOpenWindow,
  startDevToolsIfNeed,
} from "./utils";
import { YohubEventBus } from "./event-bus";

// import { registerContextMenu } from './context-menu';
// import remote from '@electron/remote/main'
// require('@electron/remote/main').initialize()
// remote.initialize()

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export let mainWindow: BrowserWindow;
export function createWindow() {
  const win = new BrowserWindow({
    width: 1080,
    height: 700,
    center: true,
    // frame: false,
    // titleBarStyle: "hiddenInset",
    resizable: false,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: true,
      // webSecurity: false,
    },
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }

  const handler = (data: any) => {
    win.webContents?.executeJavaScript(getSendEventJS(eventKey, data));
  };
  YohubEventBus.shared.subscribe(handler);

  // handleOnWebRequest(win.webContents)

  // 拦截打开 new window 事件
  // handleOpenWindow(win.webContents);

  startDevToolsIfNeed(win.webContents, true);

  mainWindow = win;
  // remote.enable(mainWindow.webContents);
  return win;
}

export function restoreMainWindow() {
  if (!mainWindow?.isDestroyed()) {
    mainWindow?.restore();
    mainWindow?.show();
  }
}
