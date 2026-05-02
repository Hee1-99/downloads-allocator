$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$hostScript = Join-Path $repoRoot "native-host\subject-folder-downloader-host.py"
$outputDir = Join-Path $repoRoot "native-host\dist"
$workDir = Join-Path $repoRoot "native-host\build"
$specDir = Join-Path $repoRoot "native-host"
$exePath = Join-Path $outputDir "subject-folder-downloader-host.exe"

if (-not (Test-Path -LiteralPath $hostScript)) {
  throw "Native host source not found: $hostScript"
}

if (Test-Path -LiteralPath $outputDir) {
  Remove-Item -LiteralPath $outputDir -Recurse -Force
}

if (Test-Path -LiteralPath $workDir) {
  Remove-Item -LiteralPath $workDir -Recurse -Force
}

$arguments = @(
  "-3"
  "-m"
  "PyInstaller"
  "--noconfirm"
  "--clean"
  "--onefile"
  "--name"
  "subject-folder-downloader-host"
  "--distpath"
  $outputDir
  "--workpath"
  $workDir
  "--specpath"
  $specDir
  $hostScript
)

& py @arguments

if (-not (Test-Path -LiteralPath $exePath)) {
  throw "Native host executable was not created: $exePath"
}

Write-Host "Created $exePath"
