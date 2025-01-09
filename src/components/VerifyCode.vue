<template>
  <div class="verifyCode">
    <div class="inputList" ref="inputListRef">
      <el-input
        v-for="(item, index) in code"
        :key="index"
        v-model="item.number"
        maxlength="1"
        style="font-size: 20px;text-align: center;"
        @keyup.delete="handleBackspace(index)"
        @input="handleInput(index)"
        @paste="handlePaste($event, index)"
        :class="{ focused: item.isFocused }"
        ref="inputRefs"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch, reactive, ref, onMounted, nextTick, defineEmits } from 'vue'
 const emits = defineEmits(['finish'])
const inputListRef = ref(null)
const inputRefs = ref([])
const code = reactive([
  { number: '', isFocused: false },
  { number: '', isFocused: false },
  { number: '', isFocused: false },
  { number: '', isFocused: false },
  { number: '', isFocused: false },
  { number: '', isFocused: false }
])
 
onMounted(() => {
  // 默认聚焦第一个输入框
  focusInput(0)
})
 
// 聚焦到指定的输入框
const focusInput = (index: number) => {
  nextTick(() => {
    const input = inputRefs.value[index].$el.querySelector('input')
    input.focus()
    code.forEach((item, i) => {
      item.isFocused = i === index
    })
  })
}
 
// 处理删除事件
const handleBackspace = (index: number) => {
  if (code[index].number === '' && index > 0) {
    focusInput(index - 1)
  } else {
    code[index].number = ''
  }
}
 
// 处理输入事件
const handleInput = (index: number) => {
  const _num = code[index].number
  // if ((/\D/).test(_num)) {
  //   code[index].number = code[index].number.replace(/\D/g, '');
  // } else {
    if (code[index].number.length > 0 && index < 5) {
      focusInput(index + 1)
    }
  // }
}
 
// 处理粘贴事件
const handlePaste = (event, index) => {
  event.preventDefault()
  const pastedText = event.clipboardData.getData('text').match(/\d/g)
  if (pastedText && pastedText.length <= 6) {
    pastedText.forEach((num, i) => {
      code[i].number = num
      if (i < 5) {
        focusInput(i + 1)
      }
    })
  }
}

watch(
  () => code,
  (value: {number: number | string}[]) => {
    const _code = value.map((i) => i.number).join("")
    if (_code.length === 6) {
      emits("finish", _code)
    }
  },
  {
    deep: true
  }
);
</script>
<style lang="less" scoped>
.verifyCode {
  width: 100%;
}
.inputList {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
 
  .el-input {
   width: 48px;
   :deep(input){
    text-align: center;
   }
  }
}

</style>