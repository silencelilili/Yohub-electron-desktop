<template>
  <div class="realname-wrap">
    <!-- step 1  -->
    <template v-if="step === 1">
      <div class="file-content">
        <h3 class="text-center mb-4">实名认证说明</h3>
        <div class="color-#666">
          <p class="mb-4">根据《中华人民共和国网络安全法》及相关法律规定，使用 Yohub 加速服务访问社交类、内容创作类、在线社区与论坛、博客等应用或服务时，需完成实名认证。未完成实名认证的用户将无法加速上述类型的服务，但这并不会影响您使用 Yohub 提供的基础服务，例如音视频流媒体、网络游戏等加速功能。</p>
          <p class="mb-4">Yohub致力于为用户提供安全、高效的网络加速服务，同时严格遵守相关法规，保护用户权益和隐私。如需加速更多类型的应用或服务，请按指引完成实名认证。</p>
          <p>Yohub的实名认证服务由“支付宝”提供，请用户提前安装并认证相关应用。 您提交的身份信息仅用作实名认证使用，Yohub承诺不将其应用于任何其他场景，更不会透露给其他第三方。</p>
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
