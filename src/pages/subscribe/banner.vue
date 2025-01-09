<template>
  <!-- VIP信息 浮动的banner -->
  <div class="banner-wrap bg-color">
    <div class="font-size-6 fw-500 mt-7"><el-text>VIP会员特权</el-text></div>
    <div v-for="(item, index) in bannerList" :key="index">
      <img :src="item.img" class="mb-2" style="width: 38px" />
      <div>
        <el-text>{{ item.label[0] }}</el-text>
      </div>
      <div class="mb-4">
        <el-text>{{ item.label[1] }}</el-text>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import BannerPng1 from "@/assets/images/vip-banner-1@2x.png";
import BannerPng2 from "@/assets/images/vip-banner-2@2x.png";
import BannerPng3 from "@/assets/images/vip-banner-3@2x.png";
import BannerPng4 from "@/assets/images/vip-banner-4@2x.png";
import BannerPng5 from "@/assets/images/vip-banner-5@2x.png";

const bannerList = [
  {
    img: BannerPng1,
    label: ["畅享全球", "影音直播服务"],
  },
  {
    img: BannerPng2,
    label: ["在线游戏", "低延时专线加"],
  },
  {
    img: BannerPng3,
    label: ["全球100+", "高速专线"],
  },
  {
    img: BannerPng4,
    label: ["全时段", "不限流不限速"],
  },
  {
    img: BannerPng5,
    label: ["多设备", "同时在线"],
  },
];
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
