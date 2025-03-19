/**
 * 连接相关逻辑
 * 连接，断开连接，获取实时流量/延迟时间，设置端口
 */

import { ref, watch } from "vue";
import {
  startXray,
  connect,
  disconnect,
  getTraffic,
  getLatency,
  setProxy,
  getIpInfo,
} from "@/utils/yohub.desktop";

import { connectStatus } from "@/utils/yohub.store";
import { connectionStatusMap, connectionStatusEnum } from "@/pages/home/config";
import { useAppStore } from "@/stores";
import { ElMessage } from "element-plus";
let trafficInterval: any = null;
// let latencyInterval: any = null;
// 在线时长定时器
let onlineTimerInterval: any = null;
let _onlineTimes: number = 0;
export default function useConnectHook() {
  const loading = ref(false);
  const connectionStatus = ref(connectStatus().get());
  const onlineTimes = ref(_onlineTimes);
  const currentLine = ref({
    traffic_key: "",
  });
  const handleStartXray = async () => {
    await startXray("");
  };
  // 连接
  const handleConnect = async (line: any, mode: string = "proxy") => {
    if (loading.value) {
      return ElMessage.warning("正在连接中，请稍后...");
    }
    // 检查归属地
    getIpInfo();

    loading.value = true;
    currentLine.value = line;
    connect({ mode: mode, port: line.proxy_port })
      .then((res) => {
        connectionStatus.value = connectionStatusMap.connecting;
        setTimeout(() => {
          _getTraffic(currentLine.value);
          connectionStatus.value = connectionStatusMap.connected;
          _getOnlineTime();
          loading.value = false;
        }, 1000);
      })
      .catch((err) => {
        console.error("连接失败", err);
        ElMessage.error("连接失败");
        loading.value = false;
      });
  };

  // 只设置端口
  const onlyConnect = async (line: any) => {
    if (connectionStatus.value.status === connectionStatusEnum.CONNECTED) {
      currentLine.value = line;
      await setProxy({ port: line.proxy_port });
    }
  };
  watch(connectionStatus, (newValue) => {
    useAppStore().setOnlineStatus(newValue);
    connectStatus().set(newValue);
  });
  // 断开连接
  const handleDisconnect = () => {
    return new Promise((resolve, reject) => {
      loading.value = true;

      loading.value = false;
      disconnect()
        .then((res) => {
          console.log("断开连接成功", res);
          connectionStatus.value = connectionStatusMap.disconnected;
          clearAllInterval();
          resolve(connectionStatus.value);
        })
        .catch((err) => {
          console.error("断开连接失败", err);
          ElMessage.error("断开连接失败");
          reject(err);
        });
    });
  };
  // 退出登录之前判断断开链接
  const handleLogoutDisconnect = () => {
    return new Promise((resolve, reject) => {
      loading.value = true;

      const _status = connectStatus().get();
      if (_status.status === connectionStatusEnum.CONNECTED) {
        loading.value = false;
        disconnect()
          .then((res) => {
            console.log("断开连接成功", res);
            connectionStatus.value = connectionStatusMap.disconnected;
            clearAllInterval();
            resolve(connectionStatus.value);
          })
          .catch((err) => {
            console.error("断开连接失败", err);
            reject(err);
          });
      } else {
        connectionStatus.value = connectionStatusMap.disconnected;
        loading.value = false;
        resolve(connectionStatus.value);
      }
    });
  };

  // 获取实时流量/延迟时间 =============
  const _getTraffic = (line: any) => {
    getTraffic(line?.traffic_key || "");
    getLatency();
    trafficInterval = setInterval(() => {
      const _traffic_key =
        currentLine.value?.traffic_key || line?.traffic_key || "";
      getTraffic(_traffic_key);
      getLatency();
    }, 3 * 1000);
    // latencyInterval = setInterval(() => {
    //   getLatency();
    // }, 3 * 1000);
  };
  const _getOnlineTime = () => {
    _onlineTimes = 0;
    onlineTimes.value = 0;
    onlineTimerInterval = setInterval(() => {
      _onlineTimes += 1;
      onlineTimes.value += 1;
      useAppStore().setOnlineTimes(_onlineTimes);
    }, 1000);
  };

  const clearAllInterval = () => {
    if (trafficInterval) {
      clearInterval(trafficInterval);
      trafficInterval = null;
    }
    // if (latencyInterval) {
    //   clearInterval(latencyInterval);
    //   latencyInterval = null;
    // }
    if (onlineTimerInterval) {
      _onlineTimes = 0;
      onlineTimes.value = 0;
      clearInterval(onlineTimerInterval);
      onlineTimerInterval = null;
    }
  };
  return {
    loading,
    connectionStatus,
    onlineTimes,
    handleStartXray,
    handleConnect,
    handleDisconnect,
    handleLogoutDisconnect,
    clearAllInterval,
    onlyConnect,
  };
}
