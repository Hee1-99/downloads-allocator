#ifndef AppName
  #define AppName "ETL Lecture Materials Organizer"
#endif

#ifndef AppVersion
  #define AppVersion "0.3.24"
#endif

#ifndef AppPublisher
  #define AppPublisher "Hee1-99"
#endif

#ifndef ChromeExtensionId
  #error ChromeExtensionId must be provided, for example /DChromeExtensionId=abcdefghijklmnopqrstuvwxyzabcdef
#endif

#define NativeHostName "com.subject_folder_downloader.host"
#define NativeHostManifestName "com.subject_folder_downloader.host.json"

[Setup]
AppId={{B7D9D2A1-6E5B-4C2B-AE61-8B0F5DA8A101}}
AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppName} {#AppVersion}
AppPublisher={#AppPublisher}
DefaultDirName={localappdata}\Programs\{#AppName}
DefaultGroupName={#AppName}
OutputDir=Output
OutputBaseFilename=subject-folder-downloader-setup
Compression=lzma
SolidCompression=yes
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
DisableProgramGroupPage=yes
DisableDirPage=no
PrivilegesRequired=lowest
UninstallDisplayIcon={app}\native-host\subject-folder-downloader-host.cmd

[Files]
Source: "..\native-host\subject-folder-downloader-host.py"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\subject-folder-downloader-host.cmd"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\README.md"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\install-native-host.ps1"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\disable-native-host.ps1"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\enable-native-host.ps1"; DestDir: "{app}\native-host"; Flags: ignoreversion

[Registry]
Root: HKCU; Subkey: "Software\Google\Chrome\NativeMessagingHosts\{#NativeHostName}"; ValueType: string; ValueName: ""; ValueData: "{app}\native-host\{#NativeHostManifestName}"; Flags: uninsdeletekey

[Icons]
Name: "{autoprograms}\{#AppName} README"; Filename: "{app}\native-host\README.md"

[Code]
function EscapeJson(const Value: string): string;
begin
  Result := Value;
  StringChangeEx(Result, '\', '\\', True);
  StringChangeEx(Result, '"', '\"', True);
end;

procedure WriteNativeHostManifest();
var
  ManifestPath: string;
  HostPath: string;
  ManifestJson: string;
begin
  ManifestPath := ExpandConstant('{app}\native-host\{#NativeHostManifestName}');
  HostPath := ExpandConstant('{app}\native-host\subject-folder-downloader-host.cmd');
  ManifestJson :=
    '{'#13#10 +
    '  "name": "{#NativeHostName}",'#13#10 +
    '  "description": "ETL Lecture Materials Organizer native messaging host",'#13#10 +
    '  "path": "' + EscapeJson(HostPath) + '",'#13#10 +
    '  "type": "stdio",'#13#10 +
    '  "allowed_origins": ['#13#10 +
    '    "chrome-extension://{#ChromeExtensionId}/"'#13#10 +
    '  ]'#13#10 +
    '}'#13#10;

  if not SaveStringToUTF8File(ManifestPath, ManifestJson, False) then
  begin
    RaiseException('Failed to write native host manifest: ' + ManifestPath);
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    WriteNativeHostManifest();
    MsgBox(
      'The local app installation is complete.' + #13#10#13#10 +
      'Now return to the Chrome extension popup and continue setup there.',
      mbInformation,
      MB_OK
    );
  end;
end;
