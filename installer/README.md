# Windows 설치기 개요

이 폴더에는 Windows용 로컬 앱 설치기 관련 파일이 들어 있습니다.

## 현재 배포 방식

- `subject-folder-downloader-v2.iss`: 현재 릴리즈용 Inno Setup 스크립트
- `../build-native-host.ps1`: Python 소스를 단일 exe로 빌드하는 스크립트

배포용 설치기는 먼저 native host 실행 파일을 만들고, 그 다음 Inno Setup으로 설치 파일을 생성합니다.

## 설치기 역할

- `subject-folder-downloader-host.exe`를 `%LOCALAPPDATA%\Programs\ETL Lecture Materials Organizer\native-host`에 설치
- Chrome native messaging manifest 작성
- 현재 사용자 레지스트리에 native host 등록
- 설치 완료 후 확장 팝업으로 돌아가도록 안내

## 참고

이제 공개 배포용 로컬 앱은 Python 없이 동작합니다.
