<template>
  <el-card shadow="never" class="m-4 h-100% " style="overflow:auto">
    <!-- 工单列表 -->
    <div v-if="pageType === 'list'">
      <div class="flex-between-center mb-4">
        <h3>我的工单</h3>
        <el-button type="primary" @click="onJump('create')"
          ><el-icon><Plus /></el-icon> 创建新工单</el-button
        >
      </div>

      <div class="ticket-list">
        <div
          v-for="item in ticketList"
          :key="item.id"
          class="ticket-item flex-between-center"
          @click="handleOpenDetail(item)"
        >
          <div class="ticket-item_title">
            <div class="text-color">{{ item.title || "-" }}</div>
            <span class="secondary-color">{{ item.datetime }}</span>
          </div>
          <div class="ticket-item_button">
            <el-tag class="mr-6" effect="dark" round>{{ item.status_name }}</el-tag>

            <!-- <el-button v-if="item.status === 'closed'" class="mr-6" disabled
              >已结单</el-button
            >
            <el-button
              v-if="item.status === 'open_wait_admin'"
              type="primary"
              class="mr-6"
              @click="handleOpenDetail(item)"
              >进行中</el-button
            > -->
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>

        <el-empty v-if="ticketList.length === 0" description="暂无工单" />
      </div>
    </div>

    <!-- 创建工单-表单 -->
    <div v-if="pageType === 'create'">
      <div class="mb-5 cursor-pointer">
        <el-button link @click="onJump('list')"
          ><el-icon><ArrowLeft /></el-icon> 创建工单</el-button
        >
      </div>
      <el-form
        ref="formRef"
        :model="ticketForm"
        status-icon
        label-width="auto"
        class="m-10"
      >
        <el-form-item
          label="主题"
          prop="title"
          :rules="[
            {
              required: true,
              message: '请输入工单主题',
              trigger: 'blur',
            },
            {
              min: 5,
              max: 50,
              message: '请输入5-50个字符',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="ticketForm.title"
            autocomplete="off"
            placeholder="请输入工单主题"
          />
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
          :rules="[
            {
              required: true,
              message: '请选择工单类型',
              trigger: 'blur',
            },
          ]"
        >
          <el-select v-model="ticketForm.type" placeholder="请选择">
            <el-option label="使用" value="howto"></el-option>
            <el-option label="财务" value="billing"></el-option>
            <el-option label="账户" value="account"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="内容"
          prop="comment"
          label-position="top"
          :rules="[
            {
              min: 5,
              max: 1000,
              message: '请输入5-1000个字符',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="ticketForm.comment"
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
    <div v-if="pageType === 'detail'" class="ticket-detail">
      <div class="mb-5">
        <el-button link @click="onJump('list')"
          ><el-icon><ArrowLeft /></el-icon> 工单详情</el-button
        >
      </div>
      <div class="p-6 ticket-detail-content bg-color2">
        <h3 class="my-4 flex justify-between">
          <span>{{ ticketDetailData.title }}</span>
          <el-tag class="mr-6" effect="dark" round>{{
            ticketDetailData.status_name
          }}</el-tag>
        </h3>
        <div>
          <!-- v-for="(item, index) in ticketDetailData.content" :key="index" -->
          <p>
            <el-text>{{ ticketDetailData.comment }}</el-text>
          </p>
        </div>
        <div class="text-right">
          <el-text type="info" class="my-2">
            {{ ticketDetailData.datetime }}
          </el-text>
          <br />
          <el-text type="primary"> {{ ticketDetailData.type_name }}问题 </el-text>
        </div>
      </div>

      <!-- 回复 -->
      <div class="p-6 ticket-detail-content bg-color2">
        <!-- TODO:回复功能 - 待完善 -->
        <div v-if="ticketDetailData.status !== 'closed'" class="text-right">
          <el-button plain type="primary" @click="handleReply"
            ><el-icon><Plus /></el-icon> 回复</el-button
          >
        </div>
        <div class="mt-4">
          <template
            v-for="(item, index) in ticketDetailData.content"
            :key="index"
          >
            <div
              v-if="index > 0"
              class="flex justify-between items-center border-bottom mb-5 pb-3"
            >
              <p class="flex-1">
                <el-text>{{ item?.comment || "-" }}</el-text>
              </p>
              <el-text type="info" class="my-2">
                {{ item.commenter_name }} 回复于
                {{ item.datetime }}
              </el-text>
            </div>
          </template>

          <div v-if="isReply" class="reply ">
             <el-input
              v-model="replyComment"
              type="textarea"
              :rows="4"
              placeholder="请输入"
            />
            <div class="text-right w-full mt-4">
              <el-button type="primary" @click="replySure">
                 确定
              </el-button>

              <el-button
                @click="cancelReply"
                >取消</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { getTicketList, createTicket, getTicketDetail, replyTicket } from "@/api/ticket";
import { ArrowRight, ArrowLeft, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";

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
  title: "",
  type: "",
  comment: "",
});
const submitForm = (formEl: any) => {
  if (!formEl) return;
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      // onSubmit();
      await createTicket(ticketForm);
      ElMessage.success("创建工单成功");
      onJump("list");
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
  title: "",
  content: [],
  comment: "",
  datetime: "",
  status: '',
  status_name: '',
});
const handleOpenDetail = async (item: any) => {
  try {
    const res = await getTicketDetail({ id: item.id });
    const _data = res.data || {};
    ticketDetailData.value = _data;
    ticketDetailData.value.comment = _data?.content[0]?.comment || "-";
    pageType.value = "detail";
  } catch (error) {
    console.log(error);
  }
};

// 工单回复
const isReply = ref(false);
const replyComment = ref("");
const handleReply = () => {
  isReply.value = !isReply.value;
};

const replySure = async () => {
  const _params = {
    id: ticketDetailData.value.id,
    comment: replyComment.value,
  };
  console.log(_params);
  await replyTicket(_params);
  cancelReply()
  handleOpenDetail({id: ticketDetailData.value.id})
};
const cancelReply = () => {
  isReply.value = false;
  replyComment.value = ''
};
</script>
<style lang="less" scoped>
.ticket-list {
  .ticket-item {
    border: 1px solid var(--el-border-color);
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 12px;
    cursor: pointer;
  }
}
.ticket-detail {
  .ticket-detail-content {
    margin-top: 16px;
    border-radius: 12px;
  }
}
</style>
