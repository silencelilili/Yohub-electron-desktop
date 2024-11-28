/*
 * @Date: 2024-10-15 16:23:40
 * @LastEditors: lixuedan
 * @FilePath: /src/main-index.ts
 * @Description: 头部注释
 */
import { createApp, defineCustomElement } from "vue";
import router from "./router";
import "./style.less";
import App from "./App.vue";
import "virtual:uno.css";

const app = createApp(App);
// 挂载路由
// setupRouter(app);
// 注册全局自定义指令
// app.directive("popupUl", {
//   created(el) {
//     el.style.display = "none";
//   },
// });
app.use(router);
app.mount("#app").$nextTick(() => {
  // Remove Preload scripts loading
  postMessage({ payload: "removeLoading" }, "*");

  // Use contextBridge
  // window.ipcRenderer.on('main-process-message', (_event, message) => {
  //   console.log(message)
  // })
});
