<template>
  <div v-if="!isMacOS" class="header-bar">
    <div class="header-icon">
    <el-icon class="mr-4 cursor-pointer" @click="handleWinOpt('min')"><SemiSelect /></el-icon>

    <el-icon class="cursor-pointer" @click="handleWinOpt('close')"><CloseBold /></el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { SemiSelect, CloseBold } from '@element-plus/icons-vue'
import { handleWindow } from '@/utils/yohub.desktop'
const handleWinOpt = (type: string) => {
  handleWindow(type)
}
const isMacOS = window.$Yohub.$platform === 'darwin'
</script>
<style lang="less" scoped>
.header-bar{
  text-align: right;
  height: 28px;
  line-height: 28px;
  padding-right: 16px;
  justify-content: end;
}
.header-icon{
   -webkit-app-region: no-drag;
    user-select: auto;
}
</style>
