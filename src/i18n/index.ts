import { createI18n, type I18nOptions } from "vue-i18n";
import zhCn from "./locales/zh-cn";
import en from "./locales/en";

const options: I18nOptions = {
  legacy: false, // 解决Not available in legacy mode报错
  globalInjection: true, // 全局模式，可以直接使用 $t
  warnHtmlMessage: false,
  locale: localStorage.getItem("locale") || "zhCn",
  messages: {
    en,
    zhCn,
  },
};
const i18n = createI18n(options);
export const $i18n = i18n.global.t.bind(i18n.global);
export default i18n;
