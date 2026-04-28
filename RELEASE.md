# GitHub 릴리스 안내

이 저장소는 태그가 `v*` 형식으로 올라오면 GitHub Actions가 배포 파일을 자동으로 만듭니다.

## 배포되는 파일

- `subject-folder-downloader-extension.zip`
- `subject-folder-downloader-native-host.zip`

## 릴리스 올리는 방법

1. 확장 manifest의 버전을 올립니다.
2. `v0.3.6` 같은 태그를 만듭니다.
3. 태그를 GitHub에 push 합니다.
4. GitHub Actions가 ZIP 파일을 만들고 Release에 첨부합니다.

## 배포 설명

- Chrome 확장은 Chrome Web Store에서 설치합니다.
- 로컬 앱은 별도 설치가 필요합니다.
- 로컬 앱이 설치되어야 폴더 선택과 파일 이동이 동작합니다.

## 사용자 안내 문구 예시

- Chrome Web Store에서 확장 설치
- GitHub Releases에서 Windows 설치 파일 다운로드
- 설치 후 로컬 앱 자동 등록
- 확장 실행 후 과목별 폴더 지정
