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
3. `v0.3.19` 같은 태그를 만듭니다.
4. 태그를 GitHub에 push 합니다.
5. GitHub Actions가 릴리즈 자산을 생성해 해당 릴리즈에 첨부합니다.

예시:

```powershell
git add .
git commit -m "chore: prepare release"
git tag v0.3.19
git push origin main
git push origin v0.3.19
```

## GitHub Actions 설정

Windows 설치 파일을 자동 빌드하려면 GitHub 저장소 Secret에 아래 값을 추가해야 합니다.

- `CHROME_EXTENSION_ID`: Chrome Web Store에 등록된 확장의 실제 ID

이 값이 없으면 ZIP 릴리즈는 만들어지지만, `subject-folder-downloader-setup.exe`는 빌드되지 않습니다.

## 배포 흐름

1. 사용자는 Chrome Web Store에서 확장을 먼저 설치합니다.
2. 확장 팝업에서 로컬 앱 설치 안내를 확인합니다.
3. GitHub Releases에서 로컬 앱 설치 파일을 받습니다.
4. 로컬 앱 설치 후 확장으로 돌아와 과목과 폴더를 등록합니다.
