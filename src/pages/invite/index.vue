<template>
  <el-card shadow="never" class="m-4 h-100%">
    <div class="flex-between-center mb-4">
      <h3>推荐返利</h3>
      <el-button link @click="handleClose"
        ><el-icon><Close /></el-icon
      ></el-button>
    </div>

    <div>
      <!-- 我的奖励 -->
      <div class="flex-between-center mb-8 invite-banner-bg p-8">
        <h3>我的奖励</h3>
        <div>
          <div>您已邀请注册</div>
          <h3 class="theme-color">{{ inviteInfoData.nums }}人</h3>
        </div>
        <div>
          <div>总返利金额</div>
          <h3 class="theme-color">￥{{ inviteInfoData.paybacks_sum }}</h3>
        </div>
      </div>

      <!-- 邀请链接 -->
      <el-card shadow="never" class="card-border">
        <h3 class="mb-4">获取推广链接</h3>
        <el-row :gutter="32">
          <el-col :span="12">
            <h4 class="mb-2">注册页链接</h4>
            <el-input class="mb-2" disabled v-model="inviteLink"></el-input>
            <el-button type="primary" @click="handleCopy">复制</el-button>
          </el-col>
          <el-col :span="12">
            <h4 class="mb-2">生成推广海报</h4>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { useUserStore } from "@/stores/index";
import { Close } from "@element-plus/icons-vue";
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { getInviteInfo } from "@/api/user";

const router = useRouter();
const userStore = useUserStore();
const inviteInfoData = ref({
  nums: 0,
  paybacks_sum: 0,
});

onMounted(() => {
  _getInviteInfoApi();
});
// 邀请链接
const inviteLink = computed(() => {
  const _base = import.meta.env.VITE_BASE_DOMAIN;
  const code = userStore?.userInfo?.code || ("" as string);
  return `${_base}/register?code=${code}`;
});
// 复制邀请链接
const handleCopy = () => {
  navigator.clipboard.writeText(inviteLink.value);
  ElMessage.success("复制成功");
};

// 获取邀请信息
const _getInviteInfoApi = () => {
  getInviteInfo().then((res) => {
    const _data = res.data;
    inviteInfoData.value = _data;
  });
};
// 关闭当前页面
const handleClose = () => {
  router.go(-1);
};
</script>
<style lang="less" scoped></style>
