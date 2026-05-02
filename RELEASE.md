# GitHub 릴리즈 가이드

`v*` 태그를 push하면 GitHub Actions가 배포 파일을 자동으로 생성합니다.

## 생성되는 파일

- `subject-folder-downloader-extension.zip`
- `subject-folder-downloader-native-host.zip`
- `subject-folder-downloader-setup.exe`

## 배포 흐름

1. 변경사항을 커밋합니다.
2. 버전을 올립니다.
3. 새 태그를 만듭니다.
4. `main`과 태그를 GitHub에 push합니다.
5. GitHub Actions가 릴리즈 파일을 자동으로 첨부합니다.

예시:

```powershell
git add .
git commit -m "chore: prepare release"
git tag v0.3.26
git push origin main
git push origin v0.3.26
```

## Chrome Web Store

현재 Chrome Web Store 확장 ID:

- `oknnfcnknnalckkpgjnbflmoiofhnffp`

스토어 링크:

- [Chrome Web Store - ETL 강의자료 정리기](https://chromewebstore.google.com/detail/oknnfcnknnalckkpgjnbflmoiofhnffp)

## 사용자 설치 흐름

1. 사용자가 Chrome Web Store에서 확장을 설치합니다.
2. 확장 팝업에서 `로컬 앱 설치 파일 다운로드` 버튼을 누릅니다.
3. `subject-folder-downloader-setup.exe`를 실행합니다.
4. 설치가 끝나면 확장 팝업으로 돌아와 설정을 이어갑니다.

`subject-folder-downloader-native-host.zip`은 수동 설치나 문제 해결용 보조 자산입니다.
