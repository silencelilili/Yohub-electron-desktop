import {
  getAlipayQrcode,
  getAlipayStatus,
  getStripeStatus,
  stripePayment,
} from "@/api/order";
import { ref } from "vue";

/**
 * 支付方式：Stripe
 * @returns
 */
export const useStripePayment = () => {
  const pid = ref("");
  const maxPollingTime = ref(10 * 60 * 1000);
  // 调用支付接口
  const makePayment = async (data: any) => {
    return new Promise((resolve, reject) => {
      pid.value = data.pid;
      stripePayment(data)
        .then((res: any) => {
          if (res?.ret === 1) {
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
    queryPaymentResult,
    stopPolling,
  };
};

/**
 * 支付方式：Alipay
 * @returns
 */
export const useAlipayPayment = () => {
  const pid = ref("");
  const maxPollingTime = ref(10 * 60 * 1000); // 30分钟换算成毫秒
  // 调用支付接口
  const makePayment = async (data: any) => {
    return new Promise((resolve, reject) => {
      getAlipayQrcode(data)
        .then((res: any) => {
          resolve(res);
          pid.value = data.pid;
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
          const res: any = await getAlipayStatus(pid); // 替换成实际接口地址
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
    pid,
    makePayment,
    pollAlipayStatusApi,
    stopPolling,
  };
};
