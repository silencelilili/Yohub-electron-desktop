<template>
  <div class="setting-wrap">
    <div class="setting-nav bg-color">
      <ul class="nav-ul">
        <li
          v-for="(item, index) in navList"
          :key="index"
          :class="[
            'nav-li li-item',
            { 'li-item-active': index === activeNavIndex },
          ]"
          @click="handleClickNav(item, index)"
        >
          <span class="nav-label"
            ><img :src="item.icon" alt="" /> {{ $t(item.label) }}</span
          >
          <el-icon><ArrowRight /></el-icon>
        </li>
      </ul>
    </div>
    <div class="setting-content bg-color">
      <component :is="componentId" :userInfo="userInfos"></component>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue";
import { navList } from "./config";
import { useUserStore } from "@/stores";
const userStore = useUserStore();

const componentId = ref(navList[0].component);
const activeNavIndex = ref(0);
const userInfos = computed(() => userStore.userInfo);

const handleClickNav = (item: any, index: number) => {
  componentId.value = item.component;
  activeNavIndex.value = index;
};
</script>
<style lang="less" scoped>
.setting-wrap {
  display: flex;
  gap: 16px;
  margin: 16px;
  height: 100%;
}
.setting-nav {
  width: 50%;
  .nav-ul {
    padding: 24px;
    .nav-li {
      .nav-label {
        display: flex;
        align-items: center;
        gap: 16px;
        img {
          width: 22px;
        }
      }
    }
  }
}
.setting-content {
  width: 50%;
}

// item边框样式
.li-item {
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    border: 1px solid #3366ff;
  }
}
.li-item-active {
  border: 1px solid #3366ff;
}
</style>
