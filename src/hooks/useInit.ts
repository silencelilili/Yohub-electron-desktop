/**
 * 场景：
 * 用户购买订阅套餐后 重新进行配置信息的拉取
 */

import { useUserStore } from "@/stores";
import { useSubConfig } from "./useSubConfig";
import useLinesHook from "./useLines";
import { useClientReport } from "./useReport";

export default async function useInit() {
  // 获取用户信息
  const userStore = useUserStore();
  await userStore.getUserInfoApi(); // 重新拉取config配置

  useSubConfig().getConfig("pro"); // 重新拉取链路列表
  useSubConfig().getConfig("glo"); // 重新拉取链路列表

  const useLines = useLinesHook();
  await useLines.getLines(); // 重新下载geosite文件

  await useClientReport().handleReport(); // 若当前为连接状态，则断开重新连接
}
