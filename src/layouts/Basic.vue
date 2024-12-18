<template>
  <div class="home-wrap">
    <div class="home-sidebar">
      <NavBar :userInfo="userInfos" />
    </div>
    <div class="home-content flex-1">
      <div class="flex justify-between items-center h-12">
        <!-- <div>YoHub {{ $t("app.title") }}</div> -->
        <div class="pl-4 pt-2">
          <img
            v-if="!isDark"
            src="@/assets/images/logo-dark.png"
            alt=""
            class="w-100px"
          />
          <img
            v-else
            src="@/assets/images/logo-light.png"
            alt=""
            class="w-100px"
          />
        </div>
        <div class="op-list">
          <el-tooltip effect="dark" content="快速上手" placement="bottom">
            <svg-icon name="op-guide"></svg-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="联系我们" placement="bottom">
            <svg-icon name="op-service"></svg-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="切换语言" placement="bottom">
            <svg-icon name="op-language" @click="handleCommand()"></svg-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="切换主题" placement="bottom">
            <svg-icon
              :name="isDark ? 'op-light' : 'op-dark'"
              @click="toggleDark()"
            ></svg-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="我的消息" placement="bottom">
            <svg-icon name="op-message"></svg-icon>
          </el-tooltip>
        </div>
      </div>
      <keep-alive include="home">
        <router-view />
      </keep-alive>
    </div>
    <div class="invite-affix" @click="toInvitePage">
      <img src="@/assets/images/invite-icon.png" style="width: 42px" alt="" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import NavBar from "@/components/NavBar.vue";
import { useLocale } from "@/hooks/useLocale";
import { useDark, useToggle } from "@vueuse/core";
import { getUserInfo } from "@/api/user";
import { computed, onMounted } from "vue";
import { useUserStore } from "@/stores";
import { useSubConfig } from "@/hooks/useSubConfig";
import { useRouter } from "vue-router";

const { currentLocale, changeLocale } = useLocale();

// 切换主题
const isDark = useDark({
  storageKey: "yohub-theme",
});
const toggleDark = useToggle(isDark);
// 切换语言
async function handleCommand() {
  const nextLocale = currentLocale.value === "zhCn" ? "en" : "zhCn";
  await changeLocale(nextLocale);
}
const router = useRouter();
const userInfos = computed(() => userStore.userInfo);
const userStore = useUserStore();
onMounted(async () => {
  // 获取用户信息
  await userStore.getUserInfoApi();
  useSubConfig().getConfig("json");
  // getUserInfoApi();
  console.log("-----", userStore.userInfo);
});

// 打开推荐页面
const toInvitePage = () => {
  router.push("/invite");
};
</script>
<style lang="less" scoped>
.home-wrap {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid:
    "home-sidebar home-content" 1fr
    / 220px 1fr;
  gap: 0;

  .home-sidebar {
    grid-area: home-sidebar;
    width: 220px;
    height: 100vh;
    position: fixed;
  }
  .home-content {
    grid-area: home-content;
    flex: 1;
    // overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }
}
.op-list {
  width: 30%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 24px;
  .svg-icon {
    cursor: pointer;
    color: var(--el-text-color-primary);
  }
}

.invite-affix {
  position: fixed;
  bottom: 6px;
  left: 4px;
  cursor: pointer;
}
</style>
