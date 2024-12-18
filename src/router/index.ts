// import type { App } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import { routes } from "./routes";
import { useAppStore } from "@/stores";
const router = createRouter({
  history: createWebHashHistory(""),
  routes,
});

router.beforeEach((to, from, next) => {
  // 在这里编写你的拦截器逻辑
  // 'to' 是即将要进入的目标路由对象
  // 'from' 是当前导航正要离开的路由
  // 'next' 是一个函数，必须被调用，以解决这个钩子
  // 执行一些操作，例如检查用户是否登录

  // 假设我们有一个函数 `isUserLoggedIn` 来检查用户是否登录
  const isUserLoggedIn = () => {
    // 返回一个布尔值，表示用户是否登录
    return true; // 或者 false
  };
  useAppStore().setActiveMenu(to.name as string);
  if (to.name !== "Login" && !isUserLoggedIn()) {
    // 如果用户未登录且不是访问登录页面，则重定向到登录页面
    next({ name: "Login" });
  } else {
    // 继续到达目标路由
    next();
  }
});

// export async function setupRouter(app: App) {
//   app.use(router);
//   // 路由准备就绪后挂载APP实例
//   await router.isReady();
// }
export default router;
