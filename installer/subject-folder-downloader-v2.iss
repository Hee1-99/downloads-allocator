#define AppName "ETL 강의자료 정리기"
#define AppVersion "0.3.6"
#define AppPublisher "Hee1-99"
#define ChromeStoreUrl "https://chromewebstore.google.com/"
#define ExtensionId "__REPLACE_WITH_CHROME_EXTENSION_ID__"
#define NativeHostName "com.subject_folder_downloader.host"
#define NativeHostManifestName "com.subject_folder_downloader.host.json"

[Setup]
AppId={{B7D9D2A1-6E5B-4C2B-AE61-8B0F5DA8A101}}
AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppName} {#AppVersion}
AppPublisher={#AppPublisher}
DefaultDirName={autopf}\{#AppName}
DefaultGroupName={#AppName}
OutputBaseFilename=subject-folder-downloader-setup
Compression=lzma
SolidCompression=yes
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
DisableProgramGroupPage=yes
DisableDirPage=no
UninstallDisplayIcon={app}\native-host\subject-folder-downloader-host.cmd

[Files]
Source: "..\native-host\subject-folder-downloader-host.py"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\subject-folder-downloader-host.cmd"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\README.md"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\install-native-host.ps1"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "installer\subject-folder-downloader-host.manifest.template.json"; DestDir: "{app}\native-host"; DestName: "{#NativeHostManifestName}"; Flags: ignoreversion

[Registry]
Root: HKCU; Subkey: "Software\Google\Chrome\NativeMessagingHosts\{#NativeHostName}"; ValueType: string; ValueName: ""; ValueData: "{app}\native-host\{#NativeHostManifestName}"; Flags: uninsdeletekey

[Icons]
Name: "{autoprograms}\{#AppName}"; Filename: "{cmd}"; Parameters: "/c start {#ChromeStoreUrl}"; WorkingDir: "{app}"
Name: "{autodesktop}\{#AppName}"; Filename: "{cmd}"; Parameters: "/c start {#ChromeStoreUrl}"; WorkingDir: "{app}"

[Run]
Filename: "{cmd}"; Parameters: "/c start {#ChromeStoreUrl}"; Flags: postinstall shellexec nowait

[Code]
procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    MsgBox('The native host was installed and registered. Next, install the Chrome Web Store extension using the listing opened by the installer.', mbInformation, MB_OK);
  end;
end;
