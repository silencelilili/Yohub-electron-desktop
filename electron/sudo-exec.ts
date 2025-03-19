import sudoPrompt from "sudo-prompt";
import { exec } from "child_process";
import { platform, homedir } from "os";
import { resolve } from "path";
import log from "./log";

interface ExecOptions {
  name?: string;
  icns?: string; // macOS 专用
  env?: NodeJS.ProcessEnv;
}

export function sudoExecInDir(
  command: string,
  directory?: string,
  options: ExecOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      let finalCommand = command;

      // 仅在 directory 存在时处理路径
      if (directory) {
        const processedDir = directory
          .replace(/^~/, homedir())
          .replace(/'/g, "'\\''");

        // 构建带目录切换的命令
        finalCommand =
          platform() === "win32"
            ? `cd /d "${processedDir}" && ${command}`
            : `cd '${processedDir}' && ${command}`;
      }

      // 默认选项
      const finalOptions: any = {
        name: options.name || "YoHubApp",
        ...(platform() === "darwin" && {
          icns:
            options.icns ||
            "/Applications/YoHubApp.app/Contents/Resources/icon.icns",
        }),
        ...options,
        // env: { ...process.env, ...options.env },
      };

      sudoPrompt.exec(finalCommand, finalOptions, (error, stdout, stderr) => {
        if (error) {
          // 处理 Windows 用户取消 (ERROR_CANCELLED)
          const isCancel =
            platform() === "win32" && error.message.includes("0x800704C7");
          log.error(`[sudoExecInDir] error:`, error);
          return reject(
            new Error(isCancel ? "用户取消了权限请求" : error.message)
          );
        }
        if (stderr) {
          log.error(`[sudoExecInDir] stderr:`, stderr);
          return reject(stderr);
        }

        resolve(stdout?.toString().trim() || "");
      });
    } catch (e) {
      log.error(`[sudoExecInDir] catch error:`, e);
      reject(new Error(`命令构建失败: ${e.message}`));
    }
  });
}

interface ProcessInfo {
  pid: string;
  command: string;
}

export class ProcessManager {
  /**
   * 检测并终止进程
   * @param processName 进程名（Windows需带.exe）
   */
  static async killProcess(
    processName: string,
    isSudo: boolean
  ): Promise<boolean> {
    try {
      const exists = await this.checkProcessExists(processName);
      log.info(`-----检测到进程${processName}: ${exists}`);
      if (!exists) return false;

      await this.terminateProcess(processName, isSudo);
      return true;
    } catch (error) {
      // throw new Error(`进程操作失败: ${error.message}`);
      return true;
    }
  }

  /**
   * 检测进程是否存在
   */
  private static async checkProcessExists(
    processName: string
  ): Promise<boolean> {
    const command =
      platform() === "win32"
        ? `tasklist /FI "IMAGENAME eq ${processName}"`
        : `ps aux | grep -v grep | grep "${processName}"`;

    try {
      const output = await this.execCommand(command);
      return platform() === "win32"
        ? output.includes(processName)
        : output.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * 终止进程
   */
  private static async terminateProcess(
    processName: string,
    isSudo: boolean
  ): Promise<void> {
    const _name = processName.replace(/.\//g, "");
    const command =
      platform() === "win32"
        ? `taskkill /F /IM ${processName}`
        : `killall -9 "${_name}"`;

    if (isSudo) {
      await sudoExecInDir(command);
    } else {
      await this.execCommand(command);
    }
  }

  /**
   * 执行系统命令
   */
  private static execCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          // Windows 进程不存在时返回码为 128
          if (platform() === "win32" && error.code === 128) {
            return resolve("");
          }
          return reject(error);
        }
        resolve(stdout.toString());
      });
    });
  }
}
