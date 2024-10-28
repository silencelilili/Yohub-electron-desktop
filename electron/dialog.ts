/*
 * @Date: 2024-10-19 14:25:14
 * @LastEditors: lixuedan
 * @FilePath: /electron/dialog.ts
 * @Description: 头部注释
 */
import { BrowserView, app, ipcMain } from "electron";
import { join } from "path";
import { getPreloadPath } from "./utils";
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

interface IDialogTabAssociation {
  tabId?: number;
  getTabInfo?: (tabId: number) => any;
  setTabInfo?: (tabId: number, ...args: any[]) => void;
}
type BoundsDisposition = "move" | "resize";
interface IRectangle {
  x?: number;
  y?: number;
  height?: number;
  width?: number;
}
interface IDialogShowOptions {
  name: string;
  browserWindow: Electron.BrowserWindow;
  hideTimeout?: number;
  devtools?: boolean;
  tabAssociation?: IDialogTabAssociation;
  onWindowBoundsUpdate?: (disposition: BoundsDisposition) => void;
  onHide?: (dialog: IDialog) => void;
  getBounds: () => IRectangle;
}

interface IDialog {
  name: string;
  browserView: BrowserView;
  id: number;
  tabIds: number[];
  _sendTabInfo: (tabId: number) => void;
  hide: (tabId?: number) => void;
  handle: (name: string, cb: (...args: any[]) => any) => void;
  on: (name: string, cb: (...args: any[]) => any) => void;
  rearrange: (bounds?: IRectangle) => void;
}

export const roundifyRectangle = (rect: IRectangle): IRectangle => {
  const newRect: any = { ...rect };
  Object.keys(newRect).forEach((key) => {
    if (!isNaN(newRect[key])) newRect[key] = Math.round(newRect[key]);
  });
  return newRect;
};

export class DialogService {
  private static instance: DialogService;

  static get shared(): DialogService {
    if (!DialogService.instance) {
      DialogService.instance = new DialogService();
    }
    return DialogService.instance;
  }

  public browserViews: BrowserView[] = [];
  public browserViewDetails = new Map<number, boolean>();
  public dialogs: IDialog[] = [];

  public run() {
    this.createBrowserView();
  }

  private createBrowserView() {
    const view = new BrowserView({
      webPreferences: {
        preload: getPreloadPath(),
      },
      // webPreferences: {
      //   nodeIntegration: true,
      //   contextIsolation: false,
      //   webviewTag: true,
      // },
    });

    view.webContents.loadURL("about:blank");
    this.browserViews.push(view);
    this.browserViewDetails.set(view.webContents.id, false);
    console.log("[dialog] createBrowserView");
    return view;
  }

