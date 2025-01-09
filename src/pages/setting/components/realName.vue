<template>
  <div class="realname-wrap">
    <!-- step 1  -->
    <template v-if="step === 1">
      <div class="file-content">
        <h3 class="text-center mb-4">实名认证使用条款</h3>
        <div class="color-#666">
          <p class="mb-4">根据《中华人民共和国网络安全法》及相关法律规定，用户加速社交类应用前必须完成实名认证。当前实名认证服务由“支付宝”提供，请用户提前安装并认证相关应用。</p>
          <p>您提交的身份信息仅用作实名认证使用，Yohub承诺不将其应用于任何其他场景，更不会透露给其他第三方。</p>
        </div>
      </div>
      <div>
        <el-button
        type="primary"
        size="large"
        class="w-100% mt-6"
        @click="handleToAuth"
        >我已知晓，去认证</el-button
      >
      </div>
    </template>

    <!-- step 2 -->
     <template v-if="step === 2">
      <div class="file-content">
        <h3 class="text-center mb-4">实名认证</h3>
        <div class="color-#666">
          <p class="mb-4">完成实名即可加速下列社交应用</p>
        </div>
      </div>
      <div>
        <div class="my-6">
          <el-button type="primary" class="w-100%" size="large" @click="step = 3">使用支付宝扫码认证</el-button>
        </div>
        <div>
          <el-button class="w-100%" size="large" @click="step = 1">取消</el-button>
        </div>
      </div>
    </template>


    <!-- step 3 -->
     <template v-if="step === 3">
      <div class="file-content">
        <h3 class="text-center mb-4">实名认证</h3>
        <div class="color-#666">
          <p class="mb-4">请上传您的身份证正反面照片，并填写您的姓名和身份证号。</p>
        </div>
      </div>
      <div>
        <el-button
        size="large"
        class="w-100% mt-6"
        @click="step = 2"
        >取消</el-button>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const step = ref(1)
const handleToAuth = () => {
    step.value = 2
}
</script>
<style lang="less" scoped>
.realname-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 24px 0;
  .file-content {
    overflow: auto;
    height: calc(100vh - 245px);
  }
}
</style>
