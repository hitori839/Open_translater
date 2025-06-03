# Open_translater

## 기본 세팅 명령어

아래 명령어를 순서대로 실행하여 가상환경 생성, 활성화 및 필요한 패키지를 설치하세요.

```bash
# 가상환경 생성
python -m venv venv

# 가상환경 활성화 (Linux/Mac)
source venv/bin/activate

# 가상환경 활성화 (Windows PowerShell)
source venv/Scripts/activate

# 필요한 패키지 설치
pip install flask
pip install flask googletrans==4.0.0-rc1
pip install flask_sqlalchemy
pip install python-docx
pip install PyPDF2