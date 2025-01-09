<template>
  <div class="w-100% flex items-center">
    <div class="flex-1 mr-2">
      <slot name="input" :countdown="countdownInfo"></slot>
    </div>
    <el-button
      type="primary"
      :disabled="countdownInfo.isDisabled"
      @click="startCountdown"
    >
      {{ countdownInfo.buttonName }}
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { sendEmailCode } from '@/api/auth'

const props = defineProps({
  value: {
    type: String,
    default: ""
  },
  sceneType: {
    type: Number,
    default: 0
  }
});
const countdownInfo = ref({
  second: 60,
  buttonName: '获取验证码',
  isDisabled: false
});

const startCountdown = async () => {
  if(!props.value) return
  if (countdownInfo.value.isDisabled) return;

  // TODO:调用API发送验证码
  try {
     const _data = {
      email: props.value,
      sceneType: props.sceneType
    }
    await sendEmailCode(_data)
    ElMessage.success('验证码已发送，请查收邮箱');
  
    countdownInfo.value.isDisabled = true;
    countdownInfo.value.buttonName = `${countdownInfo.value.second}s后重新获取`;

    const interval = setInterval(() => {
      countdownInfo.value.second--;
      countdownInfo.value.buttonName = `${countdownInfo.value.second}s后重新获取`;

      if (countdownInfo.value.second <= 0) {
        clearInterval(interval);
        countdownInfo.value.second = 60;
        countdownInfo.value.buttonName = '获取验证码';
        countdownInfo.value.isDisabled = false;
      }
    }, 1000);
  } catch (error) {
    
  }
};

onMounted(() => {
  // 可以在这里处理页面刷新时的倒计时恢复逻辑
});
</script>