  public show(options: IDialogShowOptions): IDialog {
    const {
      name,
      browserWindow,
      getBounds,
      devtools,
      onHide,
      hideTimeout,
      onWindowBoundsUpdate,
      tabAssociation,
    } = options;

    const foundDialog = this.getDynamic(name);

    let browserView = foundDialog
      ? foundDialog.browserView
      : this.browserViews.find(
          (x) => !this.browserViewDetails.get(x.webContents.id)
        );

    if (!browserView) {
      browserView = this.createBrowserView();
    }
    this.browserViewDetails.set(browserView.webContents.id, true);

    if (foundDialog) {
      browserWindow.addBrowserView(browserView);
      foundDialog.rearrange();
      return null;
    }

    browserWindow.addBrowserView(browserView);
    browserView.setBounds({ x: 0, y: 0, width: 1, height: 1 });

    if (devtools) {
      browserView.webContents.openDevTools({ mode: "detach" });
    }

    const tabsEvents: {
      activate?: (id: number) => void;
      remove?: (id: number) => void;
    } = {};

    const windowEvents: {
      resize?: () => void;
      move?: () => void;
    } = {};

    const channels: string[] = [];

    const dialog: IDialog = {
      browserView,
      id: browserView.webContents.id,
      name,
      tabIds: [tabAssociation?.tabId],
      _sendTabInfo: (tabId) => {
        if (tabAssociation.getTabInfo) {
          const data = tabAssociation.getTabInfo(tabId);
          browserView.webContents.send("update-tab-info", tabId, data);
        }
      },
      hide: (tabId) => {
        // const { selectedId } = appWindow.viewManager;

        // dialog.tabIds = dialog.tabIds.filter(
        //   (x) => x !== (tabId || selectedId),
        // );

        // if (tabId && tabId !== selectedId) return;

        // browserWindow.webContents.send('dialog-visibility-change', name, false);

        browserWindow.removeBrowserView(browserView);

        if (tabAssociation && dialog.tabIds.length > 0) return;

        // ipcMain.removeAllListeners(`hide-${browserView.webContents.id}`);
        channels.forEach((x) => {
          ipcMain.removeHandler(x);
          ipcMain.removeAllListeners(x);
        });

        this.dialogs = this.dialogs.filter((x) => x.id !== dialog.id);

        this.browserViewDetails.set(browserView.webContents.id, false);

        if (this.browserViews.length > 1) {
          // TODO: garbage collect unused BrowserViews?
          // this.browserViewDetails.delete(browserView.id);
          // browserView.destroy();
          // this.browserViews.splice(1, 1);
        } else {
          browserView.webContents.loadURL("about:blank");
        }

        // if (tabAssociation) {
        //   appWindow.viewManager.off('activated', tabsEvents.activate);
        //   appWindow.viewManager.off('removed', tabsEvents.remove);
        // }

        // browserWindow.removeListener('resize', windowEvents.resize);
        // browserWindow.removeListener('move', windowEvents.move);

        if (onHide) onHide(dialog);
      },
      handle: (name, cb) => {
        const channel = `${name}-${browserView.webContents.id}`;
        ipcMain.handle(channel, (...args) => cb(...args));
        channels.push(channel);
      },
      on: (name, cb) => {
        const channel = `${name}-${browserView.webContents.id}`;
        ipcMain.on(channel, (...args) => cb(...args));
        channels.push(channel);
      },
      rearrange: (rect) => {
        rect = rect || {};
        browserView.setBounds({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          ...roundifyRectangle(getBounds()),
          // ...roundifyRectangle(rect),
        });
      },
    };

    const emitWindowBoundsUpdate = (type: BoundsDisposition) => {
      // if (
      //   tabAssociation &&
      //   !dialog.tabIds.includes(mainWindow.viewManager.selectedId)
      // ) {

      // }
      if (onWindowBoundsUpdate) onWindowBoundsUpdate(type);
    };

    windowEvents.move = () => {
      emitWindowBoundsUpdate("move");
    };

    windowEvents.resize = () => {
      emitWindowBoundsUpdate("resize");
    };
    // if (tabAssociation) {
    //   mainWindow.viewManager.on('removed', tabsEvents.remove);
    //   mainWindow.viewManager.on('activated', tabsEvents.activate);
    // }

    if (onWindowBoundsUpdate) {
      browserWindow.on("resize", windowEvents.resize);
      browserWindow.on("move", windowEvents.move);
    }
    browserView.webContents.once("dom-ready", () => {
      dialog.rearrange();
      browserView.webContents.focus();
    });

    browserView.webContents.on("blur", () => {
      dialog.hide();
    });

    if (VITE_DEV_SERVER_URL) {
      browserView.webContents.loadURL(`${VITE_DEV_SERVER_URL}${name}.html`);
    } else {
      browserView.webContents.loadFile(join(process.env.DIST, `${name}.html`));
    }
    browserView.setAutoResize({
      horizontal: true,
      vertical: true,
    });
    browserView.setBounds({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      ...roundifyRectangle(getBounds()),
    });

    console.log("[dialog]", browserView.getBounds());
    this.dialogs.push(dialog);
    return dialog;
  }

  public getBrowserViews = () => {
    return this.browserViews;
  };
  public destroy = () => {
    this.getBrowserViews().forEach((x) => (x.webContents as any).destroy());
  };
  public sendToAll = (channel: string, ...args: any[]) => {
    this.getBrowserViews().forEach(
      (x) =>
        !x.webContents.isDestroyed() && x.webContents.send(channel, ...args)
    );
  };
  public get(name: string) {
    return this.getDynamic(name);
  }

  public getDynamic(name: string) {
    return this.dialogs.find((x) => x.name === name);
  }
  public isVisible = (name: string) => {
    return this.getDynamic(name);
  };
}
