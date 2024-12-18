import { defineStore } from "pinia";
interface AppState {
  activeMenu: any;
}
export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    activeMenu: {},
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
  },
});
