# 로컬 앱(native host)

이 디렉터리에는 Chrome 확장과 통신하는 Windows 로컬 앱이 들어 있습니다.

주요 역할:

- 폴더 선택 창 열기
- 다운로드된 파일을 지정한 폴더로 이동
- 지정한 폴더 열기

## 수동 설치 방법

개발 중이거나 설치 파일 없이 직접 등록하고 싶다면 아래 순서로 진행합니다.

1. `chrome://extensions`를 엽니다.
2. 개발자 모드를 켭니다.
3. 확장 ID를 확인합니다.
4. 저장소 루트에서 아래 명령을 실행합니다.

```powershell
.\native-host\install-native-host.ps1 -ExtensionId "<extension-id>"
```

## 요구 사항

- Windows
- Python 3 (`py` 명령 사용 가능)
- Tkinter 포함 기본 Python 배포판

## 테스트용 스크립트

- `disable-native-host.ps1`: native host 등록을 잠시 비활성화
- `enable-native-host.ps1`: 비활성화한 등록을 다시 복구
