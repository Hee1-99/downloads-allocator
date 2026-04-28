# GitHub Release Process

This repository now includes a GitHub Actions workflow that packages the extension and native host whenever a tag matching `v*` is pushed.

## What gets published

- `subject-folder-downloader-extension.zip`
- `subject-folder-downloader-native-host.zip`

## How to publish a release

1. Update the version in the extension manifest.
2. Create and push a tag such as `v0.3.6`.
3. GitHub Actions will build the ZIP files and attach them to the release.

## Notes

- The Chrome extension is still distributed through the Chrome Web Store.
- The native host is distributed separately and must be installed on Windows for the folder picker and download mover to work.
- Users should install the extension and native host together for the full workflow.
