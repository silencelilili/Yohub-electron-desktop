<template>
  <div class="p-8">
    <div class="mb-10 network-repair">
      <div class="network-repair-item">
        <span>系统自检</span> <el-icon><RefreshRight /></el-icon>
      </div>
      <div class="network-repair-item">
        <span>本地网络检测</span><el-icon><RefreshRight /></el-icon>
      </div>
      <div class="network-repair-item">
        <span>服务节点检测</span
        ><el-icon class="is-loading"><Loading /></el-icon>
      </div>
      <div class="network-repair-item">
        <span>设备系统检测</span
        ><el-icon><CircleCheck color="#67c23a" /></el-icon>
      </div>
      <div class="network-repair-item">
        <span>客户端完整性</span
        ><el-icon><CircleClose color="#f56c6c" /></el-icon>
      </div>
    </div>

    <div class="my-6">
      <el-button type="primary" plain class="w-100%">发送检测日志</el-button>
    </div>
    <div>
      <el-button type="primary" plain class="w-100%">网络重置</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  RefreshRight,
  Loading,
  CircleCheck,
  CircleClose,
} from "@element-plus/icons-vue";
</script>
<style lang="less" scoped>
.network-repair {
  .el-icon {
    cursor: pointer;
  }
  .network-repair-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 36px;
  }
}
</style>
