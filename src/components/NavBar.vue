<template>
  <div class="flex flex-col justify-between items-center h-full bg-white">
    <div class="h-130px">头像</div>
    <!-- <ul class="navbar-ul flex-1 w-full text-center">
      <li v-for="(item, index) in menuList" :key="index" class="navbar-li">
        {{ item.title }}
      </li>
    </ul> -->

    <el-menu
      class="navbar-ul w-full flex-1"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item
        v-for="item in homeRoutes.children"
        class="navbar-li"
        :key="item.name"
        :index="item.name"
      >
        <el-icon><icon-menu /></el-icon>
        <span>{{ item?.meta?.locale }}</span>
      </el-menu-item>
    </el-menu>

    <div class="navbar-logout h-70px">
      <div class="cursor-pointer" @click="handleLogout">退出登录</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { logout } from "@/api/auth";
import router, { homeRoutes } from "@/router";
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
  router.push({ name: key });
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};

// 退出登录
const handleLogout = async () => {
  await logout();
  router.push({ name: "login" });
};
</script>
<style lang="less" scoped>
.navbar-ul {
  .navbar-li {
    height: 46px;
    line-height: 46px;
    margin: 16px 12px;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      background-color: #3366ff;
      color: #fff;
    }
  }
  .is-active {
    background-color: #3366ff;
    color: #fff;
  }
}
.navbar-logout {
  width: 100%;
  text-align: center;
  line-height: 70px;
  border-top: 1px solid #eee;
}
</style>
