<template>
  <div class="flex flex-col justify-between h-100%">
    <template v-if="loginType === loginTypeEnum.PASSWORD">
      <el-form
        ref="ruleFormRef"
        class="p-10 mt-8 flex-1"
        :model="formState"
        label-width="auto"
        size="large"
        status-icon
      >
        <el-form-item prop="email">
          <el-input
            v-model="formState.email"
            placeholder="请输入账号/电子邮件地址"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formState.password"
            show-password
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item class="mt-8">
          <el-button
            type="primary"
            class="w-full h-60px"
            v-loading="loginLoading"
            @click="handleLogin"
            >{{ loginLoading ? "正在登录..." : "登录" }}</el-button
          >
        </el-form-item>
        <div class="flex justify-between">
          <el-link :underline="false" class="desc-color" @click="toForgot"
            >忘记密码?</el-link
          >
          <el-link type="primary" :underline="false" @click="toRegister"
            >立即注册</el-link
          >
        </div>
      </el-form>
    </template>
    <!-- 微信登录 -->
    <div v-if="loginType === loginTypeEnum.WECHAT">
      <WechatPage @back="handleChangeLoginType" />
    </div>
    <!-- QQ登录 -->
    <div v-if="loginType === loginTypeEnum.QQ">
      <!-- <QQPage @back="handleChangeLoginType" /> -->
    </div>

    <!-- 第三方登录方式 -->
    <div v-if="loginType === loginTypeEnum.PASSWORD">
      <div class="text-center">
        <span class="secondary-color"> 使用第三方账号登录 </span>
      </div>
      <el-row :gutter="20" class="third-row">
        <el-col :span="6"
          ><div
            class="third-item"
            @click="handleChangeLoginType(loginTypeEnum.GOOGLE)"
          >
            <img src="@/assets/images/google.png" alt="" />
          </div>
        </el-col>
        <el-col :span="6"
          ><div
            class="third-item"
            @click="handleChangeLoginType(loginTypeEnum.APPLE)"
          >
            <img src="@/assets/images/apple.png" alt="" /></div
        ></el-col>
        <el-col :span="6"
          ><div
            class="third-item"
            @click="handleChangeLoginType(loginTypeEnum.WECHAT)"
          >
            <img src="@/assets/images/wechat.png" alt="" /></div
        ></el-col>
        <el-col :span="6"
          ><div
            class="third-item"
            @click="handleChangeLoginType(loginTypeEnum.QQ)"
          >
            <img src="@/assets/images/qq.png" alt="" /></div
        ></el-col>
      </el-row>
      <div class="desc-color text-center ft-14 color-#666666">
        成功登录即表示您同意我们的《隐私政策》和《服务协议》
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/api/auth";
import { loginTypeEnum } from "./config";
import WechatPage from "./wechat.vue";
// import { getCookieArray } from "@/utils";
// import QQPage from './qq.vue';
const router = useRouter();
const loginType = ref(loginTypeEnum.PASSWORD);
const formState = reactive({
  email: "chenkunpeng@gmail.com",
  password: "Yohub!@#321",
  remember_me: false,
  mfa_code: "",
});

const loginLoading = ref(false);
const apiErrorMsg = ref("");
const handleLogin = () => {
  loginLoading.value = true;
  login(formState)
    .then((res: any) => {
      loginLoading.value = false;
      console.log("-----------", res);
      // const _cookies = res?.cookies || [];
      // getCookieArray(_cookies);
      // _cookies.forEach((cookie: any) => {
      //   document.cookie = cookie + "; SameSite=None; Secure";
      // });
      router.push({ path: "/home" });
    })
    .catch((err: any) => {
      console.error(err);
      loginLoading.value = false;
      apiErrorMsg.value = err.msg;
    });
};

// TODO:注册
const toRegister = () => {
  router.push("/register");
};

// TODO:忘记密码
const toForgot = () => {
  router.push("/forgot");
};

// TODO: 第三方登录
// 切换登录方式
const handleChangeLoginType = (type: loginTypeEnum) => {
  if (type === loginTypeEnum.QQ) {
    // qqLogin();
  } else {
    loginType.value = type;
  }
};
</script>
<style lang="less" scoped>
.third-row {
  margin: 1.875rem 0;
  .third-item {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    // border: 1px solid #666;
    text-align: center;
    margin: 0 auto;
    line-height: 48px;
    cursor: pointer;
  }
}
</style>
