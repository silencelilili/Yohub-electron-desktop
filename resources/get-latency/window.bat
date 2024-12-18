@echo off
setlocal enabledelayedexpansion

rem 设置目标地址
set "target=8.8.8.8"

rem 执行 ping 命令并将结果保存到临时文件
ping -n 4 %target% > ping_result.txt

rem 初始化 JSON 结果
set "jsonResult={"

rem 解析 ping 结果
for /f "tokens=*" %%i in (ping_result.txt) do (
    echo %%i | find "时间=" >nul
    if !errorlevel! == 0 (
        for /f "tokens=2 delims==" %%j in ('echo %%i ^| findstr /r "时间=[0-9]*ms"') do (
            set "latency=%%j"
            set "latency=!latency:时间=!"
            set "latency=!latency:ms=!"
            set "jsonResult=!jsonResult!\"latency\": \"!latency!\", "
        )
    )
)

rem 去掉最后的逗号和空格
set "jsonResult=!jsonResult:~0,-2!"

rem 结束 JSON 对象
set "jsonResult=!jsonResult!}"

rem 输出 JSON
echo !jsonResult!

rem 清理临时文件
del ping_result.txt

endlocal
