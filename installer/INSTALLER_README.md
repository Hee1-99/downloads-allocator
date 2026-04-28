# Installer README

This installer script is parameterized for release builds.

## Required build input

- `CHROME_EXTENSION_ID`

The installer must know the Chrome Web Store extension ID so it can register the native messaging host correctly.

## What the installer does

- Copies the native host files into `Program Files`.
- Registers the native messaging host in the Windows registry.
- Opens the Chrome Web Store listing for the extension.
- Tells the user to install the extension after the native host is in place.

## Files

- `subject-folder-downloader-v2.iss` is the release-ready Inno Setup script.
- `subject-folder-downloader-host.manifest.template.json` is the template used by the installer.

## Release reminder

Before shipping a release, replace the placeholder extension ID with the actual Chrome Web Store item ID.
