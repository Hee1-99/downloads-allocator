# ETL 강의자료 정리기

ETL 강의자료 정리기는 과목 페이지에서 다운로드한 파일을 과목별 폴더로 자동 정리해 주는 Chrome 확장과 Windows 로컬 앱으로 구성된 도구입니다.

## 바로 설치하기

1. GitHub Releases에서 Windows 설치 파일을 내려받습니다.
2. 설치 파일을 실행합니다.
3. 설치가 끝나면 Chrome Web Store 페이지가 열립니다.
4. Chrome Web Store에서 확장을 추가합니다.
5. 확장 팝업에서 과목명, 과목 URL, `지정할 폴더`를 등록합니다.

### 다운로드 링크

- [GitHub Releases](https://github.com/Hee1-99/downloads-allocator/releases)
- Chrome Web Store 링크는 배포 완료 후 이 위치에 추가됩니다.

## 동작 방식

1. Chrome 확장이 과목 페이지 URL과 과목명을 저장합니다.
2. 다운로드는 먼저 `Downloads/_강의자료/과목명` 아래로 저장됩니다.
3. 로컬 앱(native host)이 다운로드 완료를 감지합니다.
4. 파일은 사용자가 지정한 폴더로 이동합니다.
5. 다운로드 기록은 자동으로 비워집니다.

## 필요한 것

- Google Chrome
- Windows 10 이상
- GitHub Releases에서 받은 Windows 설치 파일
- Chrome Web Store에 게시된 확장

## 주의사항

- `Downloads` 안의 `_강의자료` 폴더는 삭제하지 마세요.
- 확장만 설치하면 파일 이동은 동작하지 않습니다. 로컬 앱도 함께 설치해야 합니다.
- 로컬 앱은 Windows에서만 동작합니다.

## 문의

새로운 아이디어나 제안이 있으면 아래로 보내 주세요.

- `businessonhwa@gmail.com`

## 후원

이 프로젝트가 도움이 됐다면 아래 계좌로 후원해 주셔도 됩니다.

- 토스뱅크 `1000-6901-3070`
