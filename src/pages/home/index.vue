<template>
  <el-row :gutter="16" class="h-100% p-2" style="margin: 0">
    <el-col :span="12" class="h-100%">
      <el-card class="h-100%" shadow="never">
        <div class="border-bottom h-42vh line-status mb-10 map-bg">
          <div
            :class="['dot-text dot', connectionStatus.className]"
            @click="handleSwitchStatus"
          >
            <el-tooltip
              effect="dark"
              :content="$t(connectionStatus.tips)"
              placement="top"
            >
              <svg-icon
                name="power"
                class="dot-icon"
                style="width: 46px; height: 46px"
              />
            </el-tooltip>

            {{ $t(connectionStatus.text) }}
          </div>
        </div>
        <div class="border-bottom my-4">
          <div class="color-#8E9CB2 flex items-center">
            <img
              src="@/assets/images/home/mode-global@2x.png"
              alt=""
              class="w-20px"
            />
            {{ $t("home.currentLine") }}
          </div>
          <div
            class="flex justify-between items-center p-4 cursor-pointer"
            @click="handleOpenDrawer('line')"
          >
            <div>{{ currentLine }}</div>
            <el-icon><ArrowRightBold /></el-icon>
          </div>
        </div>

        <div class="border-bottom my-4">
          <div class="color-#8E9CB2 flex items-center">
            <img
              src="@/assets/images/home/mode-policy@2x.png"
              alt=""
              class="w-20px"
            />{{ $t("home.currentMode") }}
          </div>
          <div
            class="flex justify-between items-center p-4 cursor-pointer"
            @click="handleOpenDrawer('mode')"
          >
            <div>{{ currentMode.name }}</div>
            <el-icon><ArrowRightBold /></el-icon>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12" class="h-100%">
      <el-card class="h-100%" shadow="never">
        <div class="border-bottom h-42vh">
          <ul class="home-network-list">
            <li>
              <span
                ><img src="@/assets/images/home/duration.png" alt="" />{{
                  $t("home.speedTime")
                }}</span
              >
              <span class="color-#3366FF">{{ trafficData.speedTime }}</span>
            </li>
            <li>
              <span
                ><img src="@/assets/images/home/late.png" alt="" />{{
                  $t("home.linkDelay")
                }}</span
              >
              <span class="color-#3366FF">{{ trafficData.delay }}</span>
            </li>
            <li>
              <span
                ><img src="@/assets/images/home/downlink.png" alt="" />{{
                  $t("home.realTimeDown")
                }}</span
              >
              <span class="color-#3366FF">{{ trafficData.downlink }}/s</span>
            </li>
            <li>
              <span
                ><img src="@/assets/images/home/uplink.png" alt="" />{{
                  $t("home.realTimeUp")
                }}</span
              >
              <span class="color-#3366FF">{{ trafficData.uplink }}/s</span>
            </li>
          </ul>
        </div>

        <div class="flex justify-between items-center mt-4 mb-2">
          <span>总流量 <strong class="color-#3366FF">4.6G</strong> </span>
          <span class="color-#999999">近7天</span>
        </div>
        <div id="myEChartsBar" style="height: 240px"></div>
      </el-card>
    </el-col>
  </el-row>

  <el-drawer
    v-model="drawer"
    :title="drawerTitle"
    size="40%"
    :before-close="handleDrawerClose"
  >
    <!-- 模式选择 -->
    <div v-if="drawerType === 'mode'">
      <div
        class="flex justify-between items-center mode-item"
        v-for="item in modeList"
        :key="item.key"
      >
        <img
          v-if="item.key === 'policy'"
          src="@/assets/images/home/mode-policy@2x.png"
          alt=""
          class="w-11 mr-2"
        />
        <img
          v-if="item.key === 'global'"
          src="@/assets/images/home/mode-global@2x.png"
          alt=""
          class="w-11 mr-2"
        />
        <div class="flex flex-col flex-1">
          <span>{{ item.name }}</span>
          <span class="color-#668CFF">{{ item.desc }}</span>
        </div>
        <el-checkbox v-model="item.value" label="" size="large" />
      </div>
    </div>
    <!-- 线路选择 -->
    <div v-if="drawerType === 'line'" class="line-wrap">
      <div class="" v-for="item in lineList" :key="item.value">
        <div class="color-#3366FF" style="font-size: 18px">
          {{ item.label }}
        </div>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item
            v-for="child in item.children"
            :key="child.value"
            class="line-item"
          >
            <template #title>
              <div class="flex flex-1 justify-between items-center">
                <span>{{ child.label }}</span>
                <el-checkbox
                  v-model="child.value"
                  label="自动选择"
                  size="large"
                />
              </div>
            </template>
            <div>
              <div
                v-for="li in child.children"
                :key="li.value"
                class="flex justify-between items-center my-3 p-3 last-line-item"
              >
                <span>{{ li.label }}</span>
                <span>{{ li.speed }}</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <!-- <div
          class="line-item flex justify-between items-center"
          v-for="child in item.children"
          :key="child.value"
        >
          <div class="flex flex-col flex-1">
            <span>{{ child.label }}</span>
          </div>
          <el-checkbox v-model="currentLine" label="" size="large" />
        </div> -->
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { ArrowRightBold } from "@element-plus/icons-vue";
import { reactive, ref, onMounted, computed } from "vue";
import { ModeList, LineList, connectionStatusEnum } from "./config";
import { useLocale } from "@/hooks/useLocale";
import { convertByte, formatTime } from "@/utils";
import { useIntervalFn } from "@vueuse/core";
import echarts from "@/utils/echarts";
import bus from "@/utils/bus";
import useConnect from "@/hooks/useConnect";

const { t } = useLocale();
// 从缓存中获取连接状态
const { connectionStatus, handleConnect, handleDisconnect } = useConnect();
const onlineTimes = ref(0);
const trafficData = reactive({
  uplink: "0.00KB",
  downlink: "0.00KB",
  delay: "0ms",
  speedTime: "00:00:00",
});

// 在线时长
const { pause, resume, isActive } = useIntervalFn(() => {
  onlineTimes.value += 1;
  trafficData.speedTime = formatTime(onlineTimes.value);
}, 1000);
pause();

onMounted(() => {
  currentMode.value = modeList.policy;
  // handleStartXray();
  initBar();

  // window.ipcRenderer.on("traffic-result", (_event: any, data: any) => {
  bus.on("traffic-result", (data: any) => {
    if (!!data) {
      trafficData.uplink = convertByte(data.diffUp);
      trafficData.downlink = convertByte(data.diffDown);
    } else {
      trafficData.uplink = "0.00KB/s";
      trafficData.downlink = "0.00KB/s";
    }
  });
  bus.on("latency-result", (data: any) => {
    if (!!data) {
      trafficData.delay = data.latency;
    } else {
      trafficData.delay = "0ms";
    }
  });
});
// 连接/断开 =============
const handleSwitchStatus = () => {
  const _currStatus = connectionStatus.value;
  if (_currStatus.status === connectionStatusEnum.CONNECTED) {
    handleDisconnect();
    pause();
  } else if (_currStatus.status === connectionStatusEnum.DISCONNECTED) {
    handleConnect();
    resume();
  }
};

// 切换线路/模式 ==============
const drawer = ref(false);
const drawerTitle = ref("");
const drawerType = ref("");
// 模式列表
const modeList = reactive(ModeList);
//  线路列表
const lineList = reactive(LineList);

const currentLine = ref("中国大陆");
const currentMode = ref({ name: "", key: "" });
const handleOpenDrawer = (type: string) => {
  drawerType.value = type;
  if (type === "line") {
    drawerTitle.value = t("home.switchLine"); //"切换线路";
  } else if (type === "mode") {
    drawerTitle.value = t("home.switchMode"); // "切换模式";
    currentMode.value = modeList.policy;
  }
  drawer.value = true;
};
const handleDrawerClose = () => {
  drawer.value = false;
};

