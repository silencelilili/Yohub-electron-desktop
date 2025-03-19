import { app, BrowserWindow, session, shell } from "electron";
import { _setCookieArray } from "./net";
import { store } from "./store";
import log from "./log";
import { API_BASE_URL } from "./utils";
let cookiesArr: string[] = [];
function useCookie(mainWindow: BrowserWindow | null) {
  const filter = { urls: [`${API_BASE_URL}/*`] };

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    if (details?.url?.startsWith(`${API_BASE_URL}`)) {
      // log.info("=========拦截到请求:" + details?.url);
      if (
        details.requestHeaders &&
        details.requestHeaders?.Cookie &&
        details.url.includes("auth/login")
      ) {
        cookiesArr = [];
        details.requestHeaders["Cookie"] = "";
        // log.info(["登录接口设置cookie:", details.requestHeaders["Cookie"]]);
      } else {
        details.requestHeaders["Cookie"] = cookiesArr.join("; ");
        // log.info(["其他接口设置cookie:", cookiesArr]);
      }
    }
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
  session.defaultSession.webRequest.onHeadersReceived(
    filter,
    (details, callback) => {
      // console.log("--------拦截到响应:", details?.url);
      // log.info("--------拦截到响应:" + details?.url);

      if (details.responseHeaders && details.responseHeaders["set-cookie"]) {
        cookiesArr = _setCookieArray(
          details.responseHeaders["set-cookie"],
          API_BASE_URL
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

  session.defaultSession.webRequest.onBeforeRedirect(filter, (details) => {
    log.info("--------Redirecting:" + details?.url);
    // if (details.url.includes("user/payment/purchase/stripe")) {
    //   if (details.responseHeaders && details.responseHeaders["location"]) {
    //     log.info("Redirecting:", details.responseHeaders["location"]);
    //     const _url = details.responseHeaders["location"][0];
    //     shell.openExternal(_url);
    // 这里可以自定义处理逻辑，比如取消重定向
    // callback({cancel: true});
    //   }
    // }
    // callback({ cancel: false });
  });
}
export default useCookie;
