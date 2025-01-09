<template>
   <div class="line-wrap">
    <div v-for="(item, key) in nodesList" :key="key">
        <template v-if="item.nodes.length">
          <div class="color-#3366FF mb-4" style="font-size: 16px">
            {{ item.name }}
          </div>
          <el-collapse v-model="activeNames" @change="handleChangeCollapse">
            <el-collapse-item
              v-for="(group, groupKey) in item.groups"
              :key="groupKey"
              class="line-item bg-color2"
            >
              <template #title>
                <div class="flex flex-1 justify-between items-center">
                  <span>{{ group.name }} </span>
                  <span class="flex items-center gap-2 mr-2"><el-checkbox
                    v-model="group.checked"
                    label="自动选择"
                    size="large"
                    :disabled="group.disabled"
                  />
                  <el-icon v-if="nodeChecking" class="is-loading">
                    <Loading />
                  </el-icon>
                  <svg-icon v-else name="check-speed" @click.stop="handleCheckSpeedNode(group, groupKey)"></svg-icon>
                </span>
                </div>
              </template>
              <div>
                <div
                  v-for="(node, index) in group.nodes"
                  :key="node.id"
                  :class="['flex justify-between items-center my-3 p-3 last-line-item', {
                    'active-node-item': activeNode.id === node.id,
                  }]"
                  @click="handleNodeClick(node, index)"
                >
                  <span>{{ node.name }} </span>
                  <span>
                    <svg-icon
                      name="network"
                      :style="{ color: node.color, fontSize: '18px' }"
                    ></svg-icon>
                    {{ node.latency }}</span
                  >
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
        </template>
      </div>
  </div>
</template>
<script lang="ts" setup>
import { getNodesList } from "@/api/user";
import { useUserStore } from "@/stores/index";
import { computed, defineEmits, defineExpose, onMounted, ref } from "vue";
import { NodesMap } from "./config";
import { pingAddress } from "@/utils/yohub.desktop";
import { Loading } from "@element-plus/icons-vue";

const emits = defineEmits(["change"]);

const userInfo = computed(() => useUserStore().userInfo);
const userIsVip = computed(() => {
   return userInfo.value && userInfo.value?.class !== 0
});
const activeNode = ref({
  id: 0
})
onMounted(() => {
})

// 折叠面板切换
const activeNames = ref();
const handleChangeCollapse = (val: any) => {
  // console.log("handleChangeCollapse", val);
}
//  线路列表
const nodesList = ref();
// 获取链路列表
const _getNodesListApi = () => {
  getNodesList().then((res: any) => {
    const data = res.data;
    setData(data);
  });
};
const setData = (data: any) => {
  let _nodesMap: any = JSON.parse(JSON.stringify(NodesMap));
  data.map((node: any) => {
    const _class = node.class; // 0: 免费线路 1: 高速专线 2: 游戏专线
    const _group = node.node_group; // 0: 中国大陆 1:中国香港 2:美国
    node.latency = "0 ms"
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
  activeNode.value = node;
  emits("change", node);
};

// TODO: 线路下的所有节点测速
const nodeChecking = ref(false);
const handleCheckSpeedNode = (group: any, groupKey: number) => {
  nodeChecking.value = true;
  const _address = group.nodes.map((item: any) => item.host);
  if(!_address.length) return;
  pingAddress(_address, (res: any) => {
    group.nodes.map((item: any, index: number) => {
      item.latency = res[index].latency
    })
    nodeChecking.value = false;
  });
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