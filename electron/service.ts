/*
 * @Date: 2024-10-15 23:19:44
 * @LastEditors: lixuedan
 * @FilePath: /electron/service.ts
 * @Description: 头部注释
 */
/* eslint-disable no-unused-vars */
import { IpcMainEvent, ipcMain } from "electron";
import { DialogService } from "./dialog";
import { ShellService } from "./shell";

export class DesktopService {
  private static instance: DesktopService;

  static get shared(): DesktopService {
    if (!DesktopService.instance) {
      DesktopService.instance = new DesktopService();
    }
    return DesktopService.instance;
  }

  public init() {
    ipcMain.handle("desktop:service", async (event: any, params?: any) => {
      const type = params["type"];
      const data = params["data"];
      const func = functionMap[type];
      if (!func) {
        throw new Error(type + " 方法未实现");
      }
      return func(event, data);
    });
    DialogService.shared.run();
  }
}

const connect = async (_event: any, data: any) => {
  console.log("[DesktopService]---connect---", data);
  ShellService.shared.connect(data);
  return {};
};

const disconnect = async (_event: any) => {
  console.log("[DesktopService]---disconnect---");
  ShellService.shared.disconnect();
  return {};
};

/**
 * 打印
 */
// function _print(data: { id: number }) {
//   // const container = this.getCurrentTabContainer()
//   const container = ContainerManager.shared.getContainer(data.id);
//   container?.print();
// }
const print = (_: IpcMainEvent, data: any) => {
  console.log("---print----", data);
};
export const functionMap: any = {
  connect: connect,
  disconnect: disconnect,
  print: print,
};
