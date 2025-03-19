import { report } from "@/api/user";
// import pkg from "../../package.json";
import { getStore } from "@/utils/yohub.store";
import { downloadFile, getMd5 } from "@/utils/yohub.desktop";
import { downloadByUrl } from "@/utils";

// const CLIENT_TYPE: Record<string, string> = {
//   darwin: "macos",
//   win32: "windows",
//   linux: "linux",
// };
const isMac = window.$Yohub.$platform === "darwin";
export const useClientReport = () => {
  // 上报终端信息
  const handleReport = async () => {
    const _info = await getStore("systemInfo");
    const _md5 = await getMd5("geosite.dat");
    let data = {
      ..._info,
      geositeMd5: _md5,
    };
    if (isMac) {
      const _sing_md5 = await getMd5("singbox_mac.json");
      data.singboxMacJsonMd5 = _sing_md5;
    } else {
      const _sing_md5 = await getMd5("singbox_win.json");
      data.singboxWinJsonMd5 = _sing_md5;
    }
    report(data).then((res: any) => {
      const resData = res.data;
      if (resData.geosite_url) {
        downloadFile(resData.geosite_url);
      }
      if (resData.singbox_mac_json_url) {
        downloadFile(resData.singbox_mac_json_url);
      }
      if (resData.singbox_win_json_url) {
        downloadFile(resData.singbox_win_json_url);
      }
    });
  };
  return {
    handleReport,
  };
};
