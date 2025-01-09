<template>
  <div class="password-strength">
    <div class="strength-indicator">
      <div v-for="(strength, index) in passwordStrength" :key="index" :class="['strength-bar', getStrengthClass(strength) ]">
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineEmits, defineExpose } from 'vue'
  const strengthLevel = ref(0)
  const passwordStrength = ref(['', '', '', '', '']);

  const emits = defineEmits(['level'])
  const checkPassword = (password: string) => {
    const length = password.length
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const types = [hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar].filter(Boolean).length;
    passwordStrength.value = ['', '', '', '', ''];

    if (length>=8) {
      if (types === 1) {
        passwordStrength.value[0] = 'weak';
      } else if (types === 2) {
         passwordStrength.value[0] = 'weak';
        passwordStrength.value[1] = 'weak';
      } else if (types === 3) {
        passwordStrength.value[0] = 'medium';
        passwordStrength.value[1] = 'medium';
        passwordStrength.value[2] = 'medium';
      } else if (types === 4) {
        passwordStrength.value[0] = 'strong';
        passwordStrength.value[1] = 'strong';
        passwordStrength.value[2] = 'strong';
        passwordStrength.value[3] = 'strong';
        if (length >= 12) {
        passwordStrength.value[4] = 'strong';
        }
      }
      strengthLevel.value = types
      emits('level', strengthLevel.value)
    }
  }
   function getStrengthClass(strength: string) {
    if (strength === 'weak') return 'weak';
    if (strength === 'medium') return 'medium';
    if (strength === 'strong') return 'strong';
    return '';
  }

  defineExpose({
    checkPassword
  })

</script>

<style scoped lang="less">
.password-strength {
 width: 100%;
}

.strength-indicator {
  display: flex;
  margin-top: 5px;
}

.strength-bar {
  flex: 1;
  height: 5px;
  background-color: #e0e0e0;
  margin-right: 5px;
  transition: background-color 0.3s;
  width: 30%;
  border-radius: 5px;
}

.weak {
  background-color: red !important;
}

.medium {
  background-color: orange !important;
}

.strong {
  background-color: green !important;
}
</style>
