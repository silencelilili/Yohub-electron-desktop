export function convertByte(byteValue: number) {
  const kbValue = byteValue / 1024;
  if (kbValue >= 1024) {
    const mbValue = kbValue / 1024;
    return `${mbValue.toFixed(2)}MB`;
  }
  return `${kbValue.toFixed(2)}KB`;
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
