import Info from "./components/info.vue";
import AccountSafe from "./components/accountSafe.vue";
import StartupAuto from "./components/startupAuto.vue";
import NetworkRepair from "./components/networkRepair.vue";
import RealName from "./components/realName.vue";
import LogoutAccount from "./components/logoutAccount.vue";

// const _img = (name: string) =>
//   new URL("@/assets/images/users/" + name, import.meta.url).href;
export const navList = [
  {
    label: "menu.myInfo", // 我的信息
    component: Info,
    icon: new URL("@/assets/images/users/icon_myInfo@2x.png", import.meta.url)
      .href,
    path: "",
  },
  {
    label: "menu.accountSafe", // 账号安全
    component: AccountSafe,
    icon: new URL(
      "@/assets/images/users/icon_accountSafe@2x.png",
      import.meta.url
    ).href,
    path: "",
  },
  // {
  //   label: "menu.networkRepair", // 网络修复
  //   component: NetworkRepair,
  //   icon: new URL(
  //     "@/assets/images/users/icon_networkRepair@2x.png",
  //     import.meta.url
  //   ).href,
  //   path: "",
  // },
  {
    label: "menu.startupAuto", // 开机自启
    component: StartupAuto,
    icon: new URL(
      "@/assets/images/users/icon_startupAuto@2x.png",
      import.meta.url
    ).href, //"icon_startupAuto@2x.png",
  },
  // {
  //   label: "menu.realName", // 实名认证
  //   component: RealName,
  //   icon: new URL("@/assets/images/users/icon_realName@2x.png", import.meta.url)
  //     .href, //"icon_realName@2x.png",
  // },
  {
    label: "menu.logoutAccount", // 注销账号
    component: LogoutAccount,
    icon: new URL(
      "@/assets/images/users/icon_logoutAccount@2x.png",
      import.meta.url
    ).href, //"icon_logoutAccount@2x.png",
  },
];
