<template>
  <div class="flex">
    <div class="m-4 flex-1">
      <div :class="['mb-4 p-6', userInfo?.class === 0 ? 'free-bg' : 'vip-bg']">
        <div class="flex items-center">
          <img
            v-if="userInfo?.class === 0"
            src="@/assets/images/users/free-logo@2x.png"
            alt=""
            class="w-60px"
          />
          <img
            v-else
            src="@/assets/images/users/vip-logo@2x.png"
            alt=""
            class="w-60px"
          />
          <div class="ml-4 flex-1">
            <div class="font-size-5 mb-3">{{ userInfo?.user_name }}</div>
            
            <!-- 普通会员 -->
            <div v-if="userInfo?.class === 0">
              <div class="progress-container">
                <div
                  class="progress-bar used-progress"
                  :style="{ width: transferProgress.total_width + '%' }"
                ></div>
                <div
                  class="progress-bar today-progress"
                  :style="{ width: transferProgress.today_width + '%' }"
                ></div>
              </div>
              <div class="flex-between-center mt-2">
                <span class="progress-text used-text"
                  >过去用量 {{ transferData.total }}</span
                >
                <span class="progress-text today-text"
                  >今日用量 {{ transferData.today }}</span
                >
                <span class="progress-text unused-text"
                  >剩余流量 {{ transferData.enable }}</span
                >
              </div>
            </div>
            <!-- vip -->
            <p v-else class="color-#8F6E36">
              您的VIP会员将在 <strong>{{userInfo?.class_expire_days}}</strong> 天后到期（{{userInfo?.class_expire}}）
            </p>
          </div>
        </div>
      </div>
      <el-card shadow="never" :class="['pos-relative h-100% subscribe-wrap']">
        <!-- =========== 订阅列表 subscribePageType: 'list' =========== -->
        <template v-if="subscribePageType === 'list'">
          <h3 v-if="!props.type" class="mb-6 mt-0">可选订阅</h3>
          <div class="subscribe-list grid md:grid-cols-3 xl:grid-cols-4 gap-10">
            <div
              v-for="(item, index) in productList"
              :key="index"
              :class="[
                'subscribe-list-item',
                activeSubscribeIndex === index
                  ? 'subscribe-list-item-active'
                  : '',
              ]"
              @click="handleChooseSubscribe(item, index)"
            >
              <div class="item-tag">{{ item?.predesc }}</div>
              <div class="flex-1 line-height-9 mt-8">
                <div class="text-color">
                  {{ item?.name }}
                  {{ item?.expiretime && item?.expiretime + "天" }}
                </div>
                <div class="item-price">
                  <span class="font-size-3">¥</span
                  ><span class="font-size-7">{{ item?.price || "0" }}</span>
                </div>
                <div class="color-#C3B097">
                  <s
                    ><span class="font-size-3">¥</span
                    ><span class="font-size-4">{{
                      item?.originprice || "0"
                    }}</span></s
                  >
                </div>
              </div>
              <div class="unit-price">
                {{
                  (item?.averagevalue || "0") +
                  (item.type === "bandwidth" ? "/GB" : "/月")
                }}
              </div>
            </div>
          </div>

          <div class="secondary-color my-4">
            <div>包含VIP会员所有权益（时间卡不限流量，流量卡不限时间）</div>
            <div>
              最长支持30天退款（特价无退款），详见<a
                class="color-#3366FF cursor-pointer" @click="handleOpenProtocol('refund')"
                >退款规则</a
              >
            </div>
          </div>
          <!-- 优惠码 -->
          <div class="my-8">
            <el-space alignment="flex-start">
              <div class="lh-32px">优惠码</div>
              <div>
                <el-input
                  v-model="couponCode"
                  style="width: 240px"
                  placeholder="请输入优惠码"
                />
                <p class="color-#EF3434 small-font">{{ couponResult.msg }}</p>
              </div>
              <el-button type="primary" plain @click="handleCheckCouponCode"
                >应用</el-button
              >
            </el-space>
          </div>

          <!-- 支付方式 -->
          <div class="mb-12">
            <div class="mb-4">支付方式</div>
            <div class="payment-list grid md:grid-cols-5 gap-4">
              <div
                v-for="(item, index) in paymentOptions"
                :key="index"
                :class="[
                  'payment-list-item',
                  activePayment === item.value
                    ? 'payment-list-item-active'
                    : '',
                ]"
                @click="handleChangePayment(item)"
              >
                <!-- <el-icon v-if="activePayment === item.value" class="active-icon"
              ><Select
            /></el-icon> -->
                <!-- <div class="payment-list-item-icon"> -->
                <img
                  v-if="item.value === 'wechat'"
                  src="@/assets/images/pay-wechat.png"
                  :alt="item.label"
                />
                <img
                  v-else-if="item.value === 'alipay'"
                  src="@/assets/images/pay-ali.png"
                  :alt="item.label"
                />
                <img
                  v-else-if="item.value === 'paypal'"
                  src="@/assets/images/pay-pal.png"
                  :alt="item.label"
                />
                <img
                  v-else-if="item.value === 'stripe'"
                  src="@/assets/images/pay-stripe.png"
                  :alt="item.label"
                />
                <img
                  v-else-if="item.value === 'balance'"
                  src="@/assets/images/pay-balance.png"
                  :alt="item.label"
                />
                <!-- </div> -->
                <div class="payment-list-item-title">{{ item.label }}</div>
              </div>
            </div>
          </div>

          <!-- 支付金额详情 -->
          <div class="payment-footer bg-color border-top">
            <div v-if="showDetail" class="payment-footer_detail box-shadow">
              <div class="fw-500 flex-between-center">
                <span
                  >{{ activeSubscribe.name }}
                  {{ activeSubscribe.predesc }}</span
                >
                <span class="color-#FF0000"
                  >CNY ￥ {{ activeSubscribe.originprice || "0" }}</span
                >
              </div>
              <div
                v-if="couponCode && hasCoupon"
                class="fw-500 flex-between-center"
              >
                <span>优惠券：</span>
                <span class="color-#FF0000"
                  > - CNY ￥{{ couponResult.discount }}</span
                >
              </div>
            </div>
            <div class="flex-between-center p-4">
              <div class="fw-500">
                实付
                <span>CNY ￥ {{ activeSubscribe.price }}</span>
                <div class="secondary-color text-13px">
                  支付即代表接受“<a
                class=" cursor-pointer" @click="handleOpenProtocol('privacy')"
                >隐私政策</a
              >和<a
                class=" cursor-pointer" @click="handleOpenProtocol('services')"
                >用户协议</a
              >”
                </div>
              </div>
              <div class="cursor-pointer" @click="showDetail = !showDetail">
                明细
                <el-icon><ArrowUp /></el-icon>
              </div>
              <el-button
                type="primary"
                class="w-112px h-36px"
                @click="handleCreateOrder"
                >立即支付</el-button
              >
            </div>
          </div>
        </template>

        <!-- =========== 支付 subscribePageType: 'pay' =========== -->
        <template v-if="subscribePageType === 'pay'">
          <div>
            <el-icon class="cursor-pointer" @click="closePayment"
              ><ArrowLeft
            /></el-icon>
          </div>
          <PaymentVue
            ref="paymentRef"
            :order-info="activeSubscribe"
            :payType="activePayment"
          />
        </template>
      </el-card>
    </div>
    <div v-if="!props.type" class="w-180px">
      <BannerVue />
    </div>

    <protocolsPage ref="protocolsRef" />


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
          <el-button type="primary" @click="handleStripeStatusOk">
            支付完成
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, defineProps, ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { subscribeList, paymentOptions, type IProductItem } from "./config";
import { ArrowUp, ArrowLeft } from "@element-plus/icons-vue";
import BannerVue from "./banner.vue";
import PaymentVue from "@/components/Payment.vue";
import protocolsPage from '../protocols/index.vue'
import { getProductList, checkCoupon, createOrder } from "@/api/order";
import { useUserStore } from "@/stores";
import { formatByteSize, generateRandomString } from "@/utils";
import { useStripePayment } from "@/hooks/usePayment";

