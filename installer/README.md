# Windows 설치 파일 메모

이 디렉터리는 로컬 앱 설치 파일을 만들기 위한 Inno Setup 스크립트와 관련 자료를 담고 있습니다.

## 목표

사용자가 확장 팝업에서 설치 파일을 다운로드한 뒤 실행하면, 아래 작업이 한 번에 끝나도록 하는 것입니다.

- native host 파일 복사
- Chrome native messaging 등록
- 확장에서 바로 사용할 수 있는 상태 준비

## 핵심 파일

- `subject-folder-downloader-v2.iss`: 현재 사용 중인 설치 파일 스크립트
- `subject-folder-downloader.iss`: 이전 초안
- `subject-folder-downloader-host.manifest.template.json`: 참고용 초기 템플릿

## 빌드 조건

- Inno Setup 6
- Chrome Web Store 확장 ID `oknnfcnknnalckkpgjnbflmoiofhnffp`

## 비고

현재 사용자 설치 흐름은 `확장 먼저 설치 -> 확장 팝업에서 설치 파일 다운로드 -> 로컬 앱 설치`입니다.

또한 설치는 관리자 권한 없이 진행할 수 있도록 사용자 폴더(`%LOCALAPPDATA%\Programs`) 기준으로 설정되어 있습니다.
