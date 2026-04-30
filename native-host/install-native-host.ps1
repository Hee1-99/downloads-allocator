param(
  [Parameter(Mandatory = $true)]
  [string] $ExtensionId
)

$ErrorActionPreference = "Stop"

$hostName = "com.subject_folder_downloader.host"
$hostDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$hostPath = Join-Path $hostDir "subject-folder-downloader-host.cmd"
$manifestPath = Join-Path $hostDir "$hostName.json"

if (-not (Test-Path -LiteralPath $hostPath)) {
  throw "Native host command not found: $hostPath"
}

$manifest = [ordered]@{
  name = $hostName
  description = "Subject Folder Downloader native host"
  path = $hostPath
  type = "stdio"
  allowed_origins = @("chrome-extension://$ExtensionId/")
}

$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

$registryPath = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\$hostName"
New-Item -Path $registryPath -Force | Out-Null
Set-Item -Path $registryPath -Value $manifestPath

Write-Host "Installed native host: $hostName"
Write-Host "Manifest: $manifestPath"
Write-Host "Allowed extension: chrome-extension://$ExtensionId/"
