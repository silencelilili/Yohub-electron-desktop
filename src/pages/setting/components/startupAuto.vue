<template>
  <div class="p-4">
    <el-radio-group v-model="startLaunch" class="nav-ul radio-group-ul" @change="handleChange">
      <el-radio
        class="nav-li li-item"
        label="开机不自启"
        size="large"
        :value="false"
      >
      </el-radio>
      <el-radio
       class="nav-li li-item"
        label="开机自启"
        size="large"
        :value="true"
      />
    </el-radio-group>
  </div>
</template>
<script lang="ts" setup>
import { setAutoLaunch } from '@/utils/yohub.desktop';
import { getStore } from '@/utils/yohub.store';

// 获取本地存储信息开机启动
const startLaunch = ref(false);
onMounted(async () => {
  startLaunch.value = await getStore('autoLaunch') || false;
})
const handleChange = (val: boolean) => {
  setAutoLaunch(val);
};
</script>
<style lang="less" scoped>
.radio-group-ul{
  display: flex;
    flex-direction: column;
    .el-radio{
      width: calc(100% - 24px);
      padding: 12px;
      margin-right: 0;
      flex-direction: row-reverse;
    }
}
</style>
