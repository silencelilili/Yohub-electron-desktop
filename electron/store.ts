/*
 * @Date: 2023-12-28 16:30:09
 * @LastEditors: lixuedan
 * @FilePath: /electron/store.ts
 * @Description: 存储管理
 */
import { ipcMain } from "electron";
import Store from "electron-store";
interface IStoreParamsData {
  key?: string;
  value?: any;
}
export class StoreService {
  private static instance: StoreService;

  static get shared(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  public init() {
    ipcMain.handle(
      "store:store",
      async (event: any, type: string, params: IStoreParamsData | string) => {
        // const type = params['type']
        // const data = params['data']
        // console.log(type);
        const func = functionMap[type];
        if (!func) {
          throw new Error(type + " 方法未实现");
        }
        return func(event, params);
      }
    );
  }
}
const store = new Store({ name: "yohub-store" });

const setStore = (_event: any, { key = "", value = null }): void => {
  // console.log("[store] setStore=====>", key, value);
  store.set(key, value);
};
const getStore = (_event: any, key = "") => {
  const _res = store.get(key);
  _event.returnVale = _res || "";
  return _res;
};
const hasStore = (_event: any, key = ""): boolean => {
  const _res = store.has(key);
  return _res;
};
const resetStore = (_event: any, keys: string[]): void => {
  store.reset(keys as any);
};
const clearStore = (_event: any): void => {
  store.clear();
};
const deleteStore = (_event: any, key = ""): void => {
  store.delete(key);
};

const functionMap: any = {
  set: setStore,
  get: getStore,
  reset: resetStore,
  delete: deleteStore,
  has: hasStore,
  clear: clearStore,
};
export { store };
