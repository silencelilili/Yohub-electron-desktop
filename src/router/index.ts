// import type { App } from "vue";
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/home.vue"),
    meta: {
      locale: "首页",
      order: 1,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      locale: "登录",
      order: 2,
    },
  },
  // {
  //   path: '/downloads',
  //   name: 'downloads',
  //   component: () => import('@/pages/downloads.vue'),
  //   meta: {
  //     locale: '下载列表',
  //     order: 2,
  //   },
  // }
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
