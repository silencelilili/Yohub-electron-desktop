<template>
  <el-card shadow="never" style="border: none">
    <div class="login-form p-14">
      <div v-if="step !== 1" class="close-btn"> 
         <el-button link type="primary"><el-icon class="text-5" @click="backStep"><CloseBold /></el-icon>
        </el-button>
      </div>
      <!-- 1. 输入邮箱 -->
      <div v-if="step===1" class="flex-center-col">
        <div class="text-6 ">重置密码</div>
        <p class="my-10 secondary-color">请输入您的电子邮件地址， 我们将向您发送一个验证码，用于重设您的密码</p>
        <div class="w-full my-10">
          <el-form ref="emailFormRef" class="w-full" :model="emailForm">
            <el-form-item prop="email" :rules="emailRules.email">
              <el-input v-model="emailForm.email" placeholder="电子邮件地址" size="large" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" class="w-full" @click="handleSendEmailCode">发送</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-button link type="primary" @click="backLogin">返回登录</el-button>

      </div>

      <!-- 2. 输入验证码 -->
      <div v-if="step===2" class="flex-center-col">
        <div class="text-6 ">查看您的收件箱</div>
        <p class="my-10 secondary-color">如果该邮箱地址已注册过， 我们已发送验证码到您的邮箱，请检查您的邮箱。</p>
        <div>
          {{emailForm.email}}
        </div>
        <div class="w-full my-10 flex-center-col">
          <div class="mb-6">
            请输入验证码
          </div>
          <VerifyCode @finish="onCodeFinish" />
          <div class="mt-4">
            未收到验证码？ <el-link type="primary" @click="handleResend">重新发送</el-link>
          </div>
        </div>
      </div>

      <!-- 3. 重新输入新密码 -->
      <div v-if="step === 3" class="flex-center-col">
        <div class="text-6 ">请输入新密码</div>
        <div class="my-8">
           {{emailForm.email}}
        </div>
        <div class="my-10">
          <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="auto" status-icon class="w-full">
            <el-form-item prop="new_password">
              <el-input v-model="passwordForm.new_password" type="password" minlength="8" maxlength="16" placeholder="请输入登录密码" show-password @change="inputChange" />
            </el-form-item>
            <el-form-item prop="confirm_new_password">
              <el-input v-model="passwordForm.confirm_new_password" type="password" minlength="8" maxlength="16" placeholder="请确认登录密码" show-password />
            </el-form-item>
            <!-- <el-form-item >
              <div>密码强度</div>
              <PasswordStrength ref="passwordStrengthRef" />
            </el-form-item> -->
          </el-form>
          <p class="secondary-color">密码长度为8-16位，请勿使用旧密码。 </p>
          <p class="secondary-color">您将从所有设备退出此账号。</p>
        </div>
        <el-button type="primary" size="large" class="w-full" @click="handleReset">重置密码</el-button>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import VerifyCode from '@/components/VerifyCode.vue'
import PasswordStrength from '@/components/PasswordStrength.vue'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CloseBold } from '@element-plus/icons-vue'
import { validatePassword } from '@/utils/validate'
import { sendEmailCode, verifyEmailCode, resetPassword } from '@/api/user'

const router = useRouter()

const step = ref(1)
const toStep = (number=1) => {
  step.value = number
}
const backStep = () => {
  step.value-=1
}
const backLogin = () => {
  router.push('/login')
}

/*****************************************************************
 * 第一步
 ****************************************************************/
const emailFormRef = ref();
const emailForm = reactive({
  email: ''
});
const emailRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ]
};
// 发送验证码
const handleSendEmailCode =  async () => {
  if (!emailFormRef.value) return;
  const valid = await emailFormRef.value.validate();
  if (valid) {
    // TODO:调用API发送验证码
    try {
       await sendEmailCode({
        email: emailForm.email,
        scene_type: 1
      })
      ElMessage.success('验证码已发送，请查收邮箱');
      toStep(2)
    } catch (error) {
      // ElMessage.error('发送验证码失败');
    }
  }
}


/*****************************************************************
 * 第二步
 ****************************************************************/

const emailCode = ref()
// TODO:校验验证码是否正确
const onCodeFinish = async (code: string) => {
  console.log('code====', code)
  try {
    await verifyEmailCode({ email: emailForm.email, email_code: code })
    ElMessage.success('验证码验证成功');
    toStep(3)
  } catch (error) {
    
  }
}
// 重新发送
const handleResend = async () => {
 try {
    await sendEmailCode({
      email: emailForm.email,
      scene_type: 1
    })
    ElMessage.success('验证码已发送，请查收邮箱');
  } catch (error) {
  }
}


/****************************************************************
 * 第三步
 ****************************************************************/

const passwordFormRef = ref();
const passwordForm = reactive({
  new_password: '',
  confirm_new_password: '',
});
const passwordRules = {
  new_password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 16, message: '密码长度8至16个字符', trigger: 'blur' },
    // { validator: validatePassword, trigger: 'blur' },
  ],
  confirm_new_password: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { min: 8, max: 16, message: '确认密码长度8至16个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.new_password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
};

const passwordStrengthRef = ref()
const inputChange = () => {
  passwordStrengthRef.value.checkPassword(passwordForm.new_password)
}

// 确定重置密码
const handleReset = async () => {
  if (!passwordFormRef.value) return;
  const valid = await passwordFormRef.value.validate();
  if (valid) {
    // 调用API重置密码
    try {
      const _params = {
        email: emailForm.email,
        ...passwordForm
      }
      await resetPassword(_params)
      ElMessage.success('密码重置成功');
      // 跳转到登录页面
      router.push('/login');
    } catch (error) {
      ElMessage.error('网络错误');
    }
  }
}
</script>
<style lang="less" scoped>
.login-form{
  position: relative;
  .close-btn{
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>