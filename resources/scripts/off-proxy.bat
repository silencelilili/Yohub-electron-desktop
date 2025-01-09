@echo off
rem 设置需要修改的注册表变量
set regpath="HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings"
 
reg add %regpath% /v "ProxyEnable" /t  "REG_DWORD" /d 0 /f
 
reg add %regpath% /v "ProxyOverride" /t "REG_SZ" /d "" /f
 
reg add %regpath% /v "ProxyServer" /t "REG_SZ" /d "" /f
 
pause