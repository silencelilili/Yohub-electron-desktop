<template>
   <div class="line-wrap">
    <el-collapse v-model="activeNames" @change="handleChangeCollapse">
      <el-collapse-item
        v-for="(line, pindex) in nodesList"
        :key="pindex"
        :name="line.label"
        class="line-item bg-color2"
      >
        <template #title>
          <div class="flex flex-1 justify-between items-center">
            <span>{{ line.label }} </span>
            <span class="flex items-center gap-2 mr-2">
              <!-- <el-checkbox
              v-model="line.checked"
              label="自动选择"
              size="large"
              :disabled="line.disabled"
            /> -->
            <el-icon v-if="line.checking" class="is-loading">
              <Loading />
            </el-icon>
            <svg-icon v-else name="check-speed" @click.stop="handleCheckSpeedNode(line)"></svg-icon>
          </span>
          </div>
        </template>
        <div>
          <div
            v-for="node in line.children"
            :key="node.id"
            :class="['flex justify-between items-center my-3 p-3 last-line-item', {
              'active-node-item': activeNode.id === node.id,
            }]"
            @click="handleNodeClick(node, pindex)"
          >
            <span>{{ node.line }} </span>
            <span v-if="node.type!=='auto'" class="flex items-center">
         
              <wifi-signal class="mr-1" :delay="linesSpeedObj[node.id].delay" />
              {{ linesSpeedObj[node.id].delay }}ms</span
            >
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
// import { getNodesList } from "@/api/user";
import { useAppStore, useUserStore } from "@/stores/index";
import { computed, defineEmits, defineExpose, defineProps, onMounted, ref, watch } from "vue";
import { NodesMap, currentLineList } from "./config";
// import { newPingAddress, pingAddress } from "@/utils/yohub.desktop";
import { Loading } from "@element-plus/icons-vue";
import WifiSignal from '@/components/WifiSignal.vue'
import useLinesHook from "@/hooks/useLines";
const useLines = useLinesHook()

const emits = defineEmits(["change"]);
const props = defineProps({
  // 节点列表
  data: {
    type: Array,
    default: () => [],
  },
  current: {
    type: Object,
    default: () => {},
  }
});
const userInfo = computed(() => useUserStore().userInfo);
const userIsVip = computed(() => {
   return userInfo.value && userInfo.value?.class !== 0
});
const appStore = useAppStore()
const linesSpeedObj = computed(() => {
  return appStore.linesSpeedMap || {}
})
const activeNode = ref<any>()
onMounted(() => {
  setData(props.data)
  activeNode.value = props.current
  activeNames.value  = [activeNode.value.parentName]
})

watch(() => props.current, (val: any) => {
  activeNode.value = val
  activeNames.value  = [val.parentName]

},
  { deep: true })
watch(() => props.data, (newVal) => {
  setData(newVal, false)
}, {
  deep: true
})
// 折叠面板切换
const activeNames = ref();
const handleChangeCollapse = (val: any) => {
  // console.log("handleChangeCollapse", val);
}
//  线路列表
const nodesList = ref();
const setData = (data: any, isCheck = true) => {
  if(data.length) {
    nodesList.value = data;
    // if(isCheck){
    // setTimeout(() => {
      // handleCheckSpeedNode(nodesList.value[0])
      // }, 1000);
    // }
  }
}
const __setData__ = (data: any) => {
  let _nodesMap: any = JSON.parse(JSON.stringify(NodesMap));
  data.map((node: any) => {
    const _class = node.class; // 0: 免费线路 1: 高速专线 2: 游戏专线
    const _group = node.node_group; // 0: 中国大陆 1:中国香港 2:美国
    node.latency = 0
    if (!userIsVip.value && _class === 0 && _group === 0) {
      _nodesMap[_class].groups[_group].checked = true
      _nodesMap[_class].groups[_group].disabled = false
    } else {
      _nodesMap[_class].groups[_group].checked = false
      _nodesMap[_class].groups[_group].disabled = true
    }
    _nodesMap[_class].nodes.push(node);

    _nodesMap[_class].groups[_group].nodes.push(node);
    return node;
  });
  // console.log("_nodesMap", userIsVip.value, _nodesMap);
  // 默认选择第一个节点
  activeNode.value = _nodesMap[0].groups[0].nodes[0]
  nodesList.value = _nodesMap;
  emits("change", activeNode.value);
}

// 节点选择
const handleNodeClick = (node: any, index: number) => {
  const _node = { ...node };
  // if ('auto_'.includes(node.id)) { // 自动
  // }
  // activeNode.value = _node
  emits("change", _node);
};

// TODO: 线路下的所有节点测速
const nodeChecking = ref(false);
/**
 * x<150ms  green
 * x>150ms && x<300ms green
 * x>300ms && x<1000ms warning
 * x>1000ms && x<3000ms warning
 */
const handleCheckSpeedNode = async (group: any) => {
  group.checking = true;
   await useLines.checkSpeed(group)
  // const _address = group.children.map((item: any) => item.detect_target);
  // if(!_address.length) return;
  // const _latency = await newPingAddress(_address[0]);
  // group.children[0].latency = _latency
  // group.children.map((item: any, index: number) => {
  //   if(index > 0){
  //     item.latency = addRandomValue(_latency)
  //   }
  // })
  group.checking = false;
}

defineExpose({
  setData
})
</script>
<style lang="less" scoped>
.line-wrap {
  .line-item {
    // background: var(--el-bg-color-overlay);
    border-radius: 6px;
    padding: 8px 16px;
    margin-bottom: 12px;
    .last-line-item {
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      background: var(--el-bg-color-overlay);
      cursor: pointer;
    }
    .active-node-item{
      position: relative;
      border: 1px solid var(--el-color-primary);
      background: #8daaff33;
      &::before {
        content: '';
        display: inline-block;
        width: 3px;
        height: 44px;
        background: var(--el-color-primary);
        position: absolute;
        left: 0;
        border-radius: 6px;
      }
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