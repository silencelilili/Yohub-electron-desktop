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
    width: 600,
    height: 800,
    center: true,
    // frame: false,
    // titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: true,
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
}

export function restoreMainWindow() {
  mainWindow?.restore();
  mainWindow?.show();
}

// 创建历史记录窗口
export let historyWindow: BrowserWindow;
export function createHistoryWindow() {
  const child = new BrowserWindow({
    width: 320,
    height: 600,
    parent: mainWindow,
    modal: true,
    show: false,
    frame: false,
    // titleBarStyle: 'hidden',
    resizable: false,
    webPreferences: {
      preload: getPreloadPath(),
      partition: "persist:view",
    },
  });
  child.loadURL(`${VITE_DEV_SERVER_URL}history.html`);
  // const _parent = mainWindow.getBounds()
  // child.setBounds({
  //   x: _parent.width, y: _parent.y + 64
  // })
  child.once("ready-to-show", () => {
    child.show();
  });

  historyWindow = child;
}

export function closeHistoryWindow() {
  if (!!historyWindow) historyWindow.close();
}