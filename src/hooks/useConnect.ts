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
export default function useConnect() {
  const loading = ref(false);
  const trafficInterval = ref();
  const connectionStatus = ref(connectStatus().get());
  const handleStartXray = async () => {
    await startXray();
  };
  // 连接
  const handleConnect = async () => {
    loading.value = true;
    connect({ host: "127.0.0.1", port: "10808" });
    _getTraffic();
    connectionStatus.value = connectionStatusMap.connecting;
    // connectStatus().set(connectionStatus.value);
    setTimeout(() => {
      connectionStatus.value = connectionStatusMap.connected;
      loading.value = false;
      // connectStatus().set(connectionStatus.value);
    }, 3000);
  };

  watch(connectionStatus, (newValue) => {
    // console.log("------connectionStatus", newValue);
    connectStatus().set(newValue);
  });

  // 断开连接
  const handleDisconnect = async () => {
    loading.value = true;
    connectionStatus.value = connectionStatusMap.disconnected;
    if (trafficInterval.value) {
      clearInterval(trafficInterval.value);
      trafficInterval.value = null;
    }
    disconnect();
    loading.value = false;

    // connectStatus().set(connectionStatus.value);
  };
  // 获取实时流量/延迟时间 =============
  const _getTraffic = () => {
    trafficInterval.value = setInterval(() => {
      getTraffic();
      getLatency();
    }, 2000);
  };
  return {
    loading,
    connectionStatus,
    handleStartXray,
    handleConnect,
    handleDisconnect,
  };
}
