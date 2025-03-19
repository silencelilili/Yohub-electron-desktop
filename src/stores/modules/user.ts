import { logout } from "@/api/auth";
import type { IUserInfo } from "@/api/types";
import { getUserInfo } from "@/api/user";
import { defineStore } from "pinia";
import useConnectHook from "@/hooks/useConnect";
import { connectionStatusEnum } from "@/pages/home/config";
import dayjs from "dayjs";
import { clearSessionStorage } from "@/utils/yohub.store";

interface UserState {
  userInfo: IUserInfo | null;
}
const DefaultUserInfo: IUserInfo = {
  id: null,
  user_name: "",
  email: "",
  class_expire_days: 0,
};
export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    userInfo: DefaultUserInfo,
  }),
  getters: {
    /**
     * @description: 获取用户信息
     * @return {*}
     */
    // getUserInfo(state) {
    //   return state.userInfo;
    // },
  },
  actions: {
    /**
     * @description: 设置用户信息
     * @param {*} data
     * @return {*}
     */
    async getUserInfoApi() {
      const res = await getUserInfo();
      // 计算过期时间
      const _data = { ...res.data };
      if (_data.class !== 0) {
        _data.class_expire_days = dayjs(_data.class_expire).diff(
          dayjs(),
          "day"
        );
      }
      this.userInfo = _data;
    },
    /**
     * @description: 退出登录
     * @return {*}
     */
    logoutApi() {
      const { handleLogoutDisconnect } = useConnectHook();
      return new Promise((resolve, reject) => {
        // 判断当前连接状态，若是已经连接则先断开
        handleLogoutDisconnect().then(() => {
          logout()
            .then((res) => {
              this.userInfo = DefaultUserInfo;
              clearSessionStorage();
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
    },
  },
});
