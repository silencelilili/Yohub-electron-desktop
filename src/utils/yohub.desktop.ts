/*
 * @Date: 2024-10-15 22:42:36
 * @LastEditors: lixuedan
 * @FilePath: /src/utils/yohub.desktop.ts
 * @Description: 头部注释
 */
import { YohubEventManager } from "./event-manager";
import bus from "./bus";
declare global {
  interface Window {
    $Yohub: any;
  }
}

export function connect(data: any) {
  window.$Yohub.$desktop({ type: "connect", data });
}
export function disconnect() {
  window.$Yohub.$desktop({ type: "disconnect" });
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

/**
 * 「监听」创建 Tab
 */
export function onCreateTab(source: any, callback: (id: number) => void): any {
  YohubEventManager.shared.on(source, "desktop.onCreateTab", ({ id }) => {
    console.log(`「监听」创建 Tab, id:${id}}`);
    callback(id);
  });
}
/**
 * 「监听」Tab Url发生变化
 */
export function onReplaceTab(source: any, callback: (id: number) => void): any {
  YohubEventManager.shared.on(source, "desktop.onReplaceTab", ({ id, url }) => {
    alert(`「监听」Tab Url发生变化, id:${id}, url: ${url}`);
    callback(id);
  });
}
/**
 * 「监听」切换 Tab
 */
export function onSwitchTab(source: any, callback: (id: number) => void): any {
  YohubEventManager.shared.on(source, "desktop.onSwitchTab", ({ id }) => {
    console.log(`「监听」切换 Tab, id:${id}}`);
    callback(id);
  });
}

/**
 * 「监听」关闭 Tab
 */
export function onCloseTab(source: any, callback: (id: number) => void): any {
  YohubEventManager.shared.on(source, "desktop.onCloseTab", ({ id }) => {
    callback(id);
  });
}

/**
 * 「监听」Tab Title 变化
 */
export function onTabTitle(
  source: any,
  callback: (id: number, title: string, url: string, iconUrl?: string) => void
): any {
  YohubEventManager.shared.on(
    source,
    "desktop.onTabTitle",
    ({ id, title, url, iconUrl }) => {
      // console.log(`「监听」Tab Title 变化`, { id, title, url, iconUrl })
      callback(id, title, url, iconUrl);
    }
  );
}

/**
 * 「监听」Tab Url/Title/Icon变化
 */
export function onTabInfoChanged(source: any, callback: any): any {
  YohubEventManager.shared.on(source, "desktop.onTabInfoChanged", (data) => {
    callback(data);
  });
}
/**
 * 「监听」Tab 加载完成
 */
export function onTabFinish(
  source: any,
  callback: (id: number, title: string, url: string, iconUrl?: string) => void
): any {
  YohubEventManager.shared.on(
    source,
    "desktop.onTabFinish",
    ({ id, title, url, iconUrl }) => {
      callback(id, title, url, iconUrl);
    }
  );
}
/**
 * 「监听」Tab 加载失败
 */
export function onTabFail(source: any, callback: any): any {
  YohubEventManager.shared.on(source, "desktop.onTabFail", (data) => {
    callback(data);
  });
}

/**
 * 「监听」新建书签栏文件夹
 * @param item
 */
export function onNewMarkBookFolder(source: any, callback: any): void {
  YohubEventManager.shared.on(source, "desktop.onNewMarkBookFolder", () => {
    callback();
  });
}

// 书签收藏
export function setPageInfo(item: any) {
  bus.emit("page-info", item);
}

// 书签收藏
export function changeCollect(item: any) {
  bus.emit("change-collect", item);
}
