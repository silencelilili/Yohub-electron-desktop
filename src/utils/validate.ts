/**
 * 验证密码
 * @param rule
 * @param value
 * @param callback
 * @description 密码必须至少8个字符，包含大小写字母和符号
 */
export const validatePassword = (
  rule: any,
  value: string,
  callback: (arg0?: Error | undefined) => void
) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!passwordRegex.test(value)) {
    callback(
      new Error("密码必须为8-16位，包含大小写字母、数字或特殊字符的组合")
    );
  } else {
    callback();
  }
};

/**
 * 验证用户名
 * @param rule
 * @param value
 * @param callback
 * @description 大小写字母、中文字符、数字、特殊符号（如下划线 _、连字符-、点 . 等），最多30个字符。
 */
export const validateUsername = (
  rule: any,
  value: string,
  callback: (arg0?: Error | undefined) => void
) => {
  const usernameRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5\.\-]{1,30}$/;
  if (value === "") {
    callback(new Error("昵称不能为空"));
  } else if (!usernameRegex.test(value)) {
    callback(new Error("昵称格式不正确"));
  } else {
    callback();
  }
};
/**
 * 验证邮箱
 * @param rule
 * @param value
 * @param callback
 */
export const validateEmail = (
  rule: any,
  value: string,
  callback: (arg0?: Error | undefined) => void
) => {
  const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (value === "") {
    callback(new Error("邮箱不能为空"));
  } else if (!emailRegex.test(value)) {
    callback(new Error("邮箱格式不正确"));
  } else {
    callback();
  }
};
/**
 * 验证手机号
 * @param rule
 * @param value
 * @param callback
 */
export const validatePhone = (
  rule: any,
  value: string,
  callback: (arg0?: Error | undefined) => void
) => {
  const phoneRegex = /^1[3456789]\d{9}$/;
  if (value === "") {
    callback(new Error("手机号不能为空"));
  } else if (!phoneRegex.test(value)) {
    callback(new Error("手机号格式不正确"));
  } else {
    callback();
  }
};

/**
 * 验证身份证号
 * @param rule
 * @param value
 * @param callback
 */
export const validateIdCard = (
  rule: any,
  value: string,
  callback: (arg0?: Error | undefined) => void
) => {
  const idCardRegex =
    /^[1 - 9]\d{5}(18|19|20)\d{2}(0[1 - 9]|1[0 - 2])(0[1 - 9]|[12]\d|3[01])\d{3}[0 - 9Xx]$/;
  if (value === "") {
    callback(new Error("身份证号不能为空"));
  } else if (!idCardRegex.test(value)) {
    callback(new Error("身份证号格式不正确"));
  } else {
    callback();
  }
};