const router = useRouter();
const props = defineProps({
  type: {
    type: String,
    default: "",
  },
});

const userInfo = computed(() => useUserStore().userInfo);
const subscribePageType = ref("list"); // 页面类型  list 列表，pay 支付

const transferProgress = computed(() => _getProgressWidth(userInfo.value));
const transferData = ref({
  enable: "0B", // 账户当前可用流量
  today: "0B", // 账户今日所用流量
  total: "0B",
});

onMounted(async () => {
  if(userInfo.value?.class === 0){
    transferData.value = {
      enable: formatByteSize(userInfo.value?.transfer_enable || (0 as number)),
      today: formatByteSize(userInfo.value?.transfer_today || (0 as number)),
      total: formatByteSize(userInfo.value?.transfer_total || (0 as number)),
    };
  }
  console.log("userInfo.value", userInfo.value);
  _getProductList();
});

const _getProgressWidth = (
  data = { transfer_enable: 0, transfer_today: 0, transfer_total: 0 }
) => {
  const today_width = (data.transfer_today / data.transfer_enable) * 100;
  const total_width = (data.transfer_total / data.transfer_enable) * 100;
  return {
    today_width,
    total_width,
  };
};

/**
 * 商品列表
 */
const productList = ref<IProductItem[]>([]);
const _getProductList = async () => {
  const { data } = await getProductList();
  productList.value = [...data.tabp, ...data.bandwidth, ...data.time] as any;
  activeSubscribe.value = productList.value[0];
};

/**
 * 选择订阅方式
 */
const activeSubscribeIndex = ref(0);
const activeSubscribe = ref<IProductItem>({
  id: null,
  name: "",
  price: "",
});
const handleChooseSubscribe = (item: any, index: number) => {
  activeSubscribeIndex.value = index;
  activeSubscribe.value = item;
};

// 退款规则
const protocolsRef = ref();
const handleOpenProtocol = (type: string) => {
 protocolsRef.value.open(type)
};
/**
 * 优惠码
 */
const couponCode = ref("");
const hasCoupon = ref(false);
const couponResult = ref({
  buy_price: 0,
  discount: 0,
  msg: "",
});
// 验证优惠码
const handleCheckCouponCode = () => {
  if (!couponCode.value || !activeSubscribe.value.id) return;
  checkCoupon({
    coupon: couponCode.value,
    product_id: activeSubscribe.value.id,
  })
    .then((res: any) => {
      const { buy_price, discount } = res;
      couponResult.value = {
        buy_price,
        discount: Number(discount) || 0,
        msg: "",
      };
      activeSubscribe.value.price = buy_price;
      hasCoupon.value = true;
    })
    .catch((err) => {
      hasCoupon.value = false;
      couponResult.value = {
        buy_price: 0,
        discount: 0,
        msg: err.msg,
      };
    });
};

/**
 * 选择支付方式
 */
const activePayment = ref("wechat");
const handleChangePayment = (item: any) => {
  activePayment.value = item.value;
};

/**
 * 金额结算
 */
const paymentData = ref({
  total: 288,
  coupon: 100,
  payment: 188,
  currency: "CNY",
});

/**
 * 立即购买
 */
const handleCreateOrder = () => {
  // subscribePageType.value = "pay";
  createOrder({
    coupon: couponCode.value,
    product_id: activeSubscribe.value.id,
  })
    .then((res) => {
      ElMessage.success("创建订单成功");
      handlePay({
        amount: activeSubscribe.value.price,
        invoice_id: res?.invoice_id,
      });
    })
    .catch((err) => {
      // ElMessage.error('创建订单失败');
    });
  console.log("立即购买, paymentData.value", paymentData.value);
};

/**
 * 支付
 */
const stripePayment = useStripePayment();
const showDetail = ref(false);
const paymentRef = ref();

const stripeStatusDialogVisible = ref(false);
const handlePay = (data: any) => {
  if (activePayment.value === "alipay") {
    // 支付宝支付
    subscribePageType.value = "pay";
    const _data = {
      invoice_id: data.invoice_id,
      amount: data.amount,
    };
    nextTick(() => {
      paymentRef.value.createQrcode(_data).then((res) => {
        console.log("createAlipayQrcodeApi success ------", res);
        subscribePageType.value = "list";
      });
    });
  } else if (activePayment.value === "stripe") {
    // Stripe
    const _data = {
      invoice_id: data.invoice_id,
      price: data.amount,
      pid: generateRandomString(6),
    };
    stripePayment
      .makePayment(_data)
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

const closePayment = () => {
  subscribePageType.value = "list";
  paymentRef.value.stopPoll();
};

// 关闭stripe支付状态弹窗
const handleStripeStatusOk = () => {
  stripePayment
    .queryPaymentResult()
    .then((res) => {
      console.log("useStripePayment.queryPaymentResult success ------", res);
      stripeStatusDialogVisible.value = false;
    })
    .catch((err) => {
      console.log("useStripePayment.queryPaymentResult error ------", err);
    });
};
const handleStripeStatusCancel = () => {
  stripeStatusDialogVisible.value = false;
};
</script>
<style lang="less" scoped>
.progress-container {
  height: 8px;
  background: #d5dee3;
  width: 100%;
  display: flex;
  .progress-bar {
    height: 100%;
  }
  .used-progress {
    background: #3365f9;
  }
  .today-progress {
    background: #24c390;
  }
}
.progress-text {
  font-size: 12px;
  &::before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    vertical-align: text-bottom;
    margin-right: 4px;
  }
}
.used-text {
  &::before {
    background: #3365f9;
  }
}
.today-text {
  &::before {
    background: #24c390;
  }
}
.unused-text {
  &::before {
    background: #d5dee3;
  }
}

.subscribe-wrap {
  height: calc(100vh - 150px - 72px);
  overflow: auto;
}
.subscribe-list {
  // display: grid;
  // grid-template-columns: repeat(4, 1fr); /* 一行四列 */
  // gap: 10px; /* 列之间的间距 */

  .subscribe-list-item {
    position: relative;
    cursor: pointer;
    background-color: var(--el-card-bg); /* 背景颜色 */
    text-align: center; /* 文本居中 */
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s ease-in-out;

    .item-price {
      // font-size: 24px;
      font-weight: bold;
      color: #543b19;
    }
    .unit-price {
      height: 36px;
      line-height: 36px;
      background: #f5dfcc;
      color: #543b19;
      border-radius: 0 0 10px 10px;
    }
    .item-tag {
      position: absolute;
      top: -15px;
      left: -2px;
      min-width: 116px;
      line-height: 30px;
      padding: 0 8px;
      background: #373536;
      color: #ffe8c8;
      border-radius: 12px 0 12px 0;
    }
  }
  // .subscribe-list-item-active {
  //   background: linear-gradient(0deg, #fff9ef 0%, #fdf4e4 100%);
  //   border: 2px solid #c2a172;
  // }
}

.payment-list {
  .payment-list-item {
    position: relative;
    cursor: pointer;
    text-align: center; /* 文本居中 */
    border: 2px solid var(--el-border-color);
    border-radius: 12px;
    padding: 4px;
    &:hover {
      border: 2px solid var(--el-color-primary);
    }
    & > img {
      width: 48px;
      height: 48px;
    }
    .active-icon {
      position: absolute;
      top: -2px;
      right: -2px;
      color: #fff;
      background: #3366ff;
      padding: 2px;
      border-radius: 3px;
    }
  }
  .payment-list-item-active {
    border: 2px solid var(--el-color-primary);
  }
}
.payment-footer {
  position: fixed;
  left: 234px;
  bottom: 0;
  width: calc(100% - 226px - 200px);
  .payment-footer_detail {
    // box-shadow: 0 0 8px #eaeaea;
    padding: 16px;
  }
  .payment-footer_btn {
    // padding: 16px;
  }
}
</style>
