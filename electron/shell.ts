import { exec, spawn } from "child_process";
import path from "path";
import fs from "fs";
import sudo from "sudo-prompt";
import { resourcePath, isMac, isWindows } from "./utils";
import log from "./log";
import { setTrayImage } from "./tray";
// import { app } from "electron";

// const PLUGINS_PATH = resourcePath() || path.join(__dirname, "../resources");
// log.info(["PLUGINS_PATH", PLUGINS_PATH]);
// log.info(["app.getPath(userData)", app.getPath("userData")]);
// log.info(["app.getAppPath()", app.getAppPath()]);
// log.info(["process.resourcesPath", process.resourcesPath]);

let isSudo = false;
export class ShellService {
  private static instance: ShellService;

  static get shared(): ShellService {
    if (!ShellService.instance) {
      ShellService.instance = new ShellService();
    }
    return ShellService.instance;
  }
  PLUGINS_PATH = resourcePath() || path.join(__dirname, "../resources");
  PLATFORM_ARCH = process.platform + "-" + process.arch;
  XRAY_SERVICE_PATH = `${this.PLUGINS_PATH}/yohub-service/${this.PLATFORM_ARCH}`;
  /**
   * 启动（Mac，Windows）
   * 1. 启动xray服务
   */
  public startXray() {
    log.info("[ShellService] XRAY_SERVICE_PATH", this.XRAY_SERVICE_PATH);
    const _cmd = isWindows
      ? `${this.XRAY_SERVICE_PATH}/xray.exe run -c ${this.XRAY_SERVICE_PATH}/config.json`
      : `${this.XRAY_SERVICE_PATH}/xray`;
    _execCommand(_cmd);
  }
  /**
   * 停止（Mac）
   */
  public stopXray() {
    if (isWindows) {
      // TODO:
    } else {
      _execCommand(`killall -9 xray`);
    }
  }
  /**
   * 连接（Mac）
   * 1. 设置系统代理
   * 2. 启用系统代理
   */
  public connect = (config: any) => {
    log.info("[ShellService] connect()");
    this.startXray();
    if (isWindows) {
      _execCommand(`${this.PLUGINS_PATH}/scripts/on-proxy.bat`);
    } else {
      const _cmd = `networksetup -setsocksfirewallproxy "Wi-Fi" ${config.host} ${config.port} && networksetup -setsocksfirewallproxystate Wi-Fi on`;
      _execCommand(_cmd);
    }
    setTrayImage("trayIconTemplate.png");
  };

  /**
   * 断开连接
   * 1. 关闭xray服务
   * 2. 关闭系统代理
   */
  public disconnect = () => {
    return new Promise((resolve, reject) => {
      log.info("[ShellService] stopXra() && disconnect()");
      setTrayImage("trayIconOff.png");
      if (isWindows) {
        _execCommand(`${this.PLUGINS_PATH}/scripts/off-proxy.bat`);
      } else {
        _execCommand(`networksetup -setsocksfirewallproxystate "Wi-Fi" off`);
        _execCommand(
          `killall -9 xray`,
          (data: any) => {
            resolve(data);
          },
          (error: any) => {
            reject(error);
          }
        );
      }
    });
  };

  /**
   * 获取流量
   */
  public getTraffic = (callback?: Function) => {
    return new Promise((resolve, reject) => {
      const _server = "127.0.0.1:10813";
      _execCommand(
        `${this.XRAY_SERVICE_PATH}/xray api statsquery --server=${_server}`,
        (data: any) => {
          try {
            const json = JSON.parse(data);
            const _stat = json.stat;
            const uplink = _stat.find(
              (item: { name: string }) =>
                item.name === "outbound>>>proxy>>>traffic>>>uplink"
            );
            const downlink = _stat.find(
              (item: { name: string }) =>
                item.name === "outbound>>>proxy>>>traffic>>>downlink"
            );

            if (callback) callback({ up: uplink, down: downlink });
            resolve({ up: uplink, down: downlink });
          } catch (error) {
            console.error("[ShellService] getTraffic() error:", error);
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
          ? `${this.PLUGINS_PATH}/scripts/darwin.sh ${host}`
          : `${this.PLUGINS_PATH}/scripts/window.bat`,
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

  /**
   * 写入配置文件（Mac，Windows）
   * @param config
   */
  public writeConfig = (config: any) => {
    try {
      const fileName = "config_test.json";
      const _config = JSON.stringify(config);
      const _path = `${this.XRAY_SERVICE_PATH}/${fileName}`;
      fs.writeFileSync(_path, _config, "utf8");
      log.info("[shell] writeConfig 文件写入成功");
    } catch (error) {
      log.error("[shell] writeConfig 写入文件出错：" + error);
    }
  };

  /**
   * ipinfo.io 获取ip信息（Mac）
   * @param command
   */
  public getIpInfo = () => {
    return new Promise((resolve, reject) => {
      const _cmd = `curl ipinfo.io`;
      _execCommand(_cmd, (data: any) => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  /**
   * 探测地址延迟
   * @param address
   * @returns
   */
  public pingAddress = (address: string | string[]) => {
    const _address = Array.isArray(address) ? address.join(" ") : address;

    return new Promise((resolve, reject) => {
      if (isWindows) {
        return _windowsPingAddress(_address);
      } else {
        _execCommand(
          `${this.PLUGINS_PATH}/scripts/darwin.sh ${_address}`,
          (data: any) => {
            try {
              const _data = data.split("\n").filter((it: string) => !!it);
              resolve(_data);
            } catch (error) {
              reject(error);
              console.error("[ShellService] pingAddress() error:", error);
            }
          }
        );
      }
    });
  };

  /**
   * 开机自启动/开机不自启动（Windows）
   * @param isAutoStart true: 开机自启动，false:开机不自启动
   * @description 待验证
   */
  public setAutoStart = (isAutoStart: boolean) => {
    const appName = "YoHubApp";
    const appPath = process.execPath;
    const _cmd = isAutoStart
      ? `REG ADD "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v ${appName} /t REG_SZ /d "${appPath}" /f`
      : `REG DELETE "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v ${appName} /f`;
    _execCommand(_cmd);
  };
}

function _windowsPingAddress(address: string) {
  return new Promise((resolve, reject) => {
    const script = `
      $address = "${address}"
      $result = Test-Connection -ComputerName $address -Count 3
      if ($result) {
          $averageLatency = ($result | Measure-Object -Property ResponseTime -Average).Average
          Write-Host "$address :_: $averageLatency ms"
      }
    `;
    _runPowerShellScript(script)
      .then((output) => {
        console.log(output);
        resolve(output);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}
// 定义一个函数来执行PowerShell脚本
function _runPowerShellScript(script: string) {
  return new Promise((resolve, reject) => {
    let powershell = spawn("powershell.exe", ["-Command", script]);
    let output = "";
    let errorOutput = "";
    powershell.stdout.on("data", (data) => {
      output += data.toString();
    });
    powershell.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });
    powershell.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(errorOutput));
      }
    });
  });
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
function _execCommand(
  command: string,
  callback?: Function,
  callbackError?: Function
) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      log.error(`[shell]【${command}】 执行出错: ${error}`);
      if (callbackError) callbackError(error);
      return;
    }
    // console.log(`[shell]【${command}】 标准输出: ${stdout}`);
    if (callback) callback(stdout);
    if (stderr) {
      log.error(`[shell]【${command}】 标准错误: ${stderr}`);
      if (callbackError) callbackError(error);
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
