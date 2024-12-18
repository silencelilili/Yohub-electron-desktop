<template>
  <div class="flex">
    <div class="m-4 flex-1">
      <div class="vip-bg mb-4 p-4">
        <div class="flex items-center mt-6">
          <img
            src="@/assets/images/users/free-logo@2x.png"
            alt=""
            class="w-60px"
          />
          <div class="ml-4 flex-1">
            <div class="font-size-5 mb-3">{{ userInfo?.user_name }}</div>
            <!-- vip -->
            <!-- <p class="color-#8F6E36">
              您的VIP会员将在 <strong>1725</strong> 天后到期（2029-06-04）
            </p> -->
            <!-- 普通会员 -->
            <div>
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
          </div>
        </div>
      </div>
      <el-card shadow="never" :class="['pos-relative h-100%']">
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
              <div class="item-tag">限时5折</div>
              <div class="flex-1 line-height-9 mt-8">
                <div class="text-color">{{ item?.name }}</div>
                <div class="item-price">
                  <span class="font-size-3">¥</span
                  ><span class="font-size-7">{{ item?.price }}</span>
                </div>
                <div class="color-#C3B097">
                  <s
                    ><span class="font-size-3">¥</span
                    ><span class="font-size-4">{{ item?.price }}</span></s
                  >
                </div>
              </div>
              <div class="unit-price">{{ item?.price }}</div>
            </div>
          </div>

          <div class="secondary-color my-4">
            <div>包含VIP会员所有权益（时间卡不限流量，流量卡不限时间）</div>
            <div>
              最长支持30天退款（特价无退款），详见<a class="color-#3366FF"
                >退款规则</a
              >
            </div>
          </div>
          <!-- 优惠码 -->
          <div class="my-8">
            <el-space>
              <span>优惠码</span>
              <el-input
                v-model="couponCode"
                style="width: 240px"
                placeholder="请输入优惠码"
              />
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

          <div class="payment-footer bg-color border-top">
            <div v-if="showDetail" class="payment-footer_detail box-shadow">
              <div class="fw-500 flex-between-center">
                <span>年卡：</span>
                <span class="color-#FF0000"
                  >CNY ￥ {{ activeSubscribe.price }}</span
                >
              </div>
              <div class="fw-500 flex-between-center">
                <span>优惠券：</span>
                <span class="color-#FF0000"
                  >CNY ￥ {{ activeSubscribe.price }}</span
                >
              </div>
            </div>
            <div class="flex-between-center p-4">
              <div class="fw-500">
                实付 <span>CNY ￥ {{ activeSubscribe.price }}</span>
                <div class="secondary-color">
                  支付即代表接受《会员服务&自动续费协议》
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
  </div>
</template>
<script lang="ts" setup>
import { onMounted, defineProps, ref, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import { subscribeList, paymentOptions, type IProductItem } from "./config";
import { ArrowUp, ArrowLeft } from "@element-plus/icons-vue";
import BannerVue from "./banner.vue";
import PaymentVue from "@/components/Payment.vue";
import { getProductList, checkCoupon, createOrder } from "@/api/order";
import { useUserStore } from "@/stores";
import { formatByteSize } from "@/utils";

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
  transferData.value = {
    enable: formatByteSize(userInfo.value?.transfer_enable || (0 as number)),
    today: formatByteSize(userInfo.value?.transfer_today || (0 as number)),
    total: formatByteSize(userInfo.value?.transfer_total || (0 as number)),
  };
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
  productList.value =
    Object.values(data) ||
    ([...data.tabp, ...data.bandwidth, ...data.time] as any);
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

/**
 * 优惠码
 */
const couponCode = ref("");
// 验证优惠码
const handleCheckCouponCode = () => {
  if (!couponCode.value || !activeSubscribe.value.id) return;
  checkCoupon({
    coupon: couponCode.value,
    product_id: activeSubscribe.value.id,
  }).then((res) => {
    console.log("checkCoupon------", res);
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
  subscribePageType.value = "pay";

  createOrder({
    coupon: couponCode.value,
    product_id: activeSubscribe.value.id,
  })
    .then((res) => {
      console.log("createOrder success ------", res);
      ElMessage.success("创建订单成功");
      subscribePageType.value = "pay";
      nextTick(() => {
        handlePay({
          amount: activeSubscribe.value.price,
          invoice_id: res?.invoice_id,
        });
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
const showDetail = ref(false);
const paymentRef = ref();
const handlePay = (data: any) => {
  const _data = {
    invoice_id: data.invoice_id,
    amount: data.amount,
  };
  paymentRef.value.createQrcode(_data).then((res) => {
    console.log("createAlipayQrcodeApi success ------", res);
    subscribePageType.value = "list";
  });
};

const closePayment = () => {
  subscribePageType.value = "list";
  paymentRef.value.stopPoll();
};
</script>
<style lang="less" scoped>
.vip-bg {
  background-image: url("@/assets/images/users/bg_free.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
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
      width: 116px;
      height: 30px;
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
