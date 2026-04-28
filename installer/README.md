# 설치 도우미

이 디렉터리는 Windows용 로컬 앱 설치 파일을 만들기 위한 문서와 스크립트를 담고 있습니다.

## 목표

처음 설치를 최대한 한 번에 끝나게 만드는 것입니다.

## 설치 흐름

1. 사용자가 GitHub Releases에서 설치 파일을 다운로드합니다.
2. 설치 파일을 실행합니다.
3. 설치 프로그램이 native host 파일을 안정적인 위치에 복사합니다.
4. 설치 프로그램이 Windows 레지스트리에 native messaging host를 등록합니다.
5. 설치 프로그램이 Chrome Web Store 페이지를 엽니다.
6. 사용자는 확장을 추가하고 바로 사용을 시작합니다.

## 다음에 추가할 파일

- `installer/subject-folder-downloader.iss` Inno Setup 스크립트
- Windows CI에서 설치 파일을 빌드하는 workflow
- Chrome Web Store 등록 후 연결할 안내 문구

## 주의사항

- 로컬 앱은 Chrome Web Store에 올라가지 않습니다.
- 확장과 로컬 앱은 각각 다른 방식으로 설치됩니다.