// 柱状图
const initBar = () => {
  const myEChart = echarts.init(document.getElementById("myEChartsBar"));
  const option = {
    grid: {
      left: "0",
      right: "1%",
      bottom: "1%",
      top: "36",
      containLabel: true,
    },
    color: ["#87DD8B", "#3366FF"],
    legend: {
      itemGap: 90,
      itemWidth: 20,
      itemHeight: 10,
      itemStyle: {
        borderCap: "round",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "上行",
        type: "bar",
        stack: "Ad",
        emphasis: {
          focus: "series",
        },
        barWidth: 20,
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "下行",
        type: "bar",
        stack: "Ad",
        emphasis: {
          focus: "series",
        },
        barWidth: 20,
        data: [120, 132, 101, 134, 90, 230, 210],
      },
    ],
  };
  myEChart.setOption(option);
  // 根据页面大小自动响应图表大小
  window.addEventListener("resize", function () {
    myEChart.resize();
  });
};
</script>
<style lang="less" scoped>
.line-status {
  display: flex;
  align-items: center;
  justify-content: center;
  .dot-text {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 18px;
  }
  .dot {
    width: 118px;
    height: 118px;
    border-radius: 50%;
    z-index: 1;
    position: relative;
    cursor: pointer;
  }
  .dot::after {
    width: 100%;
    height: 100%;
    content: "";
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -2;
  }
  .dot::before {
    width: 100%;
    height: 100%;
    content: "";
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .dot-online {
    background-color: #3366ff;
    color: #fff;
    svg {
      color: #ffff;
    }
    &::after {
      animation: dot-play 2s linear 400ms infinite;
      background-color: #3366ff;
    }
    &::before {
      background-color: #3366ff;
      animation: dot-play 2s linear 200ms infinite;
      animation-delay: 2s; // 延迟2s
    }
  }

  .dot-offline {
    background-color: #f0f4ff;
    color: #464d62;
    svg {
      color: #3366ff;
    }
    &::before {
      background-color: #a8afc2;
      transform: scale(2);
      opacity: 0.1;
      z-index: -1;
    }
    &::after {
      background-color: #a8afc2;
      transform: scale(1.5);
      opacity: 0.2;
      z-index: -2;
    }
  }
  .dot-loading {
    animation-name: status-bg;
    animation-duration: 3s; /* 设置动画持续时间为3秒 */
    animation-iteration-count: infinite; /* 让动画无限次循环播放 */
    animation-timing-function: ease-in-out; /* 设置动画的时间函数，使过渡更平滑 */
    .dot-icon {
      animation: icon-blink 1s linear 20ms infinite;
    }
  }

  @keyframes icon-blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes status-bg {
    0% {
      background-color: #3366ff;
    }
    50% {
      background-color: #1a3399;
    }
    100% {
      background-color: #3366ff;
    }
  }
  @keyframes dot-play {
    from {
      transform: scale(1);
      opacity: 0.2;
    }
    to {
      transform: scale(3);
      opacity: 0;
    }
  }
}
.map-bg {
  background-image: url(@/assets/images/home/map.png);
  background-size: cover;
  background-position: center;
}

.home-network-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  img {
    width: 28px;
    height: 28px;
    margin-right: 28px;
    vertical-align: middle;
  }
}

.mode-item {
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}
.line-wrap {
  .line-item {
    background: var(--el-bg-color-overlay);
    border-radius: 6px;
    padding: 8px 16px;
    // margin-bottom: 12px;
    .last-line-item {
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      background: var(--el-bg-color-overlay);
      cursor: pointer;
    }
  }

  :deep(.el-collapse) {
    border: none;
    .el-collapse-item__header {
      background: transparent;
      border-bottom: none;
    }
    .el-collapse-item__wrap {
      background: transparent;
      border-bottom: none;
      .el-collapse-item__content {
        padding-bottom: 0;
      }
    }
  }
}
</style>
