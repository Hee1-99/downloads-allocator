# Installer README

This installer setup is intended for GitHub Release builds.

## Required build input

- `CHROME_EXTENSION_ID` = `oknnfcnknnalckkpgjnbflmoiofhnffp`

The installer needs the real Chrome Web Store extension ID so it can register the native messaging host for the published extension.

## Build flow

1. Build `subject-folder-downloader-host.exe` from `native-host/subject-folder-downloader-host.py`
2. Package the exe with Inno Setup
3. Register the published extension ID in the generated native host manifest

## What the installer does

- Copies `subject-folder-downloader-host.exe` into `%LOCALAPPDATA%\Programs\ETL Lecture Materials Organizer\native-host`
- Writes the native host manifest with the published extension ID
- Registers the native messaging host in the current user's Windows registry
- Tells the user to return to the extension popup after install

## Files

- `subject-folder-downloader-v2.iss`: current Inno Setup script used for release builds
- `../build-native-host.ps1`: local build script for the standalone native host exe

## Release note

The Windows installer workflow already includes the published Chrome extension ID, so release builds can attach the installer without an extra repository secret.
