import { getConfigSub, type SubType } from "@/api/user";
import { ref, computed } from "vue";
import { getCookie } from "@/utils/yohub.store";
import { writeConfig } from "@/utils/yohub.desktop";
import { useUserStore } from "@/stores";
/**
 * @description: 获取用户订阅
 * @return {*}
 */
export function useSubConfig() {
  // const subConfig = ref(null);
  const loading = ref(false);
  // const _key = getCookie("key") || "";
  const userStore = useUserStore();
  const userInfo = computed(() => userStore.userInfo);
  const getConfig = async (type: "pro" | "glo") => {
    loading.value = true;
    if (userInfo.value?.linkUrl) {
      fetch(userInfo.value.linkUrl + "/json/" + type)
        .then((res) => res.text())
        .then((data) => {
          const _type = type === "glo" ? "global" : "proxy";
          writeConfig(data, _type);
          // subConfig.value = data || null;
          loading.value = false;
        });
    } else {
      // subConfig.value = null;
      loading.value = false;
    }
    // const res = await getConfigSub(_key, type);
    // subConfig.value = res.data;
    // loading.value = false;
  };
  return {
    // subConfig,
    loading,
    getConfig,
  };
}
