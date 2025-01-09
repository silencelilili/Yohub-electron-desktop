<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="70%"
    center
    top="24px"
  >
    <div class="protocol-container">
      <component :is="componentId"></component>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { defineExpose, ref } from "vue";
import servicesVue from "./services.vue";
import privacyVue from "./privacy.vue";
import refundVue from "./refund.vue";
const dialogVisible = ref(false);
const title = ref("");
const componentId = ref();
const open = (page: string) => {
  if (page === "services") {
    title.value = "服务协议";
    componentId.value = servicesVue;
  } else if (page === "privacy") {
    title.value = "隐私政策";
    componentId.value = privacyVue;
  } else if (page === "refund") {
    title.value = "退款说明";
    componentId.value = refundVue;
  }
  dialogVisible.value = true;
};
const close = () => {
  dialogVisible.value = false;
};

defineExpose({
  open,
  close,
});
</script>
<style lang="less" scoped>
.protocol-container {
  height: calc(100vh - 48px - 40px - 24px);
  overflow: auto;
}
</style>
