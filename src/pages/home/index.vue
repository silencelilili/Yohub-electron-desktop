<template>
  <el-row :gutter="16" class="h-100% p-2" style="margin: 0">
    <el-col :span="12" class="h-100%">
      <el-card class="h-100%" shadow="never">
        <div class="border-bottom h-42vh line-status mb-10 map-bg">
          <div
            :class="['dot-text dot', currStatus.className]"
            @click="handleSwitchStatus"
          >
            <el-tooltip
              effect="dark"
              :content="$t(currStatus.tips)"
              placement="top"
            >
              <svg-icon
                name="power"
                class="dot-icon"
                style="width: 46px; height: 46px"
              />
            </el-tooltip>

            {{ $t(currStatus.text) }}
          </div>
        </div>
        <!-- 当前线路 -->
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
            <div class="flex-1">
              <p>{{ currentNode.node_group_label }}</p>
              <el-space :size="16">
                <el-text type="primary" size="small">自动</el-text>
                <el-text type="primary" size="small">{{currentNode.name}}</el-text>
              </el-space>
            </div>

            <div class="flex-center">
              <img class="w-10" src="@/assets/images/china-icon.png" alt="" />
              <el-icon><ArrowRightBold /></el-icon>
            </div>
          </div>
        </div>

        <!-- 当前模式 -->
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
            <div class="flex-1">{{ currentMode.name }}</div>
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
              <span class="color-#3366FF">{{ trafficData.downlink }}</span>
            </li>
            <li>
              <span
                ><img src="@/assets/images/home/uplink.png" alt="" />{{
                  $t("home.realTimeUp")
                }}</span
              >
              <span class="color-#3366FF">{{ trafficData.uplink }}</span>
            </li>
          </ul>
        </div>

        <div class="flex justify-between items-center mt-4 mb-2">
           <el-tooltip
            effect="dark"
            content="前七天上下行总流量统计"
            placement="top"
          >
            <span>7天总流量
              <strong class="color-#3366FF">{{ transferTotal }}</strong>
            </span>
          </el-tooltip>
          <!-- <span class="color-#999999">近7天</span> -->
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
    <!-- 模式选择 默认:全局模式 -->
    <div v-show="drawerType === 'mode'">
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
    <div v-show="drawerType === 'line'">
      <NodeListVue ref="nodeListRef" @change="onNodeChange" />
    </div>
   
  </el-drawer>
</template>
<script lang="ts" setup name="HomePage">
import { ArrowRightBold } from "@element-plus/icons-vue";
import { reactive, ref, onMounted, computed, watch, nextTick, onActivated, defineOptions } from "vue";
import {  ModeList, NodeGroup, connectionStatusEnum } from "./config";
import { useLocale } from "@/hooks/useLocale";
import {
  convertByte,
  formatByteSize,
  formatTime,
  getRecentDates,
} from "@/utils";
// import { useIntervalFn } from "@vueuse/core";
import echarts from "@/utils/echarts";
import bus from "@/utils/bus";
import useConnect from "@/hooks/useConnect";
import { useUserStore, useAppStore } from "@/stores/index";
import NodeListVue from './node-list.vue'
import { getNodesList } from "@/api/user";
import { getTrafficRecord } from "@/utils/yohub.desktop"

defineOptions({ name: "HomePage" })
const { t } = useLocale();

const userInfo = computed(() => useUserStore().userInfo);

// 从缓存中获取连接状态
const uconnect =
  useConnect();
// const onlineTimes = ref(0);
const trafficData = reactive({
  uplink: "0.00kb/s",
  downlink: "0.00kb/s",
  delay: "0ms",
  speedTime: "00:00:00",
});

const currStatus = ref(uconnect.connectionStatus);
watch(
  () => useAppStore().onlineStatus,
  (newStatus: any) => {
    currStatus.value = newStatus;
  }
);
watch(
  () => useAppStore().onlineTimes,
  (time: number) => {
    trafficData.speedTime = formatTime(time);
  }
);

