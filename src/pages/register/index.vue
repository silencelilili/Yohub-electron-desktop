<template>
  <div class="login-form-wrap">
    <div class="flex flex-col h-full justify-around mx-9">
      <!-- 错误提示 -->
      <!-- <div>{{ apiErrorMsg }}</div> -->
      <div class="login-title">创建YoHub账号</div>
      <el-form
        ref="ruleFormRef"
        :model="formState"
        :rules="rules"
        label-width="auto"
        size="large"
        status-icon
      >
        <!-- <el-form-item prop="name">
          <el-input v-model="formState.name" maxlength="30" placeholder="请输入昵称" />
        </el-form-item> -->
        <el-form-item prop="email">
          <el-input
            v-model="formState.email"
            placeholder="请输入电子邮件地址"
          />
        </el-form-item>
         <el-form-item prop="emailcode">
          <CountdownCode :value="formState.email" :sceneType="0">
            <template #input>
              <el-input v-model="formState.emailcode" minlength="6" maxlength="6" placeholder="请输入验证码"></el-input>
            </template>
          </CountdownCode>
      
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formState.password"
            type="password"
            minlength="8"
            maxlength="16"
            placeholder="请输入登录密码"
            show-password
            @input="inputChange"
          />
          <!-- <PasswordStrength ref="passwordStrengthRef" /> -->
        </el-form-item>
        <el-form-item prop="confirm_password">
          <el-input
            v-model="formState.confirm_password"
            type="password"
            minlength="8"
            maxlength="16"
            placeholder="请确认登录密码"
            show-password
          />
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="formState.code"
            placeholder="请输入注册邀请码（可选）"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="w-full h-60px"
            v-loading="registerLoading"
            @click="handleSubmit(ruleFormRef)"
            >{{ registerLoading ? "正在注册..." : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>

      <p>
        已有账号？<el-button link type="primary" @click="toLogin">登录</el-button>
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { register } from "@/api/auth";
import type { FormInstance, FormRules } from "element-plus";
import PasswordStrength from "@/components/PasswordStrength.vue";
import CountdownCode from "@/components/CountdownCode.vue";
import { validateUsername, validateEmail, validatePassword } from '@/utils/validate'

const router = useRouter();
const ruleFormRef = ref();
const formState = reactive({
  tos: true,
  // name: "",
  email: "",
  emailcode: "",
  password: "",
  confirm_password: "",
  invite_code: "", // 邀请码
});
const rules: FormRules = {
  // name: [
  //   { required: true, message: "请输入昵称", trigger: "blur" },
  //   { validator: validateUsername, trigger: 'blur'}
  // ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { validator: validateEmail, trigger: 'blur'}
  ],
  emailcode: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { min: 6, max: 6, message: "验证码长度为6位", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 16, message: '密码长度8至16个字符', trigger: 'blur' },
    // { validator: validatePassword, trigger: 'blur'}
  ],
  confirm_password: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    // { min: 8, message: "密码必须为至少8个字符、大小写字母和符号的组合", trigger: "blur" },
    // { validator: validatePassword, trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formState.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }

  ],
};
// 提交
const registerLoading = ref(false);
const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      registerLoading.value = true;
      register(formState)
        .then((res) => {
          console.log(res);
          ElMessage.success("注册成功");
          registerLoading.value = false;
          toLogin();
        })
        .catch((err) => {
          registerLoading.value = false;
          console.error(err);
        });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const passwordStrengthRef = ref()
const inputChange = () => {
  // passwordStrengthRef.value.checkPassword(formState.password)
}
// 登录
const toLogin = () => {
  router.push({ path: "/login" });
};
</script>
<style lang="less" scoped>
.login-title {
  font-size: 1.625rem /* 26/16 */;
  text-align: center;
  margin-bottom: 2rem /* 32/16 */;
}
</style>
