
param (
    [string[]]$Addresses
)

if (-not $Addresses) {
    # Write-Host "用法: .\ping_addresses.ps1 <地址1> <地址2> ... <地址N>"
    exit
}

foreach ($address in $Addresses) {
    # Write-Host "正在探测 $address ..."
    
    try {
        $ping = New-Object System.Net.NetworkInformation.Ping
        $reply = $ping.Send($address)
        
        if ($reply.Status -eq 'Success') {
            Write-Host "$address :_: $($reply.RoundtripTime) ms"
        } else {
            Write-Host "$address :_: 0 ms"
        }
    } catch {
        Write-Host "$address :_: 0 ms"
    }
}



# $address = "8.8.8.8"
# $result = Test-Connection -ComputerName $address -Count 4
# if ($result) {
#     $averageLatency = ($result | Measure-Object -Property ResponseTime -Average).Average
#     Write-Host "$address :_: $averageLatency ms"
# }