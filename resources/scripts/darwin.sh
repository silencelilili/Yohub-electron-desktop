#!/bin/bash

# 检查是否提供了地址
if [ "$#" -eq 0 ]; then
    # echo "用法: $0 <地址1> <地址2> ... <地址N>"
    exit 1
fi

# 遍历所有传入的地址
for address in "$@"; do
    # 使用 ping 测量延迟
    # echo "正在探测 $address ..."
    # 获取延迟信息并提取平均延迟
    result=$(ping -c 2 "$address" | tail -n 1 | awk -F '/' '{print $5}')
    
    if [ -z "$result" ]; then
        # echo "{\"error\": \"无法测量延迟\"},"
        echo "$address:_:0"
    else
        echo "$address:_:$result"
        # echo "{\"host\": \"$address\", \"latency\": \"$result\"},"
    fi
done
