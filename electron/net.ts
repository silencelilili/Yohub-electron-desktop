import { net, session } from "electron";
import axios from "axios";

function login(data: any) {
  return new Promise((resolve, reject) => {
    axios
      .post("https://1119.yohub.online/auth/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // 处理成功的响应数据
        console.log("状态码:", response.status);
        console.log("响应头:", response.headers["set-cookie"]);
        console.log("响应数据:", response.data);
        _setCookieArray(
          response.headers["set-cookie"],
          "https://1119.yohub.online"
        );
        // _setCookieArray(response.headers["set-cookie"], "file://");
        resolve({ ...response.data, cookies: response.headers["set-cookie"] });
        try {
          const jsonData = JSON.parse(response.data);
          if (jsonData.ret == 1) {
            console.log("请求成功，执行相关操作", jsonData);
          } else {
            console.log("请求失败，处理错误", jsonData);
          }
        } catch (error) {
          console.log("数据不是JSON格式，直接处理数据:", response.data);
        }
      })
      .catch((error) => {
        // 处理错误情况
        console.error("错误信息:", error);
        if (error.response) {
          // 请求已发出，但服务器返回了错误状态码
          console.error("状态码:", error.response.status);
          console.error("响应数据:", error.response.data);
          reject(error.response.data);
        }
      });
  });
}

export function _setCookieArray(
  array: string[] | undefined,
  url: string
): string[] {
  const _arr =
    array?.map((cookieStr: string) => {
      const parts = cookieStr.split(";").map((part) => part.trim());
      const [nameValuePart, expires] = parts;
      const [name, value] = nameValuePart.split("=");
      const [expiresKey, expiresVal] = expires.split("=");

      const cookie = {
        url,
        name: name.trim(),
        value: value.trim(),
        secure: false,
        sameSite: "unspecified",
        expirationDate: new Date(expiresVal).getTime(),
        path: "/",
      };
      session.defaultSession.cookies.set(cookie).then(
        () => {
          // success
        },
        (error) => {
          console.error(error);
        }
      );
      return nameValuePart;
    }) || [];
  return _arr;
}

export { login };