import si from "systeminformation";
import crypto from "crypto";
import { store } from "./store";
import pkg from "../package.json";
const CLIENT_TYPE: Record<string, string> = {
  darwin: "macos",
  win32: "windows",
  linux: "linux",
};
export async function getSystemInfo() {
  try {
    const system = await si.system();
    const cpu = await si.cpu();
    const baseboard = await si.baseboard();
    const bios = await si.bios();
    const osInfo = await si.osInfo();

    // 将这些信息组合
    const systemInfo = JSON.stringify({ system, cpu, baseboard, bios });
    const hash = crypto.createHash("sha256");
    hash.update(systemInfo);
    const id = hash.digest("hex");
    return {
      client_id: id,
      client_type: CLIENT_TYPE[process.platform],
      client_version: pkg.version,
      client_name: osInfo.hostname,
    };
  } catch (error) {
    console.error("Error getting system information:", error);
  }
}

export const SystemId = async () => {
  if (store.has("systemInfo")) {
    return store.get("systemInfo");
  } else {
    const _id = await getSystemInfo();
    return _id;
  }
};
