$ErrorActionPreference = "Stop"

$hostKey = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.subject_folder_downloader.host"
$backupKey = "HKCU:\Software\SubjectFolderDownloader\TestBackup"

if (Test-Path $hostKey) {
  Write-Host "Native host is already enabled."
  exit 0
}

if (-not (Test-Path $backupKey)) {
  throw "No backup manifest path was found. Run disable-native-host.ps1 first or reinstall the native host."
}

$manifestPath = (Get-ItemProperty -Path $backupKey).ManifestPath
if (-not $manifestPath) {
  throw "Backup manifest path is empty. Reinstall the native host."
}

New-Item -Path $hostKey -Force | Out-Null
Set-ItemProperty -Path $hostKey -Name "(default)" -Value $manifestPath

Write-Host "Native host enabled again."
Write-Host "Reload the extension in chrome://extensions before testing."
