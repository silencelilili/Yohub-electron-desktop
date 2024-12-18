import { exec, spawn } from "child_process";
import path from "path";
import fs from "fs";
import sudo from "sudo-prompt";
import { isMac, resourcePath } from "./utils";
import log from "./log";
import { app } from "electron";

const PLUGINS_PATH = resourcePath() || path.join(__dirname, "../resources");
log.info(["PLUGINS_PATH", PLUGINS_PATH]);
log.info(["app.getPath(userData)", app.getPath("userData")]);
log.info(["app.getAppPath()", app.getAppPath()]);
log.info(["process.resourcesPath", process.resourcesPath]);

let isSudo = false;
export class ShellService {
  private static instance: ShellService;

  static get shared(): ShellService {
    if (!ShellService.instance) {
      ShellService.instance = new ShellService();
    }
    return ShellService.instance;
  }
  /**
   * 启动
   * 1. 启动xray服务
   */
  public startXray() {
    _execCommand(`${PLUGINS_PATH}/Xray-macos-arm64/xray`);
  }
  public stopXray() {
    _execCommand(`killall -9 xray`);
  }
  /**
   * 连接
   * 1. 设置系统代理
   * 2. 启用系统代理
   */
  public connect = (config: any) => {
    _execCommand(
      `networksetup -setsocksfirewallproxy "Wi-Fi" ${config.host} ${config.port} && networksetup -setsocksfirewallproxystate Wi-Fi on`
    );
    log.info(
      "[ShellService] connect()",
      `${PLUGINS_PATH}/Xray-macos-arm64/xray`
    );
  };

  /**
   * 断开连接
   * 1. 关闭xray服务
   * 2. 关闭系统代理
   */
  public disconnect = () => {
    console.log("[ShellService] disconnect()");
    _execCommand(`networksetup -setsocksfirewallproxystate "Wi-Fi" off`);
  };

  /**
   * 获取流量
   */
  public getTraffic = (callback?: Function) => {
    return new Promise((resolve, reject) => {
      const _server = "127.0.0.1:10813";
      _execCommand(
        `${PLUGINS_PATH}/Xray-macos-arm64/xray api statsquery --server=${_server}`,
        (data: any) => {
          try {
            const json = JSON.parse(data);
            const _stat = json.stat;
            const uplink = _stat.find(
              (item) => item.name === "outbound>>>proxy>>>traffic>>>uplink"
            );
            const downlink = _stat.find(
              (item) => item.name === "outbound>>>proxy>>>traffic>>>downlink"
            );
            // console.log("[ShellService] getTraffic() callback:::::", {
            //   up: uplink,
            //   down: downlink,
            // });

            if (callback) callback({ up: uplink, down: downlink });
            resolve({ up: uplink, down: downlink });
          } catch (error) {
            console.error("[ShellService] getTraffic() error:", error);
            // return { up: { name: "", value: 0 }, down: { name: "", value: 0 } };
            resolve({
              up: { name: "", value: 0 },
              down: { name: "", value: 0 },
            });
          }
        }
      );
    });
  };

  /**
   * 获取延迟时长
   * @param host 目标地址, 默认为 8.8.8.8
   * @returns Promise<{host: string; latency: string}>
   */
  public getLatency = (host = "8.8.8.8") => {
    return new Promise((resolve, reject) => {
      _execCommand(
        isMac
          ? `${PLUGINS_PATH}/get-latency/darwin.sh ${host}`
          : `${PLUGINS_PATH}/get-latency/window.bat`,
        (data: any) => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (error) {
            resolve({
              host: "",
              latency: "",
            });
            console.error("[ShellService] getLatency() error:", error);
          }
        }
      );
    });
  };

  public writeConfig = (config: any) => {
    try {
      const _config = JSON.stringify(config);
      const _path = `${PLUGINS_PATH}/Xray-macos-arm64/config2.json`;
      fs.writeFileSync(_path, _config, "utf8");
      log.info("[shell] writeConfig 文件写入成功");
    } catch (error) {
      log.error("[shell] writeConfig 写入文件出错：" + error);
    }
  };
}

// 全局记录是否已经输入过密码，若输入过后续执行则不再输入密码
function execCommand(command: string) {
  if (isSudo) {
    _execCommand(command);
  } else {
    _sudoExecCommand(command);
  }
}
// 执行命令的函数
function _execCommand(command: string, callback?: Function) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      log.error(`[shell]【${command}】 执行出错: ${error}`);
      return;
    }
    log.info(`[shell]【${command}】 标准输出: ${stdout}`);
    if (callback) callback(stdout);
    if (stderr) {
      log.error(`[shell]【${command}】 标准错误: ${stderr}`);
    }
  });
}

function _sudoExecCommand(command: string, callback?: Function) {
  const options = {
    name: "Yohub",
    // icns: "/Applications/Electron.app/Contents/Resources/Electron.icns", // (optional)
  };
  sudo.exec(command, options, (error, stdout, stderr) => {
    isSudo = true;
    if (error) {
      console.error(`[shell] sudo 执行出错: ${error}`);
      return;
    }
    console.log(`[shell] sudo 标准输出: ${stdout}`);
    if (callback) callback(stdout);
    if (stderr) {
      console.error(`[shell] sudo 标准错误: ${stderr}`);
    }
  });
}
