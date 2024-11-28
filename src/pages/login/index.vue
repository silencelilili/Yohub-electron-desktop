<template>
  <div class="flex h-100%">
    <div class="flex-1 bg-white p-4">
      <div class="login-banner">
        <div class="color-#333">指尖一点 极速畅联</div>
      </div>
      <!-- <img src="@/assets/images/login-banner@2x.jpg" alt="" /> -->
    </div>
    <div class="flex-1 flex flex-col p-4">
      <div class="login-title">YoHub</div>

      <div class="bg-white p-9 flex-1 flex flex-col justify-between">
        <el-form
          ref="ruleFormRef"
          class="p-10"
          :model="formState"
          label-width="auto"
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
            <el-button type="primary" class="w-full h-60px" @click="handleLogin"
              >登录</el-button
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

        <!-- 第三方登录方式 -->
        <div>
          <div class="flex justify-between">
            <div class="flex-1">
              <el-divider class="desc-color">第三方登录</el-divider>
            </div>
          </div>
          <el-row :gutter="20" class="third-row">
            <el-col :span="6"
              ><div class="third-item">
                <img src="@/assets/images/google.png" alt="" />
              </div>
            </el-col>
            <el-col :span="6"
              ><div class="third-item">
                <img src="@/assets/images/apple.png" alt="" /></div
            ></el-col>
            <el-col :span="6"
              ><div class="third-item">
                <img src="@/assets/images/wechat.png" alt="" /></div
            ></el-col>
            <el-col :span="6"
              ><div class="third-item">
                <img src="@/assets/images/qq.png" alt="" /></div
            ></el-col>
          </el-row>
          <div class="desc-color text-center ft-14 color-#666666">
            成功登录即表示您同意我们的《隐私政策》和《服务协议》
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/api/auth";
const router = useRouter();
const formState = reactive({
  email: "chenkunpeng@gmail.com",
  password: "Yohub!@#321",
  remember_me: false,
  mfa_code: "",
});

const apiErrorMsg = ref("");
const handleLogin = () => {
  login(formState)
    .then((res: any) => {
      // store.setLoginStatus(true);
      router.push({ path: "/" });
    })
    .catch((err: any) => {
      console.error(err);
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
</script>
<style lang="less" scoped>
.login-banner {
  height: 100%;
  background-image: url("@/assets/images/login-banner@2x.jpg");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.third-row {
  margin: 1.875rem 0;
  .third-item {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid #666;
    text-align: center;
    margin: 0 auto;
    line-height: 48px;
  }
}
</style>
