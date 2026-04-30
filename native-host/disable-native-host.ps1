$ErrorActionPreference = "Stop"

$hostKey = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.subject_folder_downloader.host"
$backupKey = "HKCU:\Software\SubjectFolderDownloader\TestBackup"

if (-not (Test-Path $hostKey)) {
  Write-Host "Native host is already disabled or not installed."
  exit 0
}

$manifestPath = (Get-ItemProperty -Path $hostKey)."(default)"

if (-not (Test-Path $backupKey)) {
  New-Item -Path $backupKey -Force | Out-Null
}

Set-ItemProperty -Path $backupKey -Name ManifestPath -Value $manifestPath
Remove-Item -Path $hostKey -Recurse -Force

Write-Host "Native host disabled for testing."
Write-Host "Reload the extension in chrome://extensions before testing."
