<template>
  <div class="home-wrap">
    <div class="home-sidebar">
      <NavBar :userInfo="userInfos" />
    </div>
    <div class="home-content flex-1">
      <HeaderBar class="title-bar" />
      <div class="flex justify-between items-center h-12">
        <!-- <div>YoHub {{ $t("app.title") }}</div> -->
        <div class="pl-4 pt-2 flex-1 title-bar">
          <img
            src="@/assets/images/logo-dark.png"
            alt=""
            class="w-100px"
          />
          <!-- <img
            src="@/assets/images/logo-light.png"
            alt=""
            class="w-100px"
          /> -->
          <el-alert v-if="userInfos?.class == 0" class="error-alert ml-2" type="error" :closable="false" style="padding:4px;">{{ !userInfos?.isEnable ? '您的体验流量已经用尽，请立即升级VIP！':' 立即升级VIP，畅享极速回国体验！'}}</el-alert>
          <!-- <el-alert v-if="userInfos?.class!==0 && !userInfos?.isEnable && userInfos?.alertMsg" class="error-alert ml-2" type="error" :closable="false" style="padding:4px;">{{userInfos?.alertMsg}}</el-alert> -->
        </div>
        <div class="op-list pr-4">
          <!-- <el-tooltip effect="dark" content="快速上手" placement="bottom">
            <svg-icon
              name="op-guide"
              @click="handleToPage('/guide')"
            ></svg-icon>
          </el-tooltip> -->
          <el-tooltip effect="dark" content="联系我们" placement="bottom">
            <svg-icon
              name="op-service"
              @click="handleToPage('/connectUs')"
            ></svg-icon>
          </el-tooltip>
          <!-- <el-tooltip effect="dark" content="切换语言" placement="bottom">
            <svg-icon name="op-language" @click="handleCommand()"></svg-icon>
          </el-tooltip>
          <el-tooltip effect="dark" content="切换主题" placement="bottom">
            <svg-icon
              :name="isDark ? 'op-light' : 'op-dark'"
              @click="toggleDark()"
            ></svg-icon>
          </el-tooltip> -->
          <el-tooltip effect="dark" content="我的消息" placement="bottom">
            <svg-icon
              name="op-message"
              @click="handleToPage('/notice')"
            ></svg-icon>
          </el-tooltip>
        </div>
      </div>
      <router-view v-slot="{ Component, route }" :key="routerKey">
        <transition name="fade" mode="out-in" appear>
          <component :is="Component" v-if="route.meta.ignoreCache" :key="route.fullPath" />
          <keep-alive v-else :include="cacheList">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>

      <!-- <keep-alive include="home">
        <router-view />
      </keep-alive> -->
    </div>
    <!-- 打开推荐页面，隐藏 -->
    <!-- <div class="invite-affix" @click="handleToPage('/invite')">
      <img src="@/assets/images/invite-icon.png" style="width: 42px" alt="" />
    </div> -->

  </div>
</template>
<script lang="ts" setup>
import NavBar from "@/components/NavBar.vue";
import { useLocale } from "@/hooks/useLocale";
// import { useDark, useToggle } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/stores";
import { useRoute, useRouter } from "vue-router";
import useConnectHook from "@/hooks/useConnect";
import useInit from "@/hooks/useInit";

const { currentLocale, changeLocale } = useLocale();
const route = useRoute();
const routerKey = computed(() => {
  return route.path + Math.random();
});
const cacheList = ['HomePage']
// 切换主题
// const isDark = useDark({
//   storageKey: "yohub-theme",
// });
// const toggleDark = useToggle(isDark);
// 切换语言
async function handleCommand() {
  const nextLocale = currentLocale.value === "zhCn" ? "en" : "zhCn";
  await changeLocale(nextLocale);
}
const router = useRouter();
const userInfos = computed(() => userStore.userInfo);
const userStore = useUserStore();
const { handleConnect, handleDisconnect } = useConnectHook();

onMounted(async () => {
  // 初始化
  await useInit()

  // 监听主进程发送的消息
  window.ipcRenderer.off("update-status", () => {});
  window.ipcRenderer.on("update-status", (res, d) => {
    console.log(`「监听」主进程消息 update-status 连接`, res, d);
    if (d === "connect") {
      // TODO:端口动态设置
      // handleConnect("10808");
    } else {
      handleDisconnect();
    }
  });
});

// 打开页面
const handleToPage = (path: string) => {
  if (path === '/connectUs') {
    window.$Yohub.$desktop({ type: "openExternal", data:"https://zsiq.io/qXgGk" });
  } else {
    router.push(path);
  }

};


</script>
<style lang="less" scoped>
.home-wrap {
  width: 100%;
  min-height: 100vh;//calc(100vh - 32px);
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
    height: 100vh;
    overflow: hidden;
  }
}
.op-list {
  // width: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 24px;
  gap: 16px;
  margin-left: 16px;
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
