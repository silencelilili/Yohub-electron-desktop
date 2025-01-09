/*
 * @Date: 2024-10-15 15:47:15
 * @LastEditors: lixuedan
 * @FilePath: /electron/menu.ts
 * @Description: 应用菜单管理
 */

import {
  app,
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  session,
} from "electron";
import { quitApp } from "./utils";

/**
 * 初始化应用菜单
 *
 * 这个函数创建了一个包含多个菜单项的模板，每个菜单项都有一个标签和一个子菜单，
 * 子菜单中包含了一些操作选项，如撤销、重做、剪切、复制、粘贴和全选。这些操作选项
 * 通常用于文本编辑或其他类型的数据操作。
 * @returns 初始化后的菜单对象。
 */
let _mainWindow: BrowserWindow | null = null;
export function setupMenu(mainWindow: BrowserWindow | null) {
  type MenuItemsType = MenuItemConstructorOptions[];
  _mainWindow = mainWindow;
  const template: MenuItemsType = [
    {
      label: "app",
      submenu: [
        {
          label: "关于",
          click: () => {
            app.showAboutPanel();
          },
        },
        {
          label: "退出",
          click: async () => {
            console.log("[menu] 退出");
            await quitApp();
          },
        },
      ],
    },
    {
      label: "编辑",
      submenu: [
        {
          label: "撤销",
          accelerator: "CmdOrCtrl+Z",
          role: "undo",
        },
        {
          label: "重做",
          accelerator: "Shift+CmdOrCtrl+Z",
          role: "redo",
        },
        {
          type: "separator",
        },
        {
          label: "剪切",
          role: "cut",
        },
        {
          label: "复制",
          accelerator: "CmdOrCtrl+C",
          role: "copy",
        },
        {
          label: "粘贴",
          accelerator: "CmdOrCtrl+V",
          role: "paste",
        },
        {
          label: "开发者工具",
          click: () => {
            console.log("[menu] 开发者工具");
            if (_mainWindow) _mainWindow.webContents.openDevTools();
          },
        },
      ],
    },
  ];
  const menu: Electron.Menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
