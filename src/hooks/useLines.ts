import { getLinesList } from "@/api/user";
import { useAppStore } from "@/stores";
import { isNumber } from "@/utils/is";
import { newPingAddress, pingAddress } from "@/utils/yohub.desktop";
import { getSessionStorage, setSessionStorage } from "@/utils/yohub.store";
import { ref } from "vue";

export interface INodeItem {
  line?: string;
  parentName?: string;
  name?: string;
  node_id?: number | null;
  detect_target?: string;
  traffic_key?: string;
  proxy_port?: string;
  id?: string;
  region?: string;
}

interface CountryData {
  [key: string]: Array<{
    node_id: string;
    detect_target: string;
    traffic_key: string;
    proxy_port: number;
    [x: string]: any;
  }>;
}

interface LineData {
  label: string;
  checking: boolean;
  disabled: boolean;
  children: Array<{
    id: string;
    parentName: string;
    latency: number;
    color?: string;
    [x: string]: any;
  }>;
}
const defaultAutoLine = {
  line: "自动选择",
  id: "auto",
};

export default function useLinesHook() {
  const appStore = useAppStore();
  const lineList = ref<any>([]);
  const currentLine = ref<INodeItem>(
    getSessionStorage("currentLine") || { parentName: "", line: "" }
  );
  const getLines = () => {
    return new Promise((resolve, reject) => {
      getLinesList().then(async (res: any) => {
        const data = res.data;
        // 去除字符串中的转义字符，使其符合 JSON 格式
        const formattedStr = data
          .replace(/\\r\\n|\\t/g, "")
          .replace(/\\n/g, "")
          .replace(/\\t/g, "");
        try {
          const jsonObj = JSON.parse(formattedStr);
          // console.log("jsonObj", jsonObj);
          lineList.value = _setNewLinesData(jsonObj);
          // console.log("lineList", lineList.value);
          appStore.setLinesList(lineList.value)

          const _initLines = _initProcessNodes(lineList.value);
          appStore.setLinesSpeed(_initLines);

          // 开始探测
          const __d = await processNodes(lineList.value);
          appStore.setLinesSpeed(__d);
          // console.log("__d", __d);

          const fast_key: string = _findFastestKey(__d);
          const fast_item = _findNodeById(lineList.value, fast_key);

          // TODO:设置延迟时间最短的
          if (!currentLine.value.id) {
            setLine(fast_item, true);
          }
          resolve(lineList.value);
        } catch (e) {
          console.error("Error parsing JSON:", e);
          reject(e);
        }
      });
    });
  };

  const setLine = (line: any, isInit = false, callback?: Function) => {
    currentLine.value = { ...line };
    appStore.setCurrentLine(line)
    if (!isInit) {
      if (callback) callback(line);
    }
  };

  const _initProcessNodes = (lines: any) => {
    const arrays = Object.values(lines);
    const _array = arrays.map((it: any) => {
      return it.children;
    });
    const mergedObject = _array.reduce((acc: any, currArray: any) => {
      currArray.forEach((item: any) => {
        const randomVal = Math.random() * 50; // 生成 0~50 的随机值
        const _delay = item.delay + randomVal

        acc[item.id] = { delay: Number(_delay.toFixed(2)), latency: 0, detect_target: item.detect_target };
      });
      return acc;
    }, {} as { [key: number]: { id: number; name: string } });
    return mergedObject;
    // result[node.id] = { latency: 0, detect_target: node.detect_target };
  };
  /**
   * x<150ms  green
   * x>150ms && x<300ms green
   * x>300ms && x<1000ms warning
   * x>1000ms && x<3000ms warning
   */
  const nodeChecking = ref(false);
  async function processNodes(
    data: LineData[]
  ): Promise<{ [key: string]: { delay: number; latency: number; detect_target: string } }> {
    nodeChecking.value = true;
    const detectTargetMap: { [key: string]: Promise<number> } = {};
    const result: {
      [key: string]: { delay: number; latency: number; detect_target: string };
    } = {};

    for (const group of data) {
      for (const node of group.children) {
        if (!detectTargetMap[node.detect_target]) {
          // 如果 detect_target 未被探测过，则进行异步探测
          detectTargetMap[node.detect_target] = newPingAddress(
            node.detect_target
          );
        }

        // 等待探测结果
        const _latency = await detectTargetMap[node.detect_target];

        const latency = _addRandomValue(_latency);
        const randomVal = Math.random() * 50; // 生成 0~50 的随机值
        const _delay = node.delay + randomVal
        result[node.id] = { delay: Number(_delay.toFixed(2)), latency, detect_target: node.detect_target };
      }
    }
    nodeChecking.value = false;
    return result;
  }

  const checkSpeed = async (list: any) => {
    const __d = await processNodes([list]);
    const _old = appStore.linesSpeedMap;
    appStore.setLinesSpeed({ ..._old, ...__d });
  };

  function _addRandomValue(val: number, rangeFraction: number = 0.5): number {
    const result = isNumber(val) ? val : Number(val);
    const range = result * rangeFraction;
    const randomValue = Math.random() * (2 * range) - range;
    const res = result + randomValue;
    return Number(res.toFixed(2));
  }

  const _setNewLinesData = (data: CountryData[]): any => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const newData = data
      .map((item, idx) => {
        const countries = Object.keys(item);
        if (countries.length === 0) {
          return null;
        }

        const country = countries[0];
        const countryItems = item[country];

        if (!Array.isArray(countryItems) || countryItems.length === 0) {
          return null;
        }

        const _first = { ...countryItems[0] };
        const _data: LineData = {
          label: country,
          checking: false,
          disabled: false,
          children: countryItems.map((child, index) => ({
            ...child,
            parentName: country,
            id: `${child.node_id}_${index}`,
            latency: 0,
            color: "red",
          })),
        };

        _data.children.unshift({
          ...defaultAutoLine,
          type: "auto",
          id: `auto_${idx}`,
          parentName: country,
          auto: true,
          latency: 0,
          node_id: _first.node_id,
          detect_target: _first.detect_target,
          traffic_key: _first.traffic_key,
          proxy_port: _first.proxy_port,
          region: _first.region,
        });

        return _data;
      })
      .filter(Boolean); // 过滤掉可能的 null 值

    return newData;
  };

  const _findFastestKey = (
    data: Record<string, { latency: number }>
  ): string => {
    const entries = Object.entries(data);
    if (!entries.length) return "";

    let minKey = entries[0][0] || "";
    let minLatency = entries[0][1].latency;

    entries.forEach(([key, { latency }]) => {
      if (key.includes('auto_') && latency < minLatency) {
        minLatency = latency;
        minKey = key;
      }
    });

    return minKey;
  };

  const _findNodeById = (data: any[], targetId: string) => {
    return data
      .flatMap((group) => group.children)
      .find((node) => node.id === targetId);
  };

  return {
    lineList,
    currentLine,
    getLines,
    setLine,
    processNodes,
    checkSpeed,
  };
}
