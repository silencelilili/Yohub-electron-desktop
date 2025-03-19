<template>
  <!-- 我的消息 -->
  <el-card shadow="never" class="m-4 h-100%">
    <div class="flex-between-center mb-4">
      <h3>我的消息</h3>
      <el-button link @click="handleClose"
        ><el-icon><Close /></el-icon
      ></el-button>
    </div>

    <div class="message-box">
      <div
        class="message-item mb-4 p-4 bg-color2 cursor-pointer"
        v-for="item in noticeContentList"
        :key="item.id"
        @click="handleOpenDetail(item)"
      >
        <div class="flex-center justify-between mb-4">
          <el-text tag="b">系统消息</el-text>
          <el-text class="mx-1" type="info">{{ item.date }}</el-text>
        </div>
        <el-text line-clamp="2"> <div v-html="item.content"></div> </el-text>
        <div></div>
      </div>
    </div>

    <!-- 订单详情 -->
    <el-dialog v-model="dialogVisible" title="系统消息" width="50%">
      <div v-html="detailData.content"></div>
    </el-dialog>
  </el-card>
</template>
<script lang="ts" setup>
import { getNoticeContent } from "@/api/user";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Close, ArrowLeft } from "@element-plus/icons-vue";

const router = useRouter();
onMounted(() => {
  _getNoticeContentApi();
});
// 关闭当前页面
const handleClose = () => {
  router.go(-1);
};
// 获取公告
const noticeContentList = ref();
const _getNoticeContentApi = () => {
  getNoticeContent().then((res) => {
    console.log("getNoticeContent res::::", res);
    noticeContentList.value = res?.data || [];
  });
};

const dialogVisible = ref(false)
const detailData = ref()
const handleOpenDetail = (item: any) => {
  dialogVisible.value = true
  detailData.value = item
}
</script>
<style lang="less" scoped>
.message-box{
  overflow: auto;
  height: calc(100vh - 136px);
}
</style>
