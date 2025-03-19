import { exec, spawn } from "child_process";
import path from "path";
import fs from "fs";
import sudo from "sudo-prompt";
import { resourcePath, isMac, isWindows, calculateMD5 } from "./utils";
import log from "./log";
import { setTrayImage } from "./tray";
import regedit from "regedit";
import { ProcessManager, sudoExecInDir } from "./sudo-exec";
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
  XRAY_SERVICE_PATH = isWindows
    ? `${this.PLUGINS_PATH}\\yohub-service\\${this.PLATFORM_ARCH}`
    : `${this.PLUGINS_PATH}/yohub-service/${this.PLATFORM_ARCH}`;

  MODE = "proxy";
  /**
   * 启动yohub服务（Mac，Windows）
   * @param configFile 配置文件名
   * @returns
   */
  public startXray(mode: string = "proxy") {
    return new Promise((resolve, reject) => {
      const _fileName = `yohub_${mode}.cfg`;
      log.info("[ShellService] startXray(), mode:" + _fileName);

      if (isWindows) {
        const _cmd = path.join(this.XRAY_SERVICE_PATH, "yohub.exe");
        const _config = path.join(this.XRAY_SERVICE_PATH, _fileName);
        _spawnCommand(_cmd, ["run", "-c", _config]);
      } else {
        const _cmd = `./yohub run -c ./${_fileName} &`;
        _execCommand(
          _cmd,
          {
            cwd: this.XRAY_SERVICE_PATH,
          },
          (data: any) => {
            resolve(data);
          },
          (error: any) => {
            reject(error);
          }
        );
      }
    });
  }
  /**
   * 停止yohub服务（Mac/Windows）
   */
  public stopXray() {
    if (isWindows) {
      _execCommand(`taskkill /IM yohub.exe /F`);
    } else {
      _execCommand(`killall -9 yohub`);
    }
  }

  /**
   * 全局模式 启动sing-box服务
   */
  public startSingBox() {
    return new Promise((resolve, reject) => {
      log.info("[ShellService] global startSingBox()");
      if (isWindows) {
        const _cmd = path.join(this.XRAY_SERVICE_PATH, "sing-box.exe");
        const _config = path.join(this.XRAY_SERVICE_PATH, "singbox_win.json");
        // _spawnCommand(_cmd, ["run", "-c", _config]);
        sudoExecInDir(
          "sing-box.exe run -c singbox_win.json",
          this.XRAY_SERVICE_PATH
        )
          .then((data) => {
            console.log("----sudoExecInDir success-----", data);
            resolve(data);
          })
          .catch((error) => {
            console.error("===-sudoExecInDir error====", error);
            reject(error);
          });
      } else {
        sudoExecInDir(
          "./sing-box run -c ./singbox_mac.json &",
          this.XRAY_SERVICE_PATH
        )
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
        // const _cmd = `cd "${this.XRAY_SERVICE_PATH}" && ./sing-box run -c ./singbox_mac.json &`;
        // sudoExec(
        //   _cmd,
        //   {},
        //   (data: any) => {
        //     resolve(data);
        //   },
        //   (error: any) => {
        //     reject(error);
        //   }
        // );
      }
    });
  }
  /**
   * 全局模式 - 停止sing-box服务
   */
  public async stopSingBox() {
    if (isWindows) {
      // sudoExecInDir(`taskkill /IM sing-box.exe /F`);
      const killed = await ProcessManager.killProcess("sing-box.exe", true);
      log.info(`[ShellService] stopSingBox()进程已终止: ${killed}`);
    } else {
      // sudoExecInDir(`killall -9 sing-box`);
      const killed = await ProcessManager.killProcess("sing-box", true);
      log.info(`[ShellService] stopSingBox()进程已终止: ${killed}`);
    }
  }

  /**
   * 连接（Mac/Windows）
   * 1. 启动xray服务
   * 2. 设置系统代理
   * @param config {
   *  configFile: string, 配置文件名
   *  port: number | string 系统代理端口
   * }
   * @returns
   */
  public connect = (config: {
    mode: string;
    port: number | string;
  }): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      log.info(
        `[ShellService] connect(), port: ${config.port}, mode: ${config.mode}`
      );
      this.startXray(config.mode);
      this.setProxy(config.port)
        .then(() => {
          setTrayImage("trayIconTemplate.png");
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
      if (config.mode === "global") {
        this.startSingBox();
      } else if (this.MODE === "global") {
        this.stopSingBox();
      }

      this.MODE = config.mode;
    });
  };

  public setProxy = (port: number | string): Promise<any> => {
    return new Promise((resolve, reject) => {
      log.info("[ShellService] setProxy(), port: " + port);
      const host = "127.0.0.1";
      if (isWindows) {
        _windowsSetProxy("on", port, (error) => {
          reject(error);
          return;
        });
        resolve(true);
      } else {
        // 同时设置WIFI网卡和本地网卡
        const _cmd = `networksetup -setsocksfirewallproxy "Wi-Fi" ${host} ${port} && networksetup -setsocksfirewallproxystate Wi-Fi on`;
        _execCommand(
          _cmd,
          {},
          () => {
            resolve(true);
          },
          (err: any) => {
            reject(err);
          }
        );
        // 本地网卡
        _execCommand(
          `networksetup -setsocksfirewallproxy Ethernet ${host} ${port}`
        );
      }
    });
  };
  /**
   * 断开连接
   * 1. 关闭xray服务
   * 2. 关闭系统代理
   */
  public disconnect = () => {
    return new Promise(async (resolve, reject) => {
      log.info("[ShellService] stopXray() && disconnect()");
      setTrayImage("trayIconOff.png");
      if (isWindows) {
        _windowsSetProxy("off", 0, (error) => {
          reject(error);
          return;
        });
        // sudoExecInDir(`taskkill /IM sing-box.exe /F`);
        ProcessManager.killProcess("sing-box.exe", true);

        // _execCommand(`taskkill /IM yohub.exe /F`);
        await ProcessManager.killProcess("yohub.exe", false);
        resolve(true);
      } else {
        _execCommand(`networksetup -setsocksfirewallproxystate "Wi-Fi" off`);
        // _execCommand(
        //   `killall -9 yohub`,
        //   {},
        //   (data: any) => {
        //     resolve(data);
        //   },
        //   (error: any) => {
        //     reject(error);
        //   }
        // );
        // sudoExecInDir(`killall -9 sing-box`);
        ProcessManager.killProcess("sing-box", true);

        const killed = await ProcessManager.killProcess("./yohub", false);
        resolve(true);
      }
    });
  };

  /**
   * 获取流量
   */
  public getTraffic = (lineName: string, callback?: Function) => {
    return new Promise((resolve, reject) => {
      // "${this.XRAY_SERVICE_PATH}\\
      const _cmd = isWindows
        ? `yohub.exe api statsquery`
        : `./yohub api statsquery`;
      _execCommand(
        _cmd,
        {
          cwd: this.XRAY_SERVICE_PATH,
        },
        (data: any) => {
          try {
            const json = JSON.parse(data);
            // console.log("[ShellService] getTraffic() json:", json);
            const _stat = json.stat;
            const uplink = _stat.find(
              (item: { name: string }) =>
                item.name === `outbound>>>${lineName}>>>traffic>>>uplink`
            );
            const downlink = _stat.find(
              (item: { name: string }) =>
                item.name === `outbound>>>${lineName}>>>traffic>>>downlink`
            );

            const _up_val = !!uplink.value ? uplink.value / 8 : 0;
            const _down_val = !!downlink.value ? downlink.value / 8 : 0;
            const _result = {
              up: { ...uplink, value: _up_val },
              down: { ...downlink, value: _down_val },
            };
            if (callback) callback(_result);
            resolve(_result);
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
   * 写入配置文件（Mac，Windows）
   * @param config
   */
  public writeConfig = (config: { data: any; fileName: string }) => {
    try {
      const fileName = `yohub_${config.fileName}.cfg`;
      const _config = config.data;
      const _path = `${this.XRAY_SERVICE_PATH}/${fileName}`;
      fs.writeFileSync(_path, _config);
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
      _execCommand(_cmd, {}, (data: any) => {
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
        _windowsPingAddress(_address)
          .then((res) => {
            const _data: any = [res];
            const __data = _data
              .filter((it: string) => !!it)
              .map((item: string) => {
                const [host = "", latency = "0"] = item.split(":_:");
                const _latency = latency.trim();
                const _host = host.trim();
                return {
                  host: _host,
                  latency: Number(_latency).toFixed(2),
                };
              });
            resolve(__data);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        _execCommand(
          `./darwin.sh ${_address}`,
          {
            cwd: `${this.PLUGINS_PATH}/scripts`,
          },
          (data: any) => {
            try {
              const _data = data.split("\n").filter((it: string) => !!it);
              const __data = _data
                .filter((it: string) => !!it)
                .map((item: string) => {
                  const [host = "", latency = "0 ms"] = item.split(":_:");
                  return {
                    host,
                    latency,
                  };
                });
              resolve(__data);
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
  /**
   * 读取文件md5
   */
  public getMd5 = async (fileName: string) => {
    const _path = `${this.XRAY_SERVICE_PATH}/${fileName}`;
    return await calculateMD5(_path);
  };
}
function _windowsSetProxy(
  type: "on" | "off",
  port: number | string,
  errorCallback?: Function
) {
  const _path =
    "HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings";
  const cmds = [
    `REG ADD "${_path}" /v "ProxyEnable" /t REG_DWORD /d "${
      type === "on" ? 1 : 0
    }" /f`,
    `REG ADD "${_path}" /v "ProxyServer" /t REG_SZ /d "${
      type === "on" ? `socks://127.0.0.1:${port}` : ""
    }" /f`,
    // `REG ADD "${_path}" /v "ProxyOverride" /t REG_SZ /d "${
    //   type === "on" ? "1.1.1.1;<local>" : ""
    // }" /f`,
  ].map((cmd) => {
    _execCommand(cmd);
  });
}

function _windowsPingAddress(address: string) {
  return new Promise((resolve, reject) => {
    const script = `
      $address = "${address}"
      $result = Test-Connection -ComputerName $address -Count 2
      if ($result) {
          $averageLatency = ($result | Measure-Object -Property ResponseTime -Average).Average
          Write-Output "$address :_: $averageLatency"
      }
    `;
    _runPowerShellScript(script)
      .then((output) => {
        resolve(output);
      })
      .catch((error) => {
        console.error("_runPowerShellScript", error);
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
function sudoExec(
  command: string,
  options = {},
  callback?: Function,
  callbackError?: Function
) {
  if (isSudo) {
    _execCommand(command, options, callback, callbackError);
  } else {
    _sudoExecCommand(command, options, callback, callbackError);
  }
}
// 执行命令的函数
function _execCommand(
  command: string,
  options = {},
  callback?: Function,
  callbackError?: Function
) {
  exec(`${command}`, options, (error, stdout, stderr) => {
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
function _sudoExecCommand(
  command: string,
  opt = {},
  callback?: Function,
  callbackError?: Function
) {
  const options = {
    name: "Electron", // Yohub
    ...opt,
    // icns: "/Applications/Electron.app/Contents/Resources/Electron.icns", // (optional)
  };
  sudo.exec(`${command}`, options, (error, stdout, stderr) => {
    isSudo = true;
    if (error) {
      log.error(`[shell] sudo 执行出错: ${error}`);
      if (callbackError) callbackError(error);
      return;
    }
    log.log(`[shell] sudo 标准输出: ${stdout}`);
    if (callback) callback(stdout);
    if (stderr) {
      log.error(`[shell] sudo 标准错误: ${stderr}`);
      if (callbackError) callbackError(error);
    }
  });
}

// 配置项
const EXECUTION_OPTIONS = {
  windowsHide: true,
  detached: true, // 让子进程独立于父进程运行
};
function _spawnCommand(
  command: string,
  args: string[],
  callback?: Function,
  errorCallback?: Function
) {
  const child = spawn(command, args, EXECUTION_OPTIONS);
  child.stdout.on("data", (data) => {
    if (callback) callback(data);
  });
  child.stderr.on("data", (data) => {
    console.error(`[shell] spawn 错误: ${data}`);
    if (errorCallback) errorCallback(data);
  });
  child.on("close", (code) => {});
}
