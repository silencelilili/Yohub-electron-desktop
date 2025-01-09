<template>
   <div class="flex">
    <div class="m-4 flex-1">
      <div :class="['mb-4 p-6', userInfo?.class === 0 ? 'free-bg' : 'vip-bg']">
        <div class="flex items-center">
          <img
            v-if="userInfo?.class === 0"
            src="@/assets/images/users/free-logo@2x.png"
            alt=""
            class="w-60px"
          />
          <img
            v-else
            src="@/assets/images/users/vip-logo@2x.png"
            alt=""
            class="w-60px"
          />
          <div class="ml-4 flex-1">
            <div class="font-size-5 mb-3">{{ userInfo?.user_name }}</div>
            
            <!-- 普通会员 -->
            <div v-if="userInfo?.class === 0">
              <div class="progress-container">
                <div
                  class="progress-bar used-progress"
                  :style="{ width: transferProgress.total_width + '%' }"
                ></div>
                <div
                  class="progress-bar today-progress"
                  :style="{ width: transferProgress.today_width + '%' }"
                ></div>
              </div>
              <div class="flex-between-center mt-2">
                <span class="progress-text used-text"
                  >过去用量 {{ transferData.total }}</span
                >
                <span class="progress-text today-text"
                  >今日用量 {{ transferData.today }}</span
                >
                <span class="progress-text unused-text"
                  >剩余流量 {{ transferData.enable }}</span
                >
              </div>
            </div>
            <!-- vip -->
            <p v-else class="color-#8F6E36">
              您的VIP会员将在 <strong>{{userInfo?.class_expire_days}}</strong> 天后到期（{{userInfo?.class_expire}}）
            </p>
          </div>
        </div>
      </div>

      <el-card shadow="never" :class="['pos-relative h-100% subscribe-wrap']" :style="activeName==='1'?'height: calc(100vh - 150px - 72px);':'height: calc(100vh - 150px - 36px);'">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="选择订阅计划" name="1">
            <SubscribeVue type="user" />
          </el-tab-pane>
          <el-tab-pane label="我的历史订单" name="2">
            <OrderListVue />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <div v-if="!props.type" class="w-180px">
      <BannerVue />
    </div>
     
  </div>
</template>
<script lang="ts" setup>
import { onMounted, defineProps, ref, nextTick, computed, reactive } from "vue";
import BannerVue from "./banner.vue";
import { formatByteSize } from "@/utils";
import SubscribeVue from './subscribe.vue'
import OrderListVue from './order-list.vue'
import { useUserStore } from "@/stores";
const props = defineProps({
  type: {
    type: String,
    default: "",
  },
});
const userInfo = computed(() => useUserStore().userInfo);
const activeName = ref('1');


const transferProgress = computed(() => _getProgressWidth(userInfo.value));
const transferData = ref({
  enable: "0B", // 账户当前可用流量
  today: "0B", // 账户今日所用流量
  total: "0B",
});

onMounted(async () => {
  if(userInfo.value?.class === 0){
    transferData.value = {
      enable: formatByteSize(userInfo.value?.transfer_enable || (0 as number)),
      today: formatByteSize(userInfo.value?.transfer_today || (0 as number)),
      total: formatByteSize(userInfo.value?.transfer_total || (0 as number)),
    };
  }
});

const _getProgressWidth = (
  data = { transfer_enable: 0, transfer_today: 0, transfer_total: 0 }
) => {
  const today_width = (data.transfer_today / data.transfer_enable) * 100;
  const total_width = (data.transfer_total / data.transfer_enable) * 100;
  return {
    today_width,
    total_width,
  };
};

const handleClick = () => {
  // console.log('click');
};


</script>
<style lang="less" scoped>
.progress-container {
  height: 8px;
  background: #d5dee3;
  width: 100%;
  display: flex;
  .progress-bar {
    height: 100%;
  }
  .used-progress {
    background: #3365f9;
  }
  .today-progress {
    background: #24c390;
  }
}
.progress-text {
  font-size: 12px;
  &::before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    vertical-align: text-bottom;
    margin-right: 4px;
  }
}
.used-text {
  &::before {
    background: #3365f9;
  }
}
.today-text {
  &::before {
    background: #24c390;
  }
}
.unused-text {
  &::before {
    background: #d5dee3;
  }
}


.subscribe-wrap {
  overflow: auto;
}
</style>