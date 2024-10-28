/*
 * @Date: 2024-10-15 15:47:15
 * @LastEditors: lixuedan
 * @FilePath: /electron/menu.ts
 * @Description: 菜单管理
 */

import { app, Menu, MenuItemConstructorOptions } from "electron";

/**
 * 创建应用菜单
 */
export function setupMenu() {
  type MenuItemsType = MenuItemConstructorOptions[];
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
          click: () => {
            console.log("New");
            app.quit();
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
          label: "全选",
          accelerator: "CmdOrCtrl+A",
          role: "selectAll",
        },
      ],
    },
  ];
  const menu: Electron.Menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
