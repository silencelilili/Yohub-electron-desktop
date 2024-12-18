import { app, BrowserWindow, session } from "electron";
import { _setCookieArray } from "./net";
import { store } from "./store";
import log from "./log";
const BASE_URL = "https://1119.yohub.online";
let cookiesArr: string[] = [];
function useCookie(mainWindow: BrowserWindow | null) {
  const filter = { urls: [`${BASE_URL}/*`] };
  store.set("useCookie", filter);

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    if (details?.url?.startsWith(`${BASE_URL}`)) {
      const _cook = store.get("cookies");
      log.info("=========拦截到请求:" + details?.url);
      log.info(["=========拦截到请求，本地-cookie:", _cook]);
      // log.info("=========拦截到请求-requestHeaders:", details.requestHeaders);
      // log.info("=========拦截到请求-cookiesArr:", cookiesArr);
      if (
        details.requestHeaders &&
        details.requestHeaders?.Cookie &&
        details.url.includes("auth/login")
      ) {
        cookiesArr = [];
        details.requestHeaders["Cookie"] = "";
        log.info(["登录接口设置cookie:", details.requestHeaders["Cookie"]]);
      } else {
        details.requestHeaders["Cookie"] = cookiesArr.join("; ");
        log.info(["其他接口设置cookie:", cookiesArr]);
      }
      // if (
      //   details.requestHeaders &&
      //   !details.requestHeaders?.Cookie &&
      //   cookiesArr.length &&
      //   !details.url.includes("auth/login")
      // ) {
      //   details.requestHeaders["Cookie"] = cookiesArr.join("; ");
      // }
    }
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
  session.defaultSession.webRequest.onHeadersReceived(
    filter,
    (details, callback) => {
      // console.log("--------拦截到响应:", details?.url);
      log.info("--------拦截到响应:" + details?.url);

      if (details.responseHeaders && details.responseHeaders["set-cookie"]) {
        cookiesArr = _setCookieArray(
          details.responseHeaders["set-cookie"],
          BASE_URL
        );
        if (details.url.includes("user/logout")) {
          cookiesArr = [];
          store.delete("cookies");
        } else {
          store.set("cookies", cookiesArr);
        }
        for (let i = 0; i < details.responseHeaders["set-cookie"].length; i++) {
          details.responseHeaders["set-cookie"][i] += "; SameSite=None; Secure";
        }
      }
      callback({ responseHeaders: details.responseHeaders });
    }
  );
}
export default useCookie;
