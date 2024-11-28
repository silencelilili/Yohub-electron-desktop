<template>
  <div class="flex h-100%">
    <div class="left-navbar">
      <NavBar />
    </div>
    <div class="right-content flex-1">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts" setup>
import NavBar from "@/components/NavBar.vue";
</script>
<style lang="less" scoped>
.left-navbar {
  width: 220px;
}
</style>
