import { ElMessage, ElMessageBox } from "element-plus";
import { h } from "vue";

/**
 * 检测当前用户的所在地是否为中国大陆
 * 若是 则弹出提示框
 * @returns
 */
export const useCountry = () => {
  const open = (callback: Function) => {
    ElMessageBox({
      title: "",
      center: true,
      showClose: false,
      customStyle: {
        width: "300px",
      },
      closeOnClickModal: false,
      closeOnPressEscape: false,
      message: h("div", { style: "padding: 8px 18px;text-align: center;" }, [
        h(
          "p",
          { style: "font-size: 16px" },
          "检测到您可能位于中国大陆 Yohub将无法正常工作 "
        ),
        // h("p", { style: "margin-top: 10px" }, "《隐私政策》和《服务协议》 "),
      ]),
      showCancelButton: false,
      confirmButtonText: "退出APP",
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = "正在退出APP...";

          setTimeout(() => {
            done();
            instance.confirmButtonLoading = false;
            callback();
          }, 2000);
        } else {
          done();
        }
      },
    });
  };

  return {
    open,
  };
};
