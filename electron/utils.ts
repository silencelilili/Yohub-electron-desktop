/*
 * @Date: 2024-10-15 21:51:05
 * @LastEditors: lixuedan
 * @FilePath: /electron/utils.ts
 * @Description:
 */
import { app, session, WebContents, protocol } from "electron";
import path from "node:path";
import { parse } from "url";
export const eventKey: string = "BRIDGE_EVENT_KEY";

export const WEBUI_PROTOCOL = "yohub";
export const WEBUI_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173/"
    : `${WEBUI_PROTOCOL}://`;

export const WEBUI_URL_SUFFIX = WEBUI_BASE_URL.startsWith("http")
  ? ".html"
  : "";

const build_resources = () => {
  const path = app.getAppPath();
  const parts = path.split("/");
  let newParts = parts.slice(0, parts.length - 1);
  newParts.push("resources");
  return newParts.join("/");
};
export const resourcePath = () => {
  return app.isPackaged
    ? process.resourcesPath + "/resources" || build_resources()
    : path.join(__dirname, "../resources");
};

/**
 * 容器 ID 集合字段
 */
export const kContainerIdsKey = "kDesktopContainerIdsKey";

/**
 * 获取 preload 路径
 */
export function getPreloadPath() {
  return path.join(__dirname, "preload.js");
}

/**
 * 是否为Mac
 */
export const isMac = process.platform === "darwin";

/**
 * 发送事件 JS
 * @param eventName 事件名
 * @param eventData 事件内容
 */
export const getSendEventJS = (eventName: string, eventData: any) => {
  const eventDataStr = JSON.stringify(eventData);
  return `window.dispatchEvent(new CustomEvent('${eventName}', { detail: ${eventDataStr} }))`;
};

/**
 * 拦截打开 window 事件
 * @param webContents
 */
export function handleOpenWindow(webContents: WebContents): void {
  webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: "deny",
    };
  });
}

/**
 * 如果需要，开启开发工具
 * 界面操作：连击左边 control 3 次
 */
export function startDevToolsIfNeed(webContents: WebContents, isOpen = false) {
  if (!app.isPackaged) {
    let clicks = 0;
    let previousClickTime = 0;
    webContents.addListener("before-input-event", (_event, input) => {
      if (input.type === "keyDown" && input.code === "ControlLeft") {
        const now = +new Date();
        if (now - previousClickTime < 300) {
          clicks++;
        } else {
          clicks = 1;
        }
        previousClickTime = now;
        if (clicks >= 3) {
          webContents.openDevTools({
            mode: "detach",
            activate: true,
          });
          webContents.devToolsWebContents?.focus();
          clicks = 0;
        }
      }
    });

    if (isOpen) {
      webContents.openDevTools({
        mode: "detach",
        activate: true,
      });
      webContents.devToolsWebContents?.focus();
    }
  }
}

/**
 * 加载浏览器插件
 */
export function loadExtension() {
  const PLUGINS_PATH = path.join(__dirname, "../resources/vuetool_6.5.1_0");
  session.defaultSession
    .loadExtension(PLUGINS_PATH, { allowFileAccess: true })
    .then((res) => {
      console.log(`[loadExtension] Added Extension: `, res);
    })
    .catch((err) => console.log("An error occurred: ", err));
}

// webRequest
export function handleOnWebRequest(_webContents: WebContents) {
  // 创建自定义会话（Session）
  let customSession = session.fromPartition("custom-partition");

  customSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const { method = "-", url, resourceType } = details;
    console.log("[webRequest onBeforeSendHeaders]", method, resourceType, url);
    // console.log(`[requestHeaders]:${details.url}`, details.requestHeaders )
    console.log("[webRequest onBeforeSendHeaders] details:", details);
    callback({ cancel: false });
  });
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const { method = "-", url, resourceType } = details;
    // var postedString = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes)));
    if (resourceType === "xhr") {
      console.log("======================================");
      console.log("[webRequest onBeforeRequest]", method, resourceType, url);
      // console.log("======================================")
    }
    callback({ cancel: false });
  });
}
// registerFileProtocol

// 此方法只能在 app 的 ready 事件触发前调用，且只能调用一次
// 注册特权协议, 可以绕过内容安全策略
protocol.registerSchemesAsPrivileged([
  {
    scheme: WEBUI_PROTOCOL,
    privileges: {
      bypassCSP: true,
      secure: true,
      standard: true,
      supportFetchAPI: true,
      allowServiceWorkers: true,
      corsEnabled: false,
    },
  },
]);

export function registerFileProtocol(session: Electron.Session) {
  // if (process.env.NODE_ENV !== 'development') {
  session.protocol.registerFileProtocol(
    WEBUI_PROTOCOL,
    (request, callback: any) => {
      const parsed = parse(request.url) as any;
      console.log("[session.protocol] parsed:", parsed);
      if (parsed.path === "/") {
        return callback({
          path: path.join(__dirname, `${parsed.hostname}.html`),
        });
      }
      callback({ path: path.join(__dirname, parsed.path) });
    }
  );
  // }
}

/**
 * 注册自定义协议
 * @description: 唤起应用程序
 */
export function setDefaultProtocol() {
  const agreement = "adg-browser"; //  自定义协议名
  let isSet = false; // 是否注册成功
  app.removeAsDefaultProtocolClient(agreement);

  if (process.env.NODE_ENV === "development" && process.platform === "win32") {
    isSet = app.setAsDefaultProtocolClient(agreement, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  } else {
    isSet = app.setAsDefaultProtocolClient(agreement);
  }
  console.log("自定义协议是否注册成功", isSet);
}

export function convertByte(byteValue: number) {
  const kbValue = byteValue / 1024;
  if (kbValue >= 1024) {
    const mbValue = kbValue / 1024;
    return `${mbValue.toFixed(2)}MB`;
  }
  return `${kbValue.toFixed(2)}KB`;
}
