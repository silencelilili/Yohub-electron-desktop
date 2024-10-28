/*
 * @Date: 2024-01-16 16:45:14
 * @LastEditors: lixuedan
 * @FilePath: /src/utils/dbdexie.ts
 * @Description: indexDB数据库
 */
import Dexie, { Table } from "dexie";

/**************************************************
 * 书签栏
 * 网页，文件夹
 *************************************************/
/** 网页 */
export interface IBookMarkItem {
  /** 记录id */
  dbId?: number;
  /** 窗口id */
  id?: number | string;
  /** 标题 */
  title: string;
  /** 地址 */
  url?: number;
  /** 图标地址 */
  iconUrl?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
  /** 是否收藏 */
  status?: boolean;
  /** 是否文件夹 */
  isFolder?: boolean;
  /** 文件夹下的内容 */
  pages?: IBookMarkItem[];
}
/** 文件夹 */
export interface IBookMarkFolder {
  /** 记录id */
  dbId?: number;
  /** 文件夹名称 */
  title: string;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime?: string;
  /** 文件夹下的网页 */
  // pages: IBookMarkPage[];
}

/**************************************************
 * 历史记录
 *************************************************/
export interface IHistoryItem {
  /** 记录id */
  dbId?: number;
  /** 窗口id */
  id?: number | string;
  /** 标题 */
  title: string;
  /** 地址 */
  url: number;
  /** 图标地址 */
  iconUrl?: string;
  /** 创建时间 */
  createTime?: string;
}

export class ADGDexie extends Dexie {
  historyList!: Table<IHistoryItem>;
  bookMarkList!: Table<IBookMarkItem>;
  constructor() {
    super("AdgDatabase");
    this.version(1).stores({
      historyList: "++dbId,title,url,iconUrl,createTime",
      bookMarkList:
        "++dbId,title,url,iconUrl,createTime,updateTime,status,isFolder,pages",
    });
  }
}

export const db = new ADGDexie();
