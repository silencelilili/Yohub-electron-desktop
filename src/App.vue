<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { getIpInfo } from "./utils/yohub.desktop";
onMounted(() => {
  // TODO: 检测当前用户的所在地
  getIpInfo();
});

// TODO: 当前用户的在线设备列表
onUnmounted(() => {});
</script>

<style scoped></style>
