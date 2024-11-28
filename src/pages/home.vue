<!--
 * @Date: 2024-10-17 09:43:33
 * @LastEditors: lixuedan
 * @FilePath: /src/pages/home.vue
 * @Description: 头部注释
-->
<template>
  <div class="flex">
    <button @click="handleConnect">连接</button>
    <button @click="handleDisconnect">断开</button>
    <button @click="handleLogin">登录</button>
  </div>
</template>
<script lang="ts" setup>
import { connect, disconnect } from "@/utils/yohub.desktop";
import { useRouter } from "vue-router";
const router = useRouter();
const handleConnect = () => {
  connect({ host: "127.0.0.1", port: "10808" });
};
const handleDisconnect = () => {
  disconnect();
};
const handleLogin = () => {
  router.push("/login");
};
</script>
<style lang="less" scoped></style>
