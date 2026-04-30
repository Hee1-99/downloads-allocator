# GitHub 릴리즈 안내

이 저장소는 태그가 `v*` 형식으로 push되면 GitHub Actions가 배포 자산을 자동으로 만듭니다.

## 자동 생성되는 파일

- `subject-folder-downloader-extension.zip`
- `subject-folder-downloader-native-host.zip`
- `subject-folder-downloader-setup.exe`  
  `CHROME_EXTENSION_ID` GitHub Secret이 설정된 경우에만 생성

## 릴리즈 절차

1. 확장 버전을 올립니다.
2. 변경 사항을 커밋합니다.
3. `v0.3.20` 같은 태그를 만듭니다.
4. 태그를 GitHub에 push 합니다.
5. GitHub Actions가 릴리즈 자산을 생성해 해당 릴리즈에 첨부합니다.

예시:

```powershell
git add .
git commit -m "chore: prepare release"
git tag v0.3.20
git push origin main
git push origin v0.3.20
```

## Chrome Web Store 연결

현재 Windows 설치 파일 workflow에는 아래 Chrome Web Store 확장 ID가 이미 반영되어 있습니다.

- `oknnfcnknnalckkpgjnbflmoiofhnffp`

스토어 페이지:

- [Chrome Web Store - ETL 강의자료 정리기](https://chromewebstore.google.com/detail/oknnfcnknnalckkpgjnbflmoiofhnffp)

## 사용자 설치 흐름

1. 사용자는 Chrome Web Store에서 확장을 먼저 설치합니다.
2. 확장 팝업에서 `로컬 앱 설치 파일 다운로드` 버튼을 눌러 설치 파일을 받습니다.
3. 설치 파일 실행 후 확장으로 돌아와 과목과 폴더를 등록합니다.

GitHub Releases는 설치 파일이 실제로 배포되는 위치이며, 확장 팝업이 최신 `.exe` 다운로드 링크로 연결됩니다.
