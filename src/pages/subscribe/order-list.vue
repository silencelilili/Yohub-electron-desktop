<template>
  <div class="py-4">
    <el-table
      :data="historyOrderData"
      style="width: 180%"
      size="small"
      :header-cell-style="{ background: '#E8EDFA', color: '#333333' }"
      empty-text="无历史订单"
      >
      <el-table-column prop="id" label="订单编号" width="90" />
      <el-table-column prop="product_name" label="购买服务卡" />
      <el-table-column prop="price" label="订单金额" />
      <el-table-column prop="status_name" label="订单状态" />
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleOrderDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-if="scope.row.status === 'pending_payment'"
            link
            type="danger"
            size="small"
            @click="handleOrderPay(scope.row)"
          >
            支付
          </el-button>
           <el-button
            v-if="scope.row.status === 'pending_payment'"
            link
            type="danger"
            size="small"
            @click="handleOrderCancel(scope.row)"
          >
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="searchParams.currentPage"
      :page-size="searchParams.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="searchParams.total"
      @change="handlePageChange"
    />

    <!-- 订单详情 -->
    <el-dialog v-model="dialogVisible" title="订单详情" width="50%">
      <el-descriptions title="基本信息" :column="2" class="detail-box">
        <el-descriptions-item label="商品名称：">{{orderDetail.product_name}}</el-descriptions-item>
        <el-descriptions-item label="订单编号：">{{orderDetail.id}}</el-descriptions-item>
        <el-descriptions-item label="订单金额：">{{orderDetail.price}}</el-descriptions-item>
        <el-descriptions-item label="订单优惠码：">{{orderDetail.coupon || '-'}}</el-descriptions-item>
        <el-descriptions-item label="订单状态：">{{orderDetail.status_name }}</el-descriptions-item>
        <el-descriptions-item label="创建时间：">{{orderDetail.create_time }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 支付 -->
     <el-dialog
      v-model="payDialogVisible"
      title="支付"
      width="360"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :align-center="true"
      center
      @close="onPaymentSuccess"
    >
      <PaymentVue
        ref="paymentRef"
        :order-info="activeSubscribe"
        :payType="activePayment"
        @success="onPaymentSuccess"
      />
    </el-dialog>
     <!-- stripe 支付结果查询弹窗-->
    <el-dialog
      v-model="stripeStatusDialogVisible"
      title="Stripe支付"
      width="360"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :align-center="true"
      center
    >
      <div class="text-center p-3">请确认是否完成支付？</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleStripeStatusCancel">支付未完成</el-button>
          <el-button type="primary" :loading="stripLoading" @click="handleStripeStatusOk">
            支付完成
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, defineProps, ref, nextTick, computed, reactive } from "vue";
  import { getOrderList, getOrderDetail, cancelOrder } from "@/api/order";
  import { ElMessage, ElMessageBox } from "element-plus";
  import PaymentVue from "@/components/Payment.vue";
import { generateRandomString } from "@/utils";
import { useStripePayment } from "@/hooks/usePayment";

  onMounted(async () => {
    getOrderListData();
  });

  /**
   * 我的历史订单
   */
  const historyOrderData = ref();
  const searchParams = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 1000,
  });
  const getOrderListData = () => {
    getOrderList()
      .then((res) => {
        historyOrderData.value = res.data as any;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 分页
  const handlePageChange = (currentPage: number, pageSize: number) => {
    searchParams.currentPage = currentPage;
    searchParams.pageSize = pageSize;
    console.log('searchParams::::', searchParams);
  };
// 订单详情
  const dialogVisible = ref(false)
  const orderDetail = ref<any>({
    product_content: {}
  })
  const handleOrderDetail = async (row: any) => {
    const res = await getOrderDetail(row.id);
    console.log('row::::', res);
    orderDetail.value = res.data
    dialogVisible.value = true
  };
  //  取消订单
  const handleOrderCancel = async (row: any) => {
    try {
      await cancelOrder({id: row.id}) 
      ElMessage.success('取消成功')
      getOrderListData()
    } catch (error) {
      
    }
  };

// 支付 ---------------
const activePayment = ref('')
const activeSubscribe = ref()
const payDialogVisible = ref(false)
const paymentRef = ref()
const stripePayment = useStripePayment();
const stripeStatusDialogVisible = ref(false)

const handleOrderPay = (row: any) => {
  activeSubscribe.value = {
    id: row.product_id,
    name: row.product_name,
    price: row.price,
  }
  activePayment.value = row.pay_type || 'f2f'
  handlePay(row)
};

const handlePay = (data: any) => {
  const _data = {
    invoice_id: data.id,
    amount: data.price,
  };
  if (activePayment.value === "f2f") {
    payDialogVisible.value = true
    nextTick(() => {
      paymentRef.value.createQrcode(_data).then((res) => {
        console.log("createAlipayQrcodeApi success ------", res);
      });
    });
  } else if (activePayment.value === "stripe") {
    const _params = {
      ..._data,
      price: data.price,
      pid: generateRandomString(6),
      success_url: 'https://www.yohub.net/'
    };
    stripePayment
      .makePayment(_params)
      .then((res) => {
        console.log("useStripePayment.makePayment success ------", res);
        stripeStatusDialogVisible.value = true;
      })
      .catch((err) => {
        console.log("useStripePayment.makePayment error ------", err);
        stripeStatusDialogVisible.value = true;
      });
  } else {
    ElMessage.warning("暂不支持该支付方式");
  }
};

const onPaymentSuccess = () => {
  paymentRef.value.stopPoll();
}

const stripLoading = ref(false)
// 关闭stripe支付状态弹窗
const handleStripeStatusOk = () => {
  stripLoading.value = true
  stripePayment
    .queryPaymentResult()
    .then((res) => {
      console.log("useStripePayment.queryPaymentResult success ------", res);
      stripLoading.value = false
      stripeStatusDialogVisible.value = false;
      getOrderListData()
    })
    .catch((err) => {
      console.log("useStripePayment.queryPaymentResult error ------", err);
      stripLoading.value = false
    });
};
const handleStripeStatusCancel = () => {
  stripeStatusDialogVisible.value = false;
  stripePayment.stopPolling()
};
</script>
<style lang="less" scoped>
.detail-box{
  background: #f3f3f3f3;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 12px;
  :deep(.el-descriptions__body){
    background-color: transparent !important;
  }
}
</style>