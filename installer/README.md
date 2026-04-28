# Installer

This directory will hold the Windows installer for the native host.

## Goal

Make the first-time setup feel as close to one click as possible.

## Intended flow

1. User downloads the installer from GitHub Releases.
2. User runs the installer.
3. The installer copies the native host files to a stable local location.
4. The installer registers the native messaging host in the Windows registry.
5. The installer opens the Chrome Web Store listing for the extension.
6. The user installs the extension and starts using the full workflow.

## Files to add next

- `installer/subject-folder-downloader.iss` for Inno Setup packaging.
- A Windows CI workflow that builds the installer artifact.
- A release note that links the installer and the extension listing.
