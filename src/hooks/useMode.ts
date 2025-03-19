import { startSingBox, stopSingBox } from "@/utils/yohub.desktop";
import { ref } from "vue";

/**
 * 模式切换
 * 代理模式 proxy 默认
 * 全局模式 global  需要启动sing-box服务
 */
export default function useModeHook() {
  const currMode = ref("proxy");
  const loading = ref(false);
  /**
   * 设置模式时，要判断是否已经启动了xray服务
   * @param val
   */
  const setMode = (val: "global" | "proxy") => {
    try {
      if (currMode.value === val) return;

      if (val === "global") {
        // startSingBox();
      } else if (currMode.value === "global") {
        stopSingBox();
      }
      currMode.value = val;
      console.log("Mode changed to", val);
    } catch (error) {
      console.error("Mode change failed:", error);
      currMode.value = "proxy"; // 失败时回退到安全模式
    }
  };
  const getMode = () => {
    return currMode.value;
  };
  const onlySetMode = (val: "global" | "proxy") => {
    currMode.value = val;
  };

  return {
    mode: currMode.value,
    onlySetMode,
    setMode,
    getMode,
  };
}
