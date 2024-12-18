<template>
  <div class="p-4">
    <ul class="list-ul">
      <li class="list-li">
        <span class="list-li_label">YoHubID</span>
        <span class="list-li_value">{{ userInfo.id }}</span>
      </li>
      <li class="list-li">
        <span class="list-li_label">YoHub密码</span>
        <span class="list-li_value"
          >更改密码 <el-icon><ArrowRight /></el-icon
        ></span>
      </li>
      <li class="list-li">
        <span class="list-li_label">绑定邮箱</span>
        <span class="list-li_value"
          >{{ userInfo.email }} <el-icon><ArrowRight /></el-icon
        ></span>
      </li>
      <li class="list-li">
        <span class="list-li_label">绑定手机</span>
        <span class="list-li_value"
          >去绑定 <el-icon><ArrowRight /></el-icon
        ></span>
      </li>
    </ul>
    <div class="my-4 theme-color">绑定第三方账号</div>
    <ul class="list-ul">
      <li class="list-li">
        <span class="list-li_label">Google</span>
        <span class="list-li_value"
          >去绑定 <el-icon><ArrowRight /></el-icon
        ></span>
      </li>
      <li class="list-li">
        <span class="list-li_label">Apple ID</span>
        <span class="list-li_value"
          >去绑定 <el-icon><ArrowRight /></el-icon
        ></span>
      </li>
      <li class="list-li">
        <span class="list-li_label">微信</span>
        <span class="list-li_value"
          >去绑定 <el-icon><ArrowRight /></el-icon
        ></span>
      </li>
      <li class="list-li">
        <span class="list-li_label">QQ</span>
        <span class="list-li_value"
          >去绑定 <el-icon><ArrowRight /></el-icon
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
        id: "",
        email: "",
      };
    },
  },
});
const { userInfo } = toRefs(props);
</script>
<style lang="less" scoped></style>
