<template>
  <div class="destroy-wrap">
    <div class="border-full p-4 border-rounded-lg color-#666 file-content">
      <h2 class="text-center">Yohub账号注销协议</h2>
      <div>注注销是不可逆操作，请认真阅读以下重要提醒：</div>
      <div class="my-2">
        1、注销前请确认已解约所有支付平台的连续包月服务，可查看对应解约教程完成解约。为了保障您的权益，未解约无法完成注销；
      </div>
      <div>
        2、帐号申请注销到注销成功有15天的等待期，在等待期内可随时终止注销。等待期结束后帐号将完成注销；
      </div>
      <div class="my-2">
        3、帐号一旦被注销，所有帐号数据将清空。被注销帐号无法登录、无法找回。其所有权益，包含但不限于剩余会员天数、金币余额等，也将清空无法找回；
      </div>
      <div>
        4、注销后，该帐号关联的手机号、邮箱地址及第三方登陆信息将释放，登陆信息在释放后可以用于其他帐号注册或绑定；
      </div>
      <div class="my-2">
        5、已注销账号重新注册时，无法获得该账号之前已享受过的新用户福利，包括但不限于新用户超级VIP时长赠送，邀请活动金币奖励等；
      </div>

      <div><el-checkbox>已阅读并同意：Youhub帐号注销协议</el-checkbox></div>
    </div>

    <el-button type="primary" size="large" class="w-100% mt-6"
      >注销账号</el-button
    >
  </div>
</template>
<script lang="ts" setup></script>
<style lang="less" scoped>
.destroy-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 24px 0;
  .file-content {
    overflow: auto;
    height: calc(100vh - 195px);
  }
}
</style>
