/*
 * @Date: 2024-10-15 22:42:36
 * @LastEditors: lixuedan
 * @FilePath: /src/utils/yohub.store.ts
 * @Description: 本地存储
 */
import { connectionStatusMap } from "@/pages/home/config";
declare global {
  interface Window {
    $Yohub: any;
  }
}

export function getCookie(name: string): string | null {
  // 将cookie字符串分割成单独的cookie项
  const cookies = document.cookie.split("; ");

  // 遍历cookie项，找到匹配的cookie
  for (const cookie of cookies) {
    // 分割cookie的键和值
    const [cookieName, cookieValue] = cookie.split("=");

    // 如果找到匹配的cookie名称，返回其值
    if (cookieName === name) {
      return cookieValue;
    }
  }

  // 如果没有找到，返回null
  return null;
}
export function setCookie(name: string, value: string, expires?: Date): void {
  let cookieString = `${name}=${value}`;
  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }
  document.cookie = cookieString;
}
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
export function clearCookies(): void {
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });
}

export function getLocalStorage(key: string): any {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
export function setLocalStorage(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}
export function deleteLocalStorage(key: string): void {
  localStorage.removeItem(key);
}
export function clearLocalStorage(): void {
  localStorage.clear();
}
export function clearAllStorage(): void {
  clearCookies();
  clearLocalStorage();
  clearSessionStorage();
}

export function getSessionStorage(key: string): any {
  const value = sessionStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
export function setSessionStorage(key: string, value: any): void {
  sessionStorage.setItem(key, JSON.stringify(value));
}
export function deleteSessionStorage(key: string): void {
  sessionStorage.removeItem(key);
}
export function clearSessionStorage(): void {
  sessionStorage.clear();
}

/*********************************************************
 * 基础存储方法
 * @description：本地文件持久化存储
 *********************************************************/
/**
 * 设置本地存储
 */
export function setStore(key: string, value: any): void {
  window.$Yohub.$store("set", { key, value });
}
/**
 * 获取本地存储
 * @param key
 */
export async function getStore(key: string): Promise<any> {
  return await window.$Yohub.$store("get", key);
}
export async function deleteStore(key: string): Promise<boolean> {
  return await window.$Yohub.$store("delete", key);
}

/*********************************************************
 * 业务数据存储
 * @description：根据业务需求进行存储操作
 *********************************************************/
/**
 * 订阅 数据存储操作
 */
export const subConfig = () => {
  function get() {
    return getStore("config");
  }
  async function set(data: any) {
    return await setStore("config", data);
  }
  function del() {
    return deleteStore("config");
  }
  return { get, set, del };
};

/**
 * 连接状态 数据存储操作
 * @returns {string} 连接状态
 * @description localStorage存储
 */
export const connectStatus = () => {
  const DEFAULT_STATUS = connectionStatusMap.disconnected; // "disconnected"; // 默认未连接
  let _status: any | null = DEFAULT_STATUS;
  function get() {
    try {
      const __s = sessionStorage.getItem("connectStatus");
      if (__s) _status = JSON.parse(__s);
      return _status;
    } catch (error) {
      return DEFAULT_STATUS;
    }
  }
  function set(status: any) {
    _status = status;
    sessionStorage.setItem("connectStatus", JSON.stringify(status));
  }
  function del() {
    _status = DEFAULT_STATUS;
    sessionStorage.removeItem("connectStatus");
  }
  get();
  return {
    status: _status,
    get,
    set,
    del,
  };
};
