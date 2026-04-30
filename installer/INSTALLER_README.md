# Installer README

This installer setup is intended for GitHub Release builds.

## Required build input

- `CHROME_EXTENSION_ID`

The installer needs the real Chrome Web Store extension ID so it can register the native messaging host for the published extension.

## What the installer does

- Copies the native host files into `%LOCALAPPDATA%\Programs\ETL Lecture Materials Organizer`
- Writes the native host manifest with the published extension ID
- Registers the native messaging host in the current user's Windows registry
- Tells the user to return to the extension popup after install

## Files

- `subject-folder-downloader-v2.iss`: current Inno Setup script used for release builds
- `subject-folder-downloader.iss`: older draft script kept for reference

## Release note

The Windows installer workflow only succeeds after `CHROME_EXTENSION_ID` is added to the repository secrets.
