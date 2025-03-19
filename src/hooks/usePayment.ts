import {
  getAlipayQrcode,
  getAlipayStatus,
  getStripeStatus,
  stripePayment,
} from "@/api/order";
import { ElMessageBox } from "element-plus";
import { ref } from "vue";

/**
 * 支付方式：Stripe
 * @returns
 */
export const useStripePayment = () => {
  const pid = ref("");
  const maxPollingTime = ref(30 * 60 * 1000);
  // 调用支付接口
  const makePayment = async (data: any) => {
    return new Promise((resolve, reject) => {
      stripePayment(data)
        .then((res: any) => {
          if (res?.ret === 1) {
            maxPollingTime.value = 30 * 60 * 1000;
            pid.value = data.pid;
            window.$Yohub.$desktop({
              type: "openExternal",
              data: res.url,
            });
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  };
  const open = () => {
    ElMessageBox.confirm("请确认是否完成支付？", "Stripe支付", {
      confirmButtonText: "支付完成",
      cancelButtonText: "支付未完成",
      center: true,
      showClose: false,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          queryPaymentResult().then((res) => {
            done();
          });
        } else {
          done();
        }
      },
    });
  };
  // 轮询查询支付结果
  const queryPaymentResult = async () => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const poll = async () => {
        const currentTime = Date.now();
        if (currentTime - startTime > maxPollingTime.value) {
          reject("timeout");
          return;
        }

        try {
          console.log("pid::::", pid.value);
          const res: any = await getStripeStatus(pid.value); // 替换成实际接口地址
          if (res?.result === 1) {
            resolve(res);
          } else {
            // 设置轮询间隔时间为1秒，可按需调整
            setTimeout(poll, 1000);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  };
  function stopPolling() {
    maxPollingTime.value = 0;
  }

  return {
    pid,
    makePayment,
    open,
    queryPaymentResult,
    stopPolling,
  };
};

/**
 * 支付方式：Alipay
 * @returns
 */
export const useAlipayPayment = () => {
  const _pid = ref("");
  const maxPollingTime = ref(30 * 60 * 1000); // 30分钟换算成毫秒
  // 调用支付接口
  const makePayment = async (data: any) => {
    return new Promise((resolve, reject) => {
      getAlipayQrcode(data)
        .then((res: any) => {
          maxPollingTime.value = 30 * 60 * 1000;
          _pid.value = res?.pid || "";
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // 轮询支付结果
  function pollAlipayStatusApi(pid: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const poll = async () => {
        const currentTime = Date.now();
        if (currentTime - startTime > maxPollingTime.value) {
          reject("timeout");
          return;
        }

        try {
          console.log("pollAlipayStatusApi", _pid.value || pid);
          const res: any = await getAlipayStatus(_pid.value || pid); // 替换成实际接口地址
          console.log("res", res);
          if (res?.result === 1) {
            resolve();
          } else {
            // 设置轮询间隔时间为1秒，可按需调整
            setTimeout(poll, 1000);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  function stopPolling() {
    maxPollingTime.value = 0;
  }

  return {
    pid: _pid,
    makePayment,
    pollAlipayStatusApi,
    stopPolling,
  };
};
