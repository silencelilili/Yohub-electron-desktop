#!/bin/bash

# 设置目标主机
HOST=$1

# 运行 ping 命令并解析结果
RESULT=$(ping -c 4 $HOST | tail -n 1 | awk -F '/' '{print $5}')

# 检查是否成功获取到延迟
if [[ -z "$RESULT" ]]; then
    echo "{\"error\": \"无法获取延迟\"}"
else
    # 输出 JSON 格式的结果
    echo "{\"host\": \"$HOST\", \"latency\": \"$RESULT ms\"}"
fi
