#define AppName "ETL 강의자료 정리기"
#define AppVersion "0.3.6"
#define AppPublisher "Hee1-99"
#define AppExeName "SubjectFolderDownloaderInstaller"
#define NativeHostName "com.subject_folder_downloader.host"

[Setup]
AppId={{B7D9D2A1-6E5B-4C2B-AE61-8B0F5DA8A101}
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

[Files]
Source: "..\native-host\subject-folder-downloader-host.py"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\subject-folder-downloader-host.cmd"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\README.md"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\install-native-host.ps1"; DestDir: "{app}\native-host"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\{#AppName}"; Filename: "{cmd}"; Parameters: "/c start https://chromewebstore.google.com/"; WorkingDir: "{app}"

[Run]
Filename: "{cmd}"; Parameters: "/c start https://chromewebstore.google.com/"; Flags: postinstall shellexec nowait

[Code]
procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    MsgBox('The native host files were installed. Next, install the Chrome Web Store extension.', mbInformation, MB_OK);
  end;
end;
