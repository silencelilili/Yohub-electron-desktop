import log from "electron-log/main";
import { app } from "electron";
// 初始化日志记录器（可选，用于渲染进程）
log.initialize();
// 设置日志文件路径，这里将日志文件存储在应用用户数据目录下
log.transports.file.resolvePathFn = () => {
  const userDataPath = app.getPath("userData");
  return `${userDataPath}/logs/main.log`;
};
log.transports.file.level = "info";
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

export default log;
