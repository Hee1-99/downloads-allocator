# ETL 강의자료 정리기 로컬 앱

이 폴더에는 Chrome 확장과 통신하는 Windows native host가 들어 있습니다.

기본 설치 흐름은 다음과 같습니다.

1. Chrome Web Store에서 확장을 설치합니다.
2. 확장 팝업에서 `로컬 앱 설치 파일 다운로드` 버튼을 눌러 `subject-folder-downloader-setup.exe`를 받습니다.
3. 설치 파일을 실행하면 로컬 앱이 자동으로 등록됩니다.

## 포함 파일

- `subject-folder-downloader-host.py`: 개발용 원본 소스
- `dist/subject-folder-downloader-host.exe`: 배포용 단일 실행 파일
- `install-native-host.ps1`: 수동 등록 스크립트
- `disable-native-host.ps1`: 테스트용 비활성화 스크립트
- `enable-native-host.ps1`: 테스트용 재활성화 스크립트

## 수동 등록

설치 파일 없이 수동으로 등록하려면 아래처럼 실행합니다.

```powershell
.\native-host\install-native-host.ps1 -ExtensionId "oknnfcnknnalckkpgjnbflmoiofhnffp"
```

## 요구 사항

- Windows
- Google Chrome

배포용 실행 파일에는 Python이 필요하지 않습니다.
