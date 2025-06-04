# Open_translater


# 기본 설명 
Flask 기반 웹 애플리케이션으로, 텍스트 및 문서(DOCX, PDF)를 업로드하여 다국어 번역을 제공합니다.  
Google Translate API 기반으로 작동하며, 번역 결과를 실시간으로 확인하거나 HTML, DOCX 형태로 저장할 수 있습니다.

---

## 기본 세팅 명령어

아래 명령어를 순서대로 실행하여 가상환경 생성, 활성화 및 필요한 패키지를 설치하세요.

```bash
# 가상환경 생성
python -m venv venv

# 가상환경 활성화 (Linux/Mac)
source venv/bin/activate

# 가상환경 활성화 (Windows PowerShell)
venv\Scripts\activate

# 필요한 패키지 설치
pip install flask
pip install flask googletrans==4.0.0-rc1
pip install flask_sqlalchemy
pip install python-docx
pip install PyPDF2
pip install fpdf

## 📁 소스코드 소개
Open_translater/
├── app.py # Flask 서버 및 라우팅 설정
├── models.py # SQLAlchemy 모델 정의 (번역 기록 등)
├── utils.py # 파일 입출력 및 번역 로직
├── templates/
│ └── index.html # 사용자 인터페이스 템플릿 (Jinja2)
├── static/
│ ├── css/ # 스타일시트
│ ├── js/ # 클라이언트 스크립트
│ └── images/ # 정적 이미지 파일
├── uploaded/ # 업로드된 원본 문서 저장 디렉토리
├── Open_Translater.html # 번역 결과물 HTML (예시 출력)
├── index.html # 루트 페이지 연결 파일
├── test.docx # 샘플 테스트용 문서
├── .gitignore # Git 추적 제외 파일 설정
├── README.md # 사용자 및 개발자 문서
└── requirements.txt # Python 종속 패키지 명세


---

## User Guide

### 1. 실행 방법

#### 로컬에서 실행하기

```bash
git clone https://github.com/your-username/Open_Translater.git
cd Open_Translater
python -m venv venv
source venv/bin/activate       # Windows는 venv\Scripts\activate
pip install -r requirements.txt
python app.py

웹 브라우저에서 http://127.0.0.1:5000 접속


### 2. 텍스트 번역 사용법

홈페이지 메인 입력창에 번역할 텍스트를 입력

원본 언어와 번역 언어를 선택

"번역" 버튼 클릭

결과는 페이지 하단에 실시간 표시됨


### 3. 문서 번역 사용법

.docx 또는 .pdf 파일 업로드

언어 설정 후 "문서 번역" 버튼 클릭

번역 결과는 HTML로 표시되며 다운로드 가능 (HTML/DOCX)

4. 결과 저장/다운로드
번역된 문서는 Open_Translater.html 또는 .docx 파일로 저장 가능

파일 저장 경로: /uploaded/, /translated/


## Developer's Guide

### 주요 파일 설명

| 파일명          | 기능 요약                                    |
| ------------ | ---------------------------------------- |
| `app.py`     | Flask 라우팅, 사용자 요청 처리, 번역 엔진 연결           |
| `models.py`  | SQLAlchemy 기반 번역 기록 모델 정의                |
| `utils.py`   | Google Translate API 연결, 문서 파싱, 번역 결과 저장 |
| `templates/` | HTML 템플릿 렌더링 폴더                          |
| `static/`    | CSS, JS, 이미지 등 클라이언트 리소스 폴더              |
| `uploaded/`  | 사용자가 업로드한 파일 저장 경로                       |


### 번역 처리 흐름

1. 사용자 요청 수신 (/translate 또는 /upload_translate)

2. utils.py에서 Google Translate API로 번역

3. 번역 결과를 HTML 형태로 렌더링하거나 .docx로 변환

4. 사용자에게 결과 반환 및 저장


### 종속 패키지 (requirements.txt)

Flask
Flask-SQLAlchemy
googletrans==4.0.0-rc1
python-docx
PyPDF2
