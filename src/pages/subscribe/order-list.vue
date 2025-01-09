<template>
  <div class="py-4">
    <el-table
      :data="historyOrderData"
      style="width: 100%"
      size="small"
      :header-cell-style="{ background: '#E8EDFA', color: '#333333' }"
      empty-text="无历史订单"
      >
      <el-table-column prop="id" label="订单编号" width="90" />
      <el-table-column prop="product_type" label="购买服务卡" />
      <el-table-column prop="price" label="订单金额" />
      <el-table-column prop="status_name" label="订单状态" />
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column label="操作" width="100">
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
        <el-descriptions-item label="商品类型：">{{orderDetail.product_type_text}}</el-descriptions-item>
        <el-descriptions-item label="商品名称：">{{orderDetail.product_name}}</el-descriptions-item>
        <el-descriptions-item label="订单编号：">{{orderDetail.id}}</el-descriptions-item>
        <el-descriptions-item label="订单金额：">{{orderDetail.price}}</el-descriptions-item>
        <el-descriptions-item label="订单优惠码：">{{orderDetail.coupon || '-'}}</el-descriptions-item>
        <el-descriptions-item label="订单状态：">{{orderDetail.status_name }}</el-descriptions-item>
        <el-descriptions-item label="创建时间：">{{orderDetail.create_time }}</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="商品内容" :column="2" class="detail-box">
        <el-descriptions-item label="商品时长 (天)：">{{orderDetail.product_content.time}}</el-descriptions-item>
        <el-descriptions-item label="等级时长 (天)：">{{orderDetail.product_content.class_time}}</el-descriptions-item>
        <el-descriptions-item label="等级：">{{orderDetail.product_content.class }}</el-descriptions-item>
        <el-descriptions-item label="可用流量 (GB)：">
          {{orderDetail.product_content.bandwidth}}
        </el-descriptions-item>
        <el-descriptions-item label="速率限制 (Mbps)：">
         {{orderDetail.product_content.speed_limit }}
        </el-descriptions-item>
        <el-descriptions-item label="同时连接IP限制：">
          {{orderDetail.product_content.ip_limit===0?'不限制':orderDetail.product_content.ip_limit }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, defineProps, ref, nextTick, computed, reactive } from "vue";
  import { getOrderList, getOrderDetail } from "@/api/order";

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
  // 支付
  const handleOrderPay = (row: any) => {
    console.log('row::::', row);
    // router.push({
    //   name: 'orderDetail',
    //   params: {
    //     id: row.id
    //   }
    // })
  };
</script>
<style lang="less" scoped>
.detail-box{
  background: #f3f3f3f3;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 12px;
  .el-descriptions__body{
    background-color: transparent;
  }
}
</style>