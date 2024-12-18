import { RouteRecordRaw } from "vue-router";
import BasicLayout from "@/layouts/Basic.vue";
import PassportLayout from "@/layouts/Passport.vue";

export const homeRoutes: RouteRecordRaw = {
  path: "/",
  name: "index",
  component: BasicLayout,
  redirect: "/login",
  meta: {
    locale: "首页",
    order: 1,
  },
  children: [
    {
      path: "home",
      name: "home",
      alias: "/user",
      component: () => import("@/pages/home/index.vue"),
      meta: {
        locale: "menu.speedStatus",
        order: 1,
        icon: "nav-speed",
      },
    },

    {
      path: "subscribe",
      name: "subscribe",
      component: () => import("@/pages/subscribe/index.vue"),
      meta: {
        locale: "menu.mySub",
        order: 2,
        icon: "nav-subscribe",
      },
    },
    {
      path: "ticket",
      name: "ticket",
      component: () => import("@/pages/ticket/index.vue"),
      meta: {
        locale: "menu.myTicket",
        order: 3,
        icon: "nav-ticket",
      },
    },
    {
      path: "setting",
      name: "setting",
      component: () => import("@/pages/setting/index.vue"),
      meta: {
        locale: "menu.systemConfig",
        order: 4,
        icon: "nav-setting",
      },
    },
    {
      path: "about",
      name: "about",
      component: () => import("@/pages/about/index.vue"),
      meta: {
        locale: "menu.about",
        order: 5,
        icon: "nav-about",
      },
    },
    {
      path: "invite",
      name: "invite",
      component: () => import("@/pages/invite/index.vue"),
      meta: {
        locale: "menu.invite",
        order: 6,
        hide: true,
      },
    },
  ],
};

export const passportRoutes: RouteRecordRaw = {
  path: "/passport",
  name: "passport",
  component: PassportLayout,
  redirect: "/login",
  meta: {
    requiresAuth: false,
    order: 1,
  },
  children: [
    {
      path: "/login",
      name: "login",
      alias: "/auth/login",
      component: () => import("@/pages/login/index.vue"),
      meta: {
        locale: "登录",
        requiresAuth: false,
        order: 2,
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/pages/register/index.vue"),
      meta: {
        locale: "注册",
        requiresAuth: false,
        order: 3,
      },
    },
    {
      path: "/forget",
      name: "forget",
      component: () => import("@/pages/forget/index.vue"),
      meta: {
        locale: "忘记密码",
        requiresAuth: false,
        order: 4,
      },
    },
  ],
};

export const routes: Array<RouteRecordRaw> = [passportRoutes, homeRoutes];
