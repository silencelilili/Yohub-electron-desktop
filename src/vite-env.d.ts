/*
 * @Date: 2024-10-15 16:23:40
 * @LastEditors: lixuedan
 * @FilePath: /src/vite-env.d.ts
 * @Description: 头部注释
 */
/// <reference types="vite/client" />
declare module "dragula";
declare global {
  interface Window {
    $Yohub: any;
    $log: any;
  }
}
