import { exec } from "child_process";
import path from "path";
import sudo from "sudo-prompt";

const PLUGINS_PATH = path.join(__dirname, "../plugins/Xray-macos-arm64");
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
   * 连接
   * 1. 启动xray服务
   * 2. 设置系统代理
   */
  public connect = (config: any) => {
    execCommand(
      `networksetup -setsocksfirewallproxy "Wi-Fi" ${config.host} ${config.port} && ${PLUGINS_PATH}/xray`
    );
    console.log("[ShellService] connect()", `${PLUGINS_PATH}/xray`);
  };

  /**
   * 断开连接
   * 1. 关闭xray服务
   * 2. 关闭系统代理
   */
  public disconnect = () => {
    console.log("[ShellService] disconnect()");
    execCommand(`networksetup -setsocksfirewallproxystate "Wi-Fi" off`);
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
function _execCommand(command: string) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行出错: ${error}`);
      return;
    }
    console.log(`标准输出: ${stdout}`);
    if (stderr) {
      console.error(`标准错误: ${stderr}`);
    }
  });
}

function _sudoExecCommand(command: string) {
  const options = {
    name: "Yohub",
    // icns: "/Applications/Electron.app/Contents/Resources/Electron.icns", // (optional)
  };
  sudo.exec(command, options, (error, stdout, stderr) => {
    isSudo = true;
    if (error) {
      console.error(`sudo 执行出错: ${error}`);
      return;
    }
    console.log(`sudo 标准输出: ${stdout}`);
    if (stderr) {
      console.error(`sudo 标准错误: ${stderr}`);
    }
  });
}
