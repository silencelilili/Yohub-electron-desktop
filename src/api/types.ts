/**
 * 登录
 */
export interface ILoginParams {
  /** 账号/邮箱 */
  email: string;
  /** 密码 */
  password: string;
  remember_me: boolean;
  /** 用户两步验证码 */
  mfa_code?: string;
  /** cookie内容 */
  redir?: string;
}
export interface ILoginResponse {
  // 账号主键ID
  user_id: string;
}

/**
 * 注册
 */
export interface IRegisterParams {
  /** 账号/邮箱 */
  email: string;
  /** 邮箱验证码 */
  emailcode: string;
  /** 密码 */
  password: string;
  /** 确认密码 */
  confirm_password: string;
  /** 用户名 */
  name: string;
  /** 邀请码 */
  invite_code?: string;
  /** 方式 */
  imtype?: string;
  /** 联系方式账号*/
  wechat?: string;
}
enum EImType {
  /** 微信 */
  "WECHAT" = "1",
  /** QQ */
  "QQ" = "2",
  /** Facebook */
  "FACEBOOK" = "3",
  /** Yelegram */
  "TELEGRAM" = "4",
}

/**
 * 用户信息
 */
export interface IUserInfo {
  id: number | null;
  user_name: string;
  email: string;
  /** UUID */
  uuid?: string;
  /** 余额 */
  money?: string;
  /** 邀请人 */
  ref_by?: string;
  /** 流量限制 */
  transfer_enable?: number;
  /** 当期用量 */
  transfer_used?: number;
  /** 是否管理员 1 是  0 否 */
  is_admin?: number;
  /** 是否封禁 */
  is_banned?: number;
  /** 等级 */
  class?: number;
  /** 等级到期时间 */
  class_expire?: string;
  /** 剩余天数 */
  class_expire_days?: number;
  /** 最后签到时间 */
  last_check_in_time?: string;
  /** 最后登录时间 */
  last_login_time?: string;
  [x: string]: any;
}
/**
 * 上报信息
 */
export interface IReportParams {
  /** type：终端类型：windows，macos，ios，android   */
  type: string;
  /** version：终端版本：不同类型终端对应的版本号   */
  version: string;
  /** ipLibMd5：分流策略：IP库文件MD5值   */
  ipLibMd5?: string;
  /** geoipMd5：分流策略：geoip文件MD5值   */
  geoipMd5?: string;
  /** geositeMd5：分流策略：geosite文件MD5值   */
  geositeMd5?: string;
  /** totalUsedTraffic：今天使用的总流量   */
  totalUsedTraffic?: string;
  /** 7daysUsedTotalTraffic：近7天使用的总流量（包含上传和下载）   */
  sevenDaysUsedTotalTraffic?: string;
  /** 7daysUpAndDownTraffic：近7天上传/下载流量 */
  sevenDaysUpAndDownTraffic?: string;
  [x: string]: any;
}
