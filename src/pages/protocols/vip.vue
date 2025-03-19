<template>
  <div>
    <el-table :data="vipTableData" border style="width: 100%">
      <el-table-column prop="name" label="功能特权" />
      <el-table-column prop="vip" label="VIP会员" />
      <el-table-column prop="free" label="免费会员" />
    </el-table>
  </div>
</template>
<script lang="ts" setup>
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
