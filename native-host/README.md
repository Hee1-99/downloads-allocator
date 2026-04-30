# Native Host

This host lets the Chrome extension open a Windows folder picker and receive the selected absolute path.

## Install

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Copy the extension ID for Subject Folder Downloader.
4. Run PowerShell from the repository root:

```powershell
.\native-host\install-native-host.ps1 -ExtensionId "<extension-id>"
```

The installer writes a native messaging manifest under `native-host` and registers it for the current Windows user.

## Requirements

- Python launcher `py` with Python 3
- Tkinter, included with standard Python for Windows
