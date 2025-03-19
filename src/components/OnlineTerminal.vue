<template>
    <!-- <el-dialog
      v-model="onlineTerminalDialogVisible"
      title="在线终端"
      center
    > -->
    <div class="terminal-list">
      <h4 class="mb-6">您的在线设备已经超过最大值， 请选择强制登出设备</h4>
      <div v-for="(item, index) in terminalList" :key="item.client_id" class="flex justify-between-center">
        <div class="flex-1">{{ index+1 }}、 {{ item.client_name }}</div>
        <el-button type="primary" @click="handleOffline(item)">解绑</el-button>
      </div>
    </div>
     <!-- <template #footer>
      <el-button type="primary" @click="onlineTerminalDialogVisible = false">退出App</el-button>
    </template>
  </el-dialog> -->
</template>
<script lang="ts" setup>
import { onMounted, ref, defineProps, watch, defineExpose } from 'vue';
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/index";
import { getTerminals, delTerminals } from '@/api/user'
import { getStore } from '@/utils/yohub.store';
const router = useRouter();
const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return []
    }
  },
})
const onlineTerminalDialogVisible = ref(false)
const terminalList = ref<any>([])

onMounted(() => {
  terminalList.value = props.data
})

watch(() => props.data, (newVal) => {
  terminalList.value = newVal
})
const setVisible = (visible: boolean, data?: any) => {
  onlineTerminalDialogVisible.value = visible
  console.log (onlineTerminalDialogVisible.value)
  if (visible) {
    terminalList.value = data
  }
}
const _getTerminalsApi = async () => {
  const { data=[] } = await getTerminals()
  terminalList.value = [...data]
}

const userStore = useUserStore();
const system_info = await getStore("systemInfo");

const handleOffline = async (item: any) => {
  delTerminals({ user_client_rel_id: item.id }).then(() => {
    if (system_info.client_id === item.client_id) {
        // 跳转到登录页面
      userStore
      .logoutApi()
      .then(() => {
        // 跳转登录页
        router.push("/login");
      })
      .catch(() => {
        router.push("/login");
      });
    } else {
      _getTerminalsApi()
    }
  }).catch((err) => {
    
  });
  
}
defineExpose({
  setVisible
})
</script>
<style lang="less" scoped>
</style>