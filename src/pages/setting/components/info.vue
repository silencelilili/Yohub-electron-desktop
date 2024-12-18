<template>
  <div class="p-4">
    <ul class="nav-ul">
      <li class="nav-li li-item">
        <span>头像</span>
        <el-icon><ArrowRight /></el-icon>
      </li>
      <li class="nav-li li-item">
        <span>昵称</span>
        <span
          >{{ userInfo.user_name }} <el-icon><ArrowRight /></el-icon
        ></span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue";
const props = defineProps({
  userInfo: {
    type: Object,
    default: () => {
      return {
        user_name: "",
      };
    },
  },
});
const { userInfo } = toRefs(props);
</script>
<style lang="less" scoped></style>
