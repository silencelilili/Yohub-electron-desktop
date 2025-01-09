<template>
  <div class="flex h-100vh">
    <div class="flex-1 bg-color p-4">
      <div class="login-banner">
        <div class="banner-text">指尖一点 极速畅联</div>
      </div>
    </div>
    <div class="flex-1 flex flex-col p-4">
      <div class="login-title title-bar">
        <div class="pb-2">
          <img
            v-if="!isDark"
            src="@/assets/images/logo-dark.png"
            alt=""
            class="w-156px"
          />
          <img
            v-else
            src="@/assets/images/logo-light.png"
            alt=""
            class="w-156px"
          />
        </div>
      </div>
      <div class="bg-color p-9 h-100%">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useDark } from "@vueuse/core";
window.ipcRenderer.on("update-cookie", (res, d) => {
  console.log("update-cookie", res, d);
});
const isDark = useDark({
  storageKey: "yohub-theme",
});
</script>
<style lang="less" scoped>
.login-banner {
  height: 100%;
  background-image: url("@/assets/images/login-banner.png");
  // background-size: cover;
  background-position: center 80%;
  background-repeat: no-repeat;
}
.banner-text {
  text-align: center;
  font-size: 26px;
  font-weight: 500;
  position: relative;
  top: 10%;
}
</style>
