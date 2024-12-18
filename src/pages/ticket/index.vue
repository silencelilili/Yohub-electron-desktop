<template>
  <el-card shadow="never" class="m-4 h-100%">
    <!-- 工单列表 -->
    <div v-if="pageType === 'list'">
      <div class="flex-between-center mb-4">
        <h3>我的工单</h3>
        <el-button type="primary" @click="onJump('create')"
          >创建新工单</el-button
        >
      </div>

      <div class="ticket-list">
        <div
          v-for="item in ticketList"
          :key="item.id"
          class="ticket-item flex-between-center"
        >
          <div class="ticket-item_title">
            <div class="text-color">{{ item.title }}</div>
            <span class="secondary-color">{{ item.datetime }}</span>
          </div>
          <div class="ticket-item_button">
            <el-button v-if="item.status === 'closed'" class="mr-6" disabled
              >已结单</el-button
            >
            <el-button
              v-if="item.status === 'open_wait_admin'"
              type="primary"
              class="mr-6"
              @click="handleOpenDetail(item)"
              >进行中</el-button
            >
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建工单-表单 -->
    <div v-if="pageType === 'create'">
      <div class="mb-5 cursor-pointer">
        <el-icon @click="onJump('list')"><ArrowLeft /></el-icon> 创建工单
      </div>
      <el-form
        ref="formRef"
        :model="ticketForm"
        status-icon
        label-width="auto"
        class="m-10"
      >
        <el-form-item label="主题" prop="title">
          <el-input
            v-model="ticketForm.title"
            autocomplete="off"
            placeholder="请输入工单主题"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="ticketForm.type" placeholder="请选择">
            <el-option label="使用" value="howto"></el-option>
            <el-option label="财务" value="billing"></el-option>
            <el-option label="账户" value="account"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="comment" label-position="top">
          <el-input
            v-model.number="ticketForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入您遇到的问题，建议或需求..."
          />
        </el-form-item>
        <el-form-item>
          <div class="text-center w-full">
            <el-button type="primary" @click="submitForm(formRef)">
              创建工单
            </el-button>

            <el-button
              @click="
                resetForm(formRef);
                onJump('list');
              "
              >取消</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工单详情 -->
    <div v-if="pageType === 'detail'">
      <div class="mb-5">
        <span class=" cursor-pointer" @click="onJump('list')"><el-icon><ArrowLeft /></el-icon> 工单详情</span>
      </div>
       <div>
        <h3>{{ ticketDetailData.title }}</h3>
        <div>{{ ticketDetailData.comment }}</div>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { getTicketList, createTicket, getTicketDetail } from "@/api/ticket";
import { ArrowRight, ArrowLeft } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";

type PageType = "list" | "detail" | "create";
const pageType = ref<PageType>("list");
onMounted(() => {
  _getTicketList();
});

const onJump = (type: PageType) => {
  pageType.value = type;
};

// 工单列表---------------
const ticketList = ref([]);
const _getTicketList = async () => {
  try {
    const res = await getTicketList();
    ticketList.value = res.data;
  } catch (error) {}
};

// 创建工单表单----------
const formRef = ref();
const ticketForm = reactive({
 title: '',
  type: '',
  comment: '',
});
const submitForm = (formEl: any) => {
  if (!formEl) return;
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      // onSubmit();
      await createTicket(ticketForm);
      ElMessage.success('创建工单成功');
      onJump('list');
      _getTicketList();
    } else {
      return false;
    }
  });
};
const resetForm = (formEl: any) => {
  if (!formEl) return;
  formEl.resetFields();
};

// 工单详情----------
const ticketDetailData = ref({
  title: '',
  content: '',
  comment: '',
  datetime: '',
});
const handleOpenDetail = async (item: any) => {
  try {
    const res = await getTicketDetail({ id: item.id });
    ticketDetailData.value = res.data;
    const _content = res?.data?.content.map((i) => i.comment).join('<br/>') || '';
    ticketDetailData.value.comment = _content;
    pageType.value = 'detail';
  } catch (error) {
    console.log(error);
  }
};
</script>
<style lang="less" scoped>
.ticket-item {
  border: 1px solid var(--el-border-color);
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 12px;
}
</style>
