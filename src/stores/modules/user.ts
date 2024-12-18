import { logout } from "@/api/auth";
import type { IUserInfo } from "@/api/types";
import { getUserInfo } from "@/api/user";
import { defineStore } from "pinia";
import useConnect from "@/hooks/useConnect";
import { connectionStatusEnum } from "@/pages/home/config";

interface UserState {
  userInfo: IUserInfo | null;
}
const DefaultUserInfo: IUserInfo = {
  id: null,
  user_name: "",
  email: "",
};
const { connectionStatus, handleDisconnect } = useConnect();
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
      this.userInfo = res.data;
    },
    /**
     * @description: 退出登录
     * @return {*}
     */
    async logoutApi() {
      return new Promise(async (resolve, reject) => {
        // 判断当前连接状态，若是已经连接则先断开
        const _currStatus = connectionStatus.value;
        if (_currStatus.status === connectionStatusEnum.CONNECTED) {
          console.log("退出登录时，先断开连接");
          await handleDisconnect();
        }
        setTimeout(() => {
          logout()
            .then((res) => {
              this.userInfo = DefaultUserInfo;

              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        }, 1600);
      });
    },
  },
});
