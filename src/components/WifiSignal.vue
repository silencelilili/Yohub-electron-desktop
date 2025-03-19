<template>
  <div class="wifi-signal">
    <template v-if="!delayChanged">
      <div v-for="(bar, index) in signalBars" :key="index" :class="['signal-bar']" :style="{height: bar*3+'px'}"></div>
    </template>
    <template v-else>
      <div v-for="(bar, index) in signalBars" :key="index" :class="['signal-bar', getClass(index)]" :style="{height: bar*3+'px'}"></div>
    </template>
  </div>
</template>
<script lang="ts" setup>
  import { defineProps, ref, watch } from 'vue';

  const props = defineProps({
    delay: {
      type: Number,
      default: 0,
    },
  });
  const delay = ref(props.delay);
  // 信号条的数量
  const signalBars = [1, 2, 3, 4];
const delayChanged = ref(false)
  watch(
  () => props.delay,
    (newValue: any) => {
      // 更新延迟时间
      delay.value = newValue;
      delayChanged.value = true
    },
    {immediate: true}
);

  // 根据延迟时间返回相应的 CSS 类名
const getClass = (index: number): string => {
    const _delay = Number(delay.value) || 0;
    if (_delay < 150) {
      return 'high';
    } else if (_delay >= 150 && _delay < 300 && index < 3) {
      return 'high';
    } else if (_delay >= 300 && _delay < 1000 && index < 2) {
      return 'high';
    } else if (_delay >= 1000 && _delay < 3000 && index === 0) {
      return 'high';
    }
    return '';
  };
</script>
<style lang="less" scoped>
.wifi-signal {
  display: flex;
  align-items: flex-end;
}
.signal-bar {
  width: 3px;
  background-color: lightgray;
  margin: 0 1px;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}
.high {
  background-color: var(--el-color-primary);;
}
</style>