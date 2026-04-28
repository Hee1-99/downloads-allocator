$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$extensionDir = Join-Path $repoRoot 'extensions/subject-folder-downloader'
$zipPath = Join-Path $repoRoot 'subject-folder-downloader-extension.zip'

if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}

$files = @(
  'manifest.json',
  'popup.html',
  'popup.js',
  'background.js'
) | ForEach-Object { Join-Path $extensionDir $_ }

Compress-Archive -Path $files -DestinationPath $zipPath
Write-Host "Created $zipPath"
