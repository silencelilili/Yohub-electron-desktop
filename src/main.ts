/*
 * @Date: 2024-10-15 16:23:40
 * @LastEditors: lixuedan
 * @FilePath: /src/main-index.ts
 * @Description: 头部注释
 */
import { createApp, defineCustomElement } from "vue";
import router from "./router";
import store from "./stores";
import "./styles/style.less";
import App from "./App.vue";
import i18n from "./i18n";
import "virtual:uno.css";
import "virtual:svg-icons-register";
import SvgIcon from "./components/SvgIcon.vue";
// import echarts from "./utils/echarts";
import "element-plus/theme-chalk/dark/css-vars.css";
import "./styles/dark/css-vars.less";
import "element-plus/es/components/message-box/style/css";
const app = createApp(App);
// 挂载路由
// setupRouter(app);
// 注册全局自定义指令
// app.directive("popupUl", {
//   created(el) {
//     el.style.display = "none";
//   },
// });
app.component("svg-icon", SvgIcon);
app.use(router);
app.use(i18n);
app.use(store);
// app.config.globalProperties.$echarts = echarts;//vue3的挂载方式
app.mount("#app").$nextTick(() => {
  // Remove Preload scripts loading
  postMessage({ payload: "removeLoading" }, "*");
});
