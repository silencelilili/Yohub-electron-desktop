<template>
  <el-card shadow="never" class="m-4 h-100%">
    <!-- 快速上手列表 -->
    <div v-if="pageType === 'list'">
      <div class="flex-between-center mb-4">
        <h3>快速上手</h3>
        <el-button link @click="handleClose"
          ><el-icon><Close /></el-icon
        ></el-button>
      </div>

      <div class="guide-list py-4 px-12">
        <div class="my-6 flex">
          <el-input
            v-model="searchKey"
            placeholder="搜索帮助文档"
            @keypress="handleSearch"
          ></el-input>
          <el-button class="ml-4" type="primary" @click="handleSearch"
            >搜索</el-button
          >
        </div>

        <div
          v-for="item in guideList"
          :key="item.id"
          class="guide-item flex-between-center"
        >
          <div class="text-color">{{ item.title }}</div>
          <el-button plain type="primary" @click="handleOpenDetail(item)"
            >查看详情</el-button
          >
        </div>

        <el-empty v-if="guideList.length === 0" description="暂无内容" />
      </div>
    </div>

    <!-- 工单详情 -->
    <div v-if="pageType === 'detail'" class="guide-detail">
      <div class="mb-5">
        <el-button link @click="onJump('list')"
          ><el-icon><ArrowLeft /></el-icon
        ></el-button>
      </div>

      <div class="guide-detail-content">
        <h3 class="my-4 text-center">
          {{ detailData.title }}
        </h3>
        <div>
          <p v-for="(item, index) in detailData.content" :key="index">
            <el-text>{{ item.comment }}</el-text>
          </p>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { getTicketList, createTicket, getTicketDetail } from "@/api/ticket";
import { Close, ArrowLeft } from "@element-plus/icons-vue";
import { nextTick, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

type PageType = "list" | "detail";
const pageType = ref<PageType>("list");
const router = useRouter();
onMounted(() => {
  _getGuideList();
});
// 关闭当前页面
const handleClose = () => {
  router.go(-1);
};
const onJump = (type: PageType) => {
  pageType.value = type;
};

// TODO: 列表---------------
const guideList = ref([]);
const _getGuideList = async () => {
  try {
    const res = await getTicketList();
    guideList.value = res.data;
  } catch (error) {}
};
// 搜索
const searchKey = ref("");
const handleSearch = () => {
  if (!searchKey.value) {
    _getGuideList();
    return;
  }
  guideList.value = guideList.value.filter((item: any) => {
    return item.title.includes(searchKey.value);
  });
};

// 详情----------
const detailData = ref({
  title: "",
  content: "",
  comment: "",
});
const handleOpenDetail = async (item: any) => {
  try {
    const res = await getTicketDetail({ id: item.id });
    detailData.value = res.data;
    pageType.value = "detail";
  } catch (error) {
    console.log(error);
  }
};
</script>
<style lang="less" scoped>
.guide-list {
  .guide-item {
    border-bottom: 1px solid var(--el-border-color);
    padding: 16px;
    margin-bottom: 16px;
  }
}
.guide-detail {
  .guide-detail-content {
    margin-top: 16px;
    border-radius: 12px;
  }
}
</style>
