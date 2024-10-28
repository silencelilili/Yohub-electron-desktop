/*
 * @Date: 2024-10-15 22:42:36
 * @LastEditors: lixuedan
 * @FilePath: /src/utils/yohub.store.ts
 * @Description: 本地存储
 */
import { db } from "./dbdexie";
import type { IBookMarkItem, IHistoryItem } from "./dbdexie";

declare global {
  interface Window {
    $Yohub: any;
  }
}

/*********************************************************
 * 基础存储方法
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

/*********************************************************
 * 操作收藏存储数据
 *********************************************************/

/**
 * 新增收藏
 */
export function addCollect(data: any): void {
  setStore("addCollect", data);
}

/**
 * 移除收藏
 */
export function removeCollect(data: any): void {
  setStore("removeCollect", data);
}

/**
 * 收藏列表获取
 */
export async function getCollectList(): Promise<any> {
  return await getStore("collectList");
}

// ============================================
// 获取收藏列表
export async function getCollectPageList(): Promise<IBookMarkItem[]> {
  return await db.bookMarkList.toArray();
}
// 收藏网页
export async function setCollectPage(data: IBookMarkItem): Promise<any> {
  const createTime = new Date().getTime().toString() as string;
  const _data: IBookMarkItem = { ...data, createTime };
  return await db.bookMarkList.add(_data);
}
// 根据url获取收藏的网页
export async function getCollectPageByUrl(url: string): Promise<any> {
  return await db.bookMarkList.where({ url }).first();
}
// 根据url取消收藏
export async function removeCollectPage(url: string): Promise<any> {
  return await db.bookMarkList.where("url").equals(url).delete();
}

// =============================================
// 写入一条历史记录
export async function setHistoryPage(data: IHistoryItem): Promise<any> {
  const createTime = new Date().getTime().toString() as string;
  const _data: IHistoryItem = { ...data, createTime };
  return await db.historyList.add(_data);
}

// 获取历史记录
export async function getHistoryPageList(): Promise<IHistoryItem[]> {
  return await db.historyList.orderBy("createTime").reverse().toArray();
}
// 获取一周内的历史记录
export async function getHistoryPageListByWeek(): Promise<IHistoryItem[]> {
  const oneWeek = new Date(Date.now() - 60 * 60 * 1000 * 24 * 7).getTime();
  return await db.historyList.where("createTime").above(oneWeek).toArray();
}
// 删除超过一个月的历史记录
export async function removeHistoryPageListByMonth(): Promise<any> {
  const oneMonth = new Date(Date.now() - 60 * 60 * 1000 * 24 * 30).getTime();
  return await db.historyList.where("createTime").below(oneMonth).delete();
}
//  清除历史记录
export async function clearHistoryList(): Promise<any> {
  return await db.historyList.clear();
}
