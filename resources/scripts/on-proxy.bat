@echo off
 
rem 设置代理服务器地址（格式IP:端口），可按实际自行修改, 端口：变量
set proxy_server="socks://127.0.0.1:10809"
 
rem 设置代理例外地址（IP或域名多条以;相隔,支持通配符*）其中如果包含<local>，则请勿将代理服务器用于本地地址选项将勾上 1.1.1.1;<local>
set proxy_exceptions="1.1.1.1;<local>"
 
rem 设置需要修改的注册表变量
set regpath="HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings"
 
rem 修改注册表对应的项从而修改代理服务器设置
:regedit
reg add %regpath% /v "ProxyEnable" /t  "REG_DWORD" /d 1 /f
 
reg add %regpath% /v "ProxyOverride" /t "REG_SZ" /d %proxy_exceptions% /f
 
reg add %regpath% /v "ProxyServer" /t "REG_SZ" /d %proxy_server% /f
 
pause