<template>
  <div class="flex flex-col justify-between items-center h-full bg-color">
    <div class="h-130px flex-center justify-center nav-avatar">
      <el-avatar :size="50" :src="circleUrl" class="mr-3" />
      <div>{{ userInfo.user_name }}</div>
    </div>
    <el-menu class="navbar-ul w-full flex-1">
      <el-menu-item
        v-for="item in navMenuList"
        :class="['navbar-li', { 'is-active': activeMenuName === item.name }]"
        :key="item.name"
        :index="item.name"
        @click="handleOpen(item.name)"
      >
        <svg-icon :name="item?.meta?.icon"></svg-icon>
        <span class="ml-3">{{ $t(item?.meta?.locale) }}</span>
      </el-menu-item>
    </el-menu>

    <div class="navbar-logout h-70px border-top bg-color">
      <div class="cursor-pointer" @click="handleLogout">
        <svg-icon name="nav-logout" class="mr-3"></svg-icon>
        {{ $t("menu.logout") }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { homeRoutes } from "@/router/routes";
import { defineProps, toRefs, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppStore, useUserStore } from "@/stores";
import { ElLoading } from "element-plus";
const props = defineProps({
  userInfo: {
    type: Object,
    default: () => {
      return {
        user_name: "",
      };
    },
  },
});
const router = useRouter();
const circleUrl =
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";

const { userInfo } = toRefs(props);
const activeMenuName = ref("home");
const appStore = useAppStore();
const userStore = useUserStore();

const navMenuList = computed(() => {
  const _list = homeRoutes.children || [];
  const _menu = _list.filter((item: any) => {
    return !item?.meta?.hide;
  });
  return _menu;
});

onMounted(() => {
  activeMenuName.value = appStore.activeMenu;
});
const handleOpen = (key: string) => {
  router.push({ name: key });
  activeMenuName.value = key;
  appStore.setActiveMenu(key);
};

// 退出登录
const handleLogout = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "正在退出",
    background: "rgba(0, 0, 0, 0.7)",
  });
  userStore
    .logoutApi()
    .then(() => {
      loading.close();
      router.push("/login");
    })
    .catch(() => {
      loading.close();
      router.push("/login");
    });
};
</script>
<style lang="less" scoped>
.nav-avatar {
  background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, #3366ff9c 100%);
  width: 100%;
}
.navbar-ul {
  border: none;
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
  // border-top: 1px solid #eee;
}
</style>
