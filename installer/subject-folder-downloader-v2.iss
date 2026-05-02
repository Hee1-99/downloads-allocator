#ifndef AppName
  #define AppName "ETL Lecture Materials Organizer"
#endif

#ifndef AppVersion
  #define AppVersion "0.3.25"
#endif

#ifndef AppPublisher
  #define AppPublisher "Hee1-99"
#endif

#ifndef ChromeExtensionId
  #error ChromeExtensionId must be provided, for example /DChromeExtensionId=abcdefghijklmnopqrstuvwxyzabcdef
#endif

#define NativeHostName "com.subject_folder_downloader.host"

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
UninstallDisplayIcon={app}\native-host\subject-folder-downloader-host.exe

[Files]
Source: "..\native-host\dist\subject-folder-downloader-host.exe"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\README.md"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\install-native-host.ps1"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\disable-native-host.ps1"; DestDir: "{app}\native-host"; Flags: ignoreversion
Source: "..\native-host\enable-native-host.ps1"; DestDir: "{app}\native-host"; Flags: ignoreversion

[Registry]
Root: HKCU; Subkey: "Software\Google\Chrome\NativeMessagingHosts\{#NativeHostName}"; Flags: uninsdeletekey

[Icons]
Name: "{autoprograms}\{#AppName} README"; Filename: "{app}\native-host\README.md"

[Code]
function InstallNativeHost(): Boolean;
var
  ResultCode: Integer;
  PowerShellPath: string;
  ScriptPath: string;
  Parameters: string;
begin
  PowerShellPath := ExpandConstant('{sys}\WindowsPowerShell\v1.0\powershell.exe');
  ScriptPath := ExpandConstant('{app}\native-host\install-native-host.ps1');
  Parameters :=
    '-ExecutionPolicy Bypass -File "' + ScriptPath + '" ' +
    '-ExtensionId "{#ChromeExtensionId}"';

  Result := Exec(
    PowerShellPath,
    Parameters,
    '',
    SW_HIDE,
    ewWaitUntilTerminated,
    ResultCode
  ) and (ResultCode = 0);
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    if not InstallNativeHost() then
    begin
      RaiseException('Failed to register the native host for Chrome.');
    end;

    MsgBox(
      'The local app installation is complete.' + #13#10#13#10 +
      'Now return to the Chrome extension popup and continue setup there.',
      mbInformation,
      MB_OK
    );
  end;
end;
