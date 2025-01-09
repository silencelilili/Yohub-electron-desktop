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
            v-model.trim="formState.email"
            placeholder="请输入账号/电子邮件地址"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model.trim="formState.password"
            show-password
            placeholder="请输入密码"
          />

          <div><el-checkbox v-model="formState.remember_me">记住账号密码</el-checkbox></div>
        </el-form-item>
        <el-form-item class="mt-6">
          <el-button
            type="primary"
            class="w-full h-60px"
            v-loading="loginLoading"
            @click="handleLogin"
            >{{ loginLoading ? "正在登录..." : "登录" }}</el-button
          >
        </el-form-item>
        <div class="flex justify-between">
          <el-button link class="desc-color" @click="toForgot"
            >忘记密码?</el-button
          >
          <el-button link type="primary" @click="toRegister"
            >立即注册</el-button
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
            @click="handleChangeLoginType(loginTypeEnum.WECHAT)"
          >
            <img src="@/assets/images/wechat.png" alt="" /></div
        ></el-col>
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
            @click="handleChangeLoginType(loginTypeEnum.QQ)"
          >
            <img src="@/assets/images/qq.png" alt="" /></div
        ></el-col>
        <el-col :span="6"
          ><div
            class="third-item"
            @click="handleChangeLoginType(loginTypeEnum.APPLE)"
          >
            <img src="@/assets/images/apple.png" alt="" /></div
        ></el-col>
      </el-row>
      <div class="desc-color text-center ft-14 color-#666666">
        成功登录即表示您同意我们的
        <a class="color-#3366FF cursor-pointer" @click="handleOpenProtocol('privacy')">《隐私政策》</a>
        和<a class="color-#3366FF cursor-pointer" @click="handleOpenProtocol('services')">《服务协议》</a>
      </div>
    </div>

    <protocolsPage ref="protocolsRef" />

  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/api/auth";
import { loginTypeEnum } from "./config";
import WechatPage from "./wechat.vue";
import protocolsPage from '../protocols/index.vue'

import { clearCookies, setStore, getStore, deleteStore } from "@/utils/yohub.store";
// import QQPage from './qq.vue';
const router = useRouter();
const loginType = ref(loginTypeEnum.PASSWORD);
const formState = ref({
  email: "", // chenkunpeng@gmail.com
  password: "", // Yohub!@#321
  remember_me: true,
  mfa_code: "",
});

const loginLoading = ref(false);
const apiErrorMsg = ref("");

onMounted(async () => {
  clearCookies();
  const account = await getStore("account");
  if (account) {
    formState.value = JSON.parse(account);
  }
});
const handleLogin = () => {
  loginLoading.value = true;
  // TODO: 判断是否需要记住密码
  login(formState.value)
    .then((res: any) => {
      loginLoading.value = false;
      // console.log("-----------", res);
      // const _cookies = res?.cookies || [];
      // getCookieArray(_cookies);
      // _cookies.forEach((cookie: any) => {
      //   document.cookie = cookie + "; SameSite=None; Secure";
      // });
      isRemberAccount(formState.value)
      router.push({ path: "/home" });
    })
    .catch((err: any) => {
      console.error(err);
      loginLoading.value = false;
      apiErrorMsg.value = err.msg;
    });
};
const isRemberAccount = (data: any) => {
  if (data.remember_me) {
    // 写入store
    setStore("account", JSON.stringify(data));
  } else {
    // 删除store
    deleteStore("account")
  }
};

// TODO:注册
const toRegister = () => {
  router.push("/register");
};

// TODO:忘记密码
const toForgot = () => {
  router.push("/forget");
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

// 打开协议
const protocolsRef = ref()
const handleOpenProtocol = (type: string) => {
  protocolsRef.value.open(type)
}
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
