# ETL 강의자료 정리기

ETL 강의자료 정리기는 강의 페이지에서 다운로드한 파일을 과목별로 정리하고, 사용자가 지정한 폴더로 자동 이동해 주는 Chrome 확장 + Windows 로컬 앱 조합입니다.

## 설치 방법

### 1. Chrome Web Store에서 확장 설치

먼저 확장을 설치합니다.

- [Chrome Web Store - ETL 강의자료 정리기](https://chromewebstore.google.com/detail/oknnfcnknnalckkpgjnbflmoiofhnffp)

설치 후 확장 팝업을 열면, 로컬 앱이 아직 없을 경우 설치 안내가 표시됩니다.

### 2. 확장 팝업에서 로컬 앱 설치 파일 다운로드

팝업의 `로컬 앱 설치 파일 다운로드` 버튼을 누르면 최신 Windows 설치 파일(`subject-folder-downloader-setup.exe`)이 다운로드됩니다.

다운로드한 설치 파일을 실행하면 로컬 앱이 등록됩니다.

### 3. 확장에서 과목 등록

설치가 끝난 뒤 확장 팝업을 다시 열고 아래 정보를 저장합니다.

- 과목명
- 과목 URL
- 지정할 폴더

이후 해당 과목 페이지에서 다운로드한 파일은 먼저 `Downloads/_강의자료/과목명` 아래에 저장된 뒤, 자동으로 지정한 폴더로 이동합니다.

## 동작 방식

1. 사용자가 과목 페이지 URL과 과목명을 연결합니다.
2. Chrome 다운로드는 먼저 `Downloads/_강의자료/과목명/파일명`으로 저장됩니다.
3. 로컬 앱이 다운로드 완료를 감지합니다.
4. 파일을 사용자가 지정한 폴더로 이동합니다.
5. 이동 완료 후 원래 페이지에 확인 팝업을 보여줍니다.

## GitHub Releases

GitHub Releases는 로컬 앱 설치 파일의 직접 다운로드 경로이자, 수동 설치가 필요할 때 사용하는 배포처입니다.

- [GitHub Releases](https://github.com/Hee1-99/downloads-allocator/releases)

## 요구 사항

- Google Chrome
- Windows 10 이상
- Python 3 (`py` 실행 가능)

## 주의 사항

- `Downloads/_강의자료` 폴더는 삭제하지 마세요.
- 확장만 설치하면 자동 이동 기능은 동작하지 않습니다. 팝업에서 로컬 앱 설치 파일을 받아 설치해야 합니다.
- 로컬 앱은 Windows 환경에서만 동작합니다.

## 문의

새로운 아이디어나 제안은 아래 메일로 보내 주세요.

- `businessonhwa@gmail.com`

## 후원

도움이 되었다면 아래 계좌로 후원해 주셔도 됩니다.

- 토스뱅크 `1000-6901-3070`
