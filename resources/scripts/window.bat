@echo off
setlocal enabledelayedexpansion

REM 检查是否提供了地址
if "%~1"=="" (
    echo 用法: %0 地址1 地址2 ... 地址N
    exit /b 1
)

REM 初始化 JSON 字符串
set jsonOutput={"addresses": [}

REM 遍历所有传入的地址
for %%A in (%*) do (
    echo 正在探测 %%A ...
    
    REM 使用 ping 测量延迟
    for /f "tokens=5" %%B in ('ping -n 1 %%A ^| find "时间="') do (
        set delay=%%B
        set delay=!delay:时间=!
        set delay=!delay:ms=!
        set jsonOutput=!jsonOutput!{"address": "%%A", "delay": !delay!}, 
    )
    
    REM 检查是否无法测量延迟
    if errorlevel 1 (
        set jsonOutput=!jsonOutput!{"address": "%%A", "error": "无法测量延迟"}, 
    )
)

REM 移除最后的逗号
set jsonOutput=!jsonOutput:~0,-2!

REM 结束 JSON 字符串
set jsonOutput=!jsonOutput!]}
echo !jsonOutput!

endlocal



@REM @echo off
@REM setlocal enabledelayedexpansion

@REM REM 检查是否提供了地址
@REM if "%~1"=="" (
@REM     echo 用法: %0 地址1 地址2 ... 地址N
@REM     exit /b 1
@REM )

@REM REM 遍历所有传入的地址
@REM for %%A in (%*) do (
@REM     echo 正在探测 %%A ...
    
@REM     REM 使用 ping 测量延迟
@REM     for /f "tokens=5" %%B in ('ping -n 4 %%A ^| find "平均 = "') do (
@REM         echo %%A: 平均延迟: %%B ms
@REM     )
    
@REM     REM 检查是否无法测量延迟
@REM     if errorlevel 1 (
@REM         echo %%A: 无法测量延迟
@REM     )
@REM )

@REM endlocal
