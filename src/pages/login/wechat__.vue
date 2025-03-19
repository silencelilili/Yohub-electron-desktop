<template>
  <div v-if="!isAuthenticated">
    <el-button text @click="emits('back', 'password')">
      <el-icon><ArrowLeftBold /></el-icon> 返回
    </el-button>
    <div class="text-center mt-10">
      <iframe
        :src="qrcodUrl"
        frameborder="0"
        width="400px"
        height="400px"
      ></iframe>
      <!-- <div id="weixinLogin"></div> -->
      <!-- <p>请使用微信扫码登录</p> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ArrowLeftBold } from "@element-plus/icons-vue";
import { wechatLogin, getWechatQrcode } from "@/api/auth";
const emits = defineEmits(["back"]);
const isAuthenticated = ref(false);

// 从环境变量或配置文件中获取 AppID 和 Redirect URI
const appId = import.meta.env.VUE_APP_WECHAT_APPID;
const appSecret = import.meta.env.VUE_APP_WECHAT_APPSECRET;
const redirectUri = import.meta.env.VITE_BASE_DOMAIN; // window.location.origin; // process.env.VUE_APP_WECHAT_REDIRECT_URI;
const qrcodUrl = ref("");
const _getWechatQrcode = () => {
  getWechatQrcode()
    .then((res) => {
      qrcodUrl.value = res.qCodeUrl;
    })
    .catch((err) => {
      console.error(err);
    });
};
// 处理微信登录回调
const handleLoginCallback = async (code) => {
  try {
    const response = await wechatLogin({ code, appId, appSecret });
    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      isAuthenticated.value = true;
    }
  } catch (error) {
    console.error("Error during WeChat login:", error);
  }
};

// 初始化
onMounted(() => {
  _getWechatQrcode();
  // setWxerwma();
  // 监听 URL 中的 code 参数
  if (window.location.hash.includes("code=")) {
    const code = window.location.hash.split("code=")[1].split("&")[0];
    handleLoginCallback(code);
  }
});

</script>
<style lang="less" scoped></style>
