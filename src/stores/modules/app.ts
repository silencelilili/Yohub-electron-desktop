import { defineStore } from "pinia";
interface AppState {
  activeMenu: any;
  onlineStatus: any;
  onlineTimes: number;
}
export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    activeMenu: {},
    onlineStatus: {},
    onlineTimes: 0,
  }),
  getters: {
    /**
     * @description: 获取当前激活菜单
     * @return {*}
     */
    getActiveMenu(state) {
      return state.activeMenu;
    },
  },
  actions: {
    /**
     * @description: 设置当前激活菜单
     * @param menu
     */
    async setActiveMenu(menu: any) {
      this.activeMenu = menu;
    },
    setOnlineStatus(status: any) {
      this.onlineStatus = status;
    },
    setOnlineTimes(times: any) {
      this.onlineTimes = times;
    },
  },
});
