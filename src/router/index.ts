// import type { App } from "vue";
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

import BasicLayout from "@/layouts/Basic.vue";
export const homeRoutes: RouteRecordRaw = {
  path: "/",
  name: "index",
  component: BasicLayout,
  redirect: "/home",
  meta: {
    locale: "首页",
    order: 1,
  },
  children: [
    {
      path: "home",
      name: "home",
      component: () => import("@/pages/home/index.vue"),
      meta: {
        locale: "加速状态",
        order: 1,
      },
    },

    {
      path: "subscribe",
      name: "subscribe",
      component: () => import("@/pages/subscribe/index.vue"),
      meta: {
        locale: "我的订阅",
        order: 2,
      },
    },
    {
      path: "workorder",
      name: "workorder",
      component: () => import("@/pages/workorder/index.vue"),
      meta: {
        locale: "我的工单",
        order: 3,
      },
    },
    {
      path: "setting",
      name: "setting",
      component: () => import("@/pages/setting/index.vue"),
      meta: {
        locale: "系统配置",
        order: 4,
      },
    },
    {
      path: "about",
      name: "about",
      component: () => import("@/pages/about/index.vue"),
      meta: {
        locale: "关于Yohub",
        order: 5,
      },
    },
  ],
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      locale: "登录",
      order: 2,
    },
  },
  homeRoutes,
];

const router = createRouter({
  history: createWebHashHistory(""),
  routes,
});

// export async function setupRouter(app: App) {
//   app.use(router);
//   // 路由准备就绪后挂载APP实例
//   await router.isReady();
// }
export default router;
