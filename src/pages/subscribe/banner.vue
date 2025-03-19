<template>
  <!-- VIP信息 浮动的banner -->
  <div class="banner-wrap bg-color">
    <div class="font-size-6 fw-500 mt-7 cursor-pointer" @click="handleOpenProtocol('vip')"><el-text>VIP会员特权</el-text></div>
    <div v-for="(item, index) in bannerList" :key="index">
      <img :src="item.img" class="mb-2" style="width: 38px" />
      <div>
        <el-text>{{ item.label[0] }}</el-text>
      </div>
      <div class="mb-4">
        <el-text>{{ item.label[1] }}</el-text>
      </div>
    </div>
    <el-dialog
      v-model="vipDialogVisible"
      title="VIP会员特权详情"
      width="50%"
      center
      :footer="false"
    >
       <el-table :data="vipTableData" border style="width: 100%">
        <el-table-column prop="name" label="功能特权" />
        <el-table-column prop="vip" label="VIP会员" />
        <el-table-column prop="free" label="免费会员" />
      </el-table>
      
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const bannerList = [
  {
    img: new URL(`@/assets/images/vip-banner-1@2x.png`, import.meta.url).href,
    label: ["畅享全球", "影音直播服务"],
  },
  {
    img: new URL(`@/assets/images/vip-banner-2@2x.png`, import.meta.url).href,
    label: ["在线游戏", "低延时专线加速"],
  },
  {
    img: new URL(`@/assets/images/vip-banner-3@2x.png`, import.meta.url).href,
    label: ["全球100+", "高速专线"],
  },
  {
    img: new URL(`@/assets/images/vip-banner-4@2x.png`, import.meta.url).href,
    label: ["全时段", "不限流不限速"],
  },
  {
    img: new URL(`@/assets/images/vip-banner-5@2x.png`, import.meta.url).href,
    label: ["多设备", "同时在线"],
  },
];
const handleOpenProtocol = (type: string) => {
  vipDialogVisible.value = true
};

const vipDialogVisible = ref(false)
const vipTableData = [
  { name: '全平台支持', vip: 'Windows、MacOS、iOS、Android', free: 'Windows、MacOS、iOS、Android' },
  { name: '音视频加速', vip: 'CN2 回国优化链路加速', free: '普通链路直连' },
  { name: '游戏加速', vip: '游戏专线加速', free: '无' },
  { name: '音视频线路峰值', vip: '50Mb（4K）', free: '2Mb（SD）' },
  { name: '游戏专线峰值', vip: '20Mb', free: '无' },
  { name: '流量限制', vip: '无限制', free: '每月1GB免费流量' },
  { name: '客服支持', vip: '优先支持', free: '标准支持' },
  { name: '多设备在线',vip: '5', free: '1' },
    
]
</script>
<style lang="less" scoped>
.banner-wrap {
  width: 180px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  div {
    color: #333333;
  }
}
</style>
