# Windows installer plan

The repository will keep two user-facing deliverables:

1. Chrome extension published through the Chrome Web Store.
2. Native host packaged as a Windows installer for one-click setup.

## Target user flow

1. User downloads the native host installer from GitHub Releases.
2. User runs the installer.
3. The installer registers the native messaging host for Chrome and places the files in a stable location.
4. The installer opens the Chrome Web Store listing for the extension.
5. User installs the extension with one click.
6. The extension and native host work together for folder selection and file relocation.

## Why this split exists

Chrome Web Store handles the extension.
The native host is a separate local application and must be installed separately.

## Release artifacts

- `subject-folder-downloader-extension.zip`
- `subject-folder-downloader-native-host.zip`
- `subject-folder-downloader-setup.exe` in the future, once the installer is implemented

## Next implementation step

Build the Windows installer so the native host can be installed with a single download and launch.
