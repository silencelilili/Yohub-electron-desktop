<template>
  <div class="flex-center-col">
    <div class="font-size-5 fw-500 mb-4">
      实付价：<span class="color-#FF0000"> ￥ {{ orderInfo.price }}</span>
    </div>
    <div class="qr-wrap">
      <div id="qrcode-content"></div>
      <div v-if="payResult.status === 'error'" class="qr-overlay">
        {{ payResult.msg }}
      </div>
    </div>
    <p class="flex-center">
      <img class="w-16 mr-2" src="@/assets/images/pay-ali.png" />
      请用支付宝进行扫码支付
    </p>
    <div v-if="payResult.status === 'error'" class="m-4">
      <el-button link type="primary" @click="refreshPayCode"
        ><el-icon><RefreshRight /></el-icon> 刷新
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, defineExpose, toRefs, ref } from "vue";
import QRCode from "qrcode";
import { type IAlipayQrcodeParams } from "@/api/order";
import { useAlipayPayment } from "@/hooks/usePayment";

const alipayPayment = useAlipayPayment();
const props = defineProps({
  orderInfo: {
    type: Object,
    default: () => {
      return { price: 0 };
    },
  },
  // 支付方式
  payType: {
    type: String,
    default: "wechat",
  },
});
const { orderInfo, payType } = toRefs(props);
const emits = defineEmits(["refresh", "success", "error"]);

const currentPayInfo = ref();
const payResult = ref({
  status: "loading",
  msg: "正在生成二维码",
});
// 刷新
function refreshPayCode() {
  if (currentPayInfo.value) {
    createAlipayQrcodeApi(currentPayInfo.value);
    emits("refresh")
  }
}

function createQrcode(data: any) {
  if (payType.value === "f2f") {
    return createAlipayQrcodeApi(data);
  } else {
    ElMessage.warning("暂不支持该支付方式");
  }
}

// 支付宝-创建支付二维码
function createAlipayQrcodeApi(data: IAlipayQrcodeParams): Promise<any> {
  currentPayInfo.value = data;
  payResult.value = {
    status: "loading",
    msg: "正在生成二维码",
  };
  let element = document.getElementById("qrcode-content");
  while (element?.firstChild) {
    element.removeChild(element.firstChild);
  }
  return new Promise((resolve, reject) => {
    alipayPayment.makePayment(data).then((res: any) => {
      QRCode.toCanvas(res.qrcode, {
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
      }).then((canvas: Element) => {
        element?.appendChild(canvas);
        console.log("支付二维码生成成功", res)
        alipayPayment
          .pollAlipayStatusApi(res.pid)
          .then((result) => {
            ElMessage.success("支付成功");
            console.log("支付成功-----");
            payResult.value = {
              status: "success",
              msg: "支付成功",
            };
            currentPayInfo.value = null;
            emits("success")
            resolve(result);
          })
          .catch((err) => {
            console.log("支付失败-----", err);
            payResult.value = {
              status: "error",
              msg: err === "timeout" ? "支付超时" : "支付失败",
            };
            emits("error")
            reject(err);
          });
      });
    });
  });
}

function stopPoll() {
  alipayPayment.stopPolling();
}
defineExpose({
  createQrcode,
  stopPoll,
});
</script>
<style lang="less" scoped>
.qr-wrap {
  height: 300px;
  width: 300px;
  position: relative;
}
.qr-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(
    0,
    0,
    0,
    0.88
  ); /* 这里使用rgba设置半透明黑色蒙层，透明度为0.5，可按需调整 */
  color: red;
  font-size: 22px;
  /* line-height: 300px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
