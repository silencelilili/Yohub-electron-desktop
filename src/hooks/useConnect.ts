import { ref, watch } from "vue";
import {
  startXray,
  connect,
  disconnect,
  getTraffic,
  getLatency,
} from "@/utils/yohub.desktop";
import { connectStatus } from "@/utils/yohub.store";
import { connectionStatusMap, connectionStatusEnum } from "@/pages/home/config";
import { useAppStore } from "@/stores";

let trafficInterval: any = null;
// 在线时长定时器
let onlineTimerInterval: any = null;
let _onlineTimes: number = 0;
export default function useConnect() {
  const loading = ref(false);
  const connectionStatus = ref(connectStatus().get());
  const onlineTimes = ref(_onlineTimes);

  const handleStartXray = async () => {
    await startXray();
  };
  // 连接
  const handleConnect = async () => {
    loading.value = true;
    connect({ host: "127.0.0.1", port: "10808" });

    connectionStatus.value = connectionStatusMap.connecting;
    setTimeout(() => {
      _getTraffic();
      connectionStatus.value = connectionStatusMap.connected;
      _getOnlineTime();
      loading.value = false;
    }, 3000);
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
  const _getTraffic = () => {
    getTraffic();
    getLatency();
    trafficInterval = setInterval(() => {
      getTraffic();
      getLatency();
    }, 60000);
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
  };
}