//  已使用的总流量
const transferTotal = ref("0");
onMounted(() => {
  // console.log('onMounted', trafficData)
  currentMode.value = modeList.value.policy;

  // transferTotal.value = formatByteSize(
  //   (userInfo.value?.transfer_total || 0) as number
  // );
  _getTrafficRecord();
  _getNodesListApi()
  // window.ipcRenderer.on("traffic-result", (_event: any, data: any) => {
  bus.off("traffic-result", () => {});
  bus.on("traffic-result", (data: any) => {
    if (!!data) {
      trafficData.uplink = convertByte(data.diffUp);
      trafficData.downlink = convertByte(data.diffDown);
    } else {
      trafficData.uplink = "0.00kb/s";
      trafficData.downlink = "0.00kb/s";
    }
  });
  bus.off("latency-result", () => {});
  bus.on("latency-result", (data: any) => {
    if (!!data) {
      trafficData.delay = data.latency;
    } else {
      trafficData.delay = "0ms";
    }
  });
});

onActivated(() => {
  // console.log('activated')
})
// 连接/断开 =============
const handleSwitchStatus = () => {
  const _currStatus = currStatus.value;
  if (_currStatus.status === connectionStatusEnum.CONNECTED) {
    uconnect.handleDisconnect();
    // pause();
  } else if (_currStatus.status === connectionStatusEnum.DISCONNECTED) {
    uconnect.handleConnect();
    // resume();
  }
};

// 切换线路/模式 ==============
const drawer = ref(false);
const drawerTitle = ref("");
const drawerType = ref("");
// 模式列表
const modeList = ref(ModeList);

const currentNode = ref({
  name: "",
  node_group: "",
  node_group_label: ''
});
const currentMode = ref({ name: "", key: "" });

const handleOpenDrawer = (type: string) => {
  drawerType.value = type;
  drawer.value = true;
  nextTick(() => {
   if (type === "line") {
    drawerTitle.value = t("home.switchLine"); //"切换线路";
      if(nodeListRef.value) nodeListRef.value.setData(nodeList.value)
    } else if (type === "mode") {
      drawerTitle.value = t("home.switchMode"); // "切换模式";
      currentMode.value = modeList.value.policy;
    }
 })
};
const handleDrawerClose = () => {
  drawer.value = false;
};

// 监听线路的选择
const nodeListRef = ref();
const nodeList = ref()
// 获取链路列表
const _getNodesListApi = () => {
  getNodesList().then((res: any) => {
    const data = res.data;
    nodeList.value = data;
    onNodeChange(data[0])
  });
};

const onNodeChange = (node: any) => {
  currentNode.value = {...node, node_group_label: NodeGroup[node.node_group]};
};

// 柱状图
// 获取流量汇总数据
const _getTrafficRecord = () => {
  getTrafficRecord((res: any) => {
    const xdata = Object.keys(res)
    const _values = Object.values(res)
    let _up: number[] = []
    let _down: number[] = []
   const _totalVal = _values.map((item: any) => {
      _up.push(item[0]/1024/1024/1024)
      _down.push(item[1] / 1024 / 1024 / 1024)
      const _total = item[0] + item[1]
      return _total
   })
   const sum = _totalVal.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    transferTotal.value = formatByteSize(
      (sum || 0) as number
    );
    initBar(xdata, {up: _up, down: _down})
  })
};
const initBar = (_xData: string[], data: {up: number[], down: number[]}) => {
  // const _xData = getRecentDates(7);
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
      formatter: function (params: any) {
        const _data = params[0].axisValueLabel
        const up = params[0].seriesName + ' : ' + (params[0].value * 1024).toFixed(2) + ' MB';
        const down = params[1].seriesName + ' : ' + (params[1].value * 1024).toFixed(2) + ' MB';
        return _data + '<br>' + up+ '<br>' + down;
      }
    },
    xAxis: {
      type: "category",
      data: _xData,
    },
    yAxis: [
      {
        type: "value",
        axisLabel: {
          // 使用 formatter 函数格式化标签文本
          formatter: '{value} GB' // 在这里设置单位
        },
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
        data: data.up // || [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "下行",
        type: "bar",
        stack: "Ad",
        emphasis: {
          focus: "series",
        },
        barWidth: 20,
        data: data.down // [120, 132, 101, 134, 90, 230, 210],
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

</style>
