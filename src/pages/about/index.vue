<template>
  <div class="about-wrap">
    <div class="h-70vh flex-center-col">
      <h2>Yohub.cool</h2>
      <p>V{{ version }}</p>
      <el-text>
        <el-icon><RefreshRight /></el-icon>
        检查版本
      </el-text>
    </div>
    <div class="">
      <p>
        <span class="mr-10">服务协议</span>
        <span>隐私政策</span>
      </p>
      <p class="color-#999">www.yohub.cool</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { RefreshRight } from "@element-plus/icons-vue";
const version = ref("1.0.0");
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
