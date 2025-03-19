import { ref, onUnmounted } from 'vue';

export function usePolling(checkFn: () => boolean | null, interval: number = 1000) {
  const isReady = ref(false);

  let pollInterval: any = null;

  const startPolling = () => {
    pollInterval = setInterval(() => {
      const result = checkFn();
      if (result) {
        clearInterval(pollInterval!);
        isReady.value = true;
      } else {
        isReady.value = false;
      }
    }, interval);
  };

  const stopPolling = () => {
    if (pollInterval) {
      clearInterval(pollInterval);
    }
  };

  onUnmounted(() => {
    stopPolling();
  });

  return {
    isReady,
    startPolling,
    stopPolling,
  };
}