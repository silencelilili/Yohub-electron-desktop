<template>
  <div class="about-wrap">
    <div class="h-70vh flex-center-col">
      <h2>Yohub.net</h2>
      <p class="my-4">V{{ version }}</p>
      <el-button link @click="handleCheckVersion">
        <el-icon color="mr-4"><RefreshRight /></el-icon> 检查版本
      </el-button>
    </div>
    <div class="">
      <p>
        <a
          class="color-#3366FF cursor-pointer mr-10"
          @click="handleOpen('services')"
          >服务协议</a
        >
        <a class="color-#3366FF cursor-pointer" @click="handleOpen('privacy')"
          >隐私政策</a
        >
      </p>
      <p class="color-#999">www.yohub.net</p>
    </div>

    <protocolsPage ref="protocolsRef" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { RefreshRight } from "@element-plus/icons-vue";
import protocolsPage from "../protocols/index.vue";
import pkg from "../../../package.json";
const version = ref(pkg.version);
const protocolsRef = ref();
const handleCheckVersion = () => {
  ElMessage.success("当前已是最新版本");
};

const handleOpen = (type: string) => {
  protocolsRef.value.open(type);
};
</script>
<style lang="less" scoped>
.about-wrap {
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>
