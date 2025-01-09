export function convertByte(byteValue: number) {
  const kbValue = byteValue / 1024;
  if (kbValue >= 1024) {
    const mbValue = kbValue / 1024;
    return `${mbValue.toFixed(2)}mb/s`;
  }
  return `${kbValue.toFixed(2)}kb/s`;
}
/**
 * 格式化流量单位，默认为（B）
 * @param bytes
 * @returns
 */
export function formatByteSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;
  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024;
    index++;
  }
  return `${bytes.toFixed(2)} ${units[index]}`;
}

export function getTraffic(data: any) {
  let _up = "0.00";
  let _down = "0.00";
  if (!!data) {
    const { up, down } = data;
    if (up?.value) {
      _up = convertByte(up.value) || "0.00";
    }
    if (down.value) {
      _down = convertByte(down.value) || "0.00";
    }
  } else {
    _up = "0.00";
    _down = "0.00";
  }
  return {
    up: _up,
    down: _down,
  };
}

export function calculateValueDiff(curr: any, prev: any) {
  const prevUplinkValue: number = prev ? prev?.up?.value : 0;
  const prevDownlinkValue: number = prev ? prev?.down?.value : 0;

  const currentUplink: number = curr?.up?.value || 0;
  const currentDownlink: number = curr?.down?.value || 0;
  let uplinkDiff = 0;
  let downlinkDiff = 0;
  if (prevUplinkValue !== null && currentUplink !== undefined) {
    uplinkDiff = currentUplink - prevUplinkValue;
    console.log(`uplink的value差值: ${uplinkDiff}`);
  }
  if (prevDownlinkValue !== null && currentDownlink !== undefined) {
    downlinkDiff = currentDownlink - prevDownlinkValue;
    console.log(`downlink的value差值: ${downlinkDiff}`);
  }
  return {
    uplinkDiff,
    downlinkDiff,
  };
}
// 数字转为时:分:秒
export function formatTime(counter: number) {
  const hours = Math.floor(counter / 3600);
  const minutes = Math.floor((counter % 3600) / 60);
  const seconds = counter % 60;
  const timeFormat = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return timeFormat;
}
// 获取最近几天的日期
export function getRecentDates(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
}

export function getCookieArray(array: string[]) {
  let _str = "";
  const _res = array.map((cookieStr: string) => {
    const parts = cookieStr.split(";").map((part) => part.trim());
    const [nameValuePart] = parts;
    const [name, value] = nameValuePart.split("=");

    const cookie = {
      name: name.trim(),
      value: value.trim(),
    };
    _str += `${cookie.name}=${cookie.value};`;
    return nameValuePart;
  });
  localStorage.setItem("cookie", _res.join("; "));
}

/**
 * 生成指定长度的随机字符串
 * @param length
 * @returns
 */
export function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * 判断密码强度
 */
export function checkPasswordStrength(password: string) {
  const lengthValid = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const result = {
    passwordStrengthMessage: "",
    strengthClass: "",
    level: 0,
  };
  if (
    lengthValid &&
    hasUpperCase &&
    hasLowerCase &&
    (hasNumber || hasSpecialChar)
  ) {
    result.passwordStrengthMessage = "密码强度：强";
    result.strengthClass = "strong";
    result.level = 3;
  } else if (
    lengthValid &&
    (hasUpperCase || hasLowerCase) &&
    (hasNumber || hasSpecialChar)
  ) {
    result.passwordStrengthMessage = "密码强度：中";
    result.strengthClass = "medium";
    result.level = 2;
  } else if (lengthValid) {
    result.passwordStrengthMessage = "密码强度：弱";
    result.strengthClass = "weak";
    result.level = 1;
  } else {
    result.passwordStrengthMessage = "";
    result.strengthClass = "";
    result.level = 0;
  }
  return result;
}
