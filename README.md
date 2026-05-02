# ETL 강의자료 정리기

ETL 강의자료 정리기는 강의 페이지에서 받은 파일을 과목별로 정리하고, 사용자가 지정한 폴더로 자동 이동해 주는 Chrome 확장 프로그램입니다.

## 설치 방법

### 1. Chrome Web Store에서 확장 설치

아래 링크에서 확장을 설치합니다.

- [Chrome Web Store - ETL 강의자료 정리기](https://chromewebstore.google.com/detail/oknnfcnknnalckkpgjnbflmoiofhnffp)

확장을 설치한 뒤 팝업을 열면, 로컬 앱이 아직 없을 경우 설치 안내가 먼저 표시됩니다.

### 2. 팝업에서 로컬 앱 설치 파일 다운로드

팝업의 `로컬 앱 설치 파일 다운로드` 버튼을 누르면 최신 Windows 설치 파일(`subject-folder-downloader-setup.exe`)이 다운로드됩니다.

설치 파일에는 로컬 앱이 단일 실행 파일 형태로 포함되어 있어서 Python을 따로 설치할 필요가 없습니다.

### 3. 과목 페이지와 저장 폴더 등록

확장 팝업에서 아래 값을 한 번만 저장하면 됩니다.

- 과목명
- 과목 URL
- 지정할 폴더

그 뒤부터는 해당 과목 페이지에서 다운로드한 파일이 먼저 `Downloads/_강의자료/과목명` 아래에 저장되고, 곧바로 지정한 폴더로 자동 이동합니다.

## 사용 흐름

1. 과목 페이지 URL과 과목명을 연결합니다.
2. Chrome 다운로드가 먼저 `Downloads/_강의자료/과목명` 아래에 파일을 저장합니다.
3. 로컬 앱이 파일을 사용자가 지정한 폴더로 이동합니다.
4. 이동이 끝나면 원래 페이지에서 확인 안내가 표시됩니다.

## GitHub Releases

GitHub Releases는 설치 파일의 실제 배포 위치입니다. 확장 팝업 버튼도 이 릴리즈의 최신 설치 파일을 가리킵니다.

- [GitHub Releases](https://github.com/Hee1-99/downloads-allocator/releases)

## 준비 사항

- Google Chrome
- Windows 10 이상

## 참고 사항

- `Downloads/_강의자료` 폴더는 삭제하지 마세요.
- 설치가 끝난 뒤에는 확장 팝업을 다시 열면 바로 설정을 이어갈 수 있습니다.
- 현재 로컬 앱은 Windows 환경에서 동작합니다.

## 문의

버그 제보나 기능 제안은 아래 메일로 보내주세요.

- `businessonhwa@gmail.com`
