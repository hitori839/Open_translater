from flask import Flask, render_template, request, jsonify
from googletrans import Translator
from keywords import extract_keywords, get_explanations  # 상단에 추가
from flask_sqlalchemy import SQLAlchemy
from models import db, TranslationHistory  # 추가

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///translations.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


# 지원하는 언어 목록
SUPPORTED_LANGUAGES = {
    'ko': '한국어',
    'en': '영어',
    'ja': '일본어',
    'zh-CN': '중국어(간체)',
    'zh-TW': '중국어(번체)',
    'es': '스페인어',
    'fr': '프랑스어',
    'de': '독일어',
    'ru': '러시아어',
    'vi': '베트남어',
    'id': '인도네시아어',
    'th': '태국어'
}

# 번역기 객체 생성
translator = Translator()

@app.route('/')
def index():
    return render_template('index.html', languages=SUPPORTED_LANGUAGES)

@app.route('/translate', methods=['POST'])
def translate():
    text = request.form['text']
    source_lang = request.form['source_lang']
    target_lang = request.form['target_lang']

    # 번역
    translated = translator.translate(text, src=source_lang, dest=target_lang)

    # 핵심 단어 및 설명
    keywords = extract_keywords(text, lang=source_lang)
    explanations = get_explanations(keywords)

    # 📌 번역 기록 저장
    history = TranslationHistory(
        source_text=text,
        translated_text=translated.text,
        source_lang=source_lang,
        target_lang=target_lang
    )
    db.session.add(history)
    db.session.commit()

    return jsonify({
        'translated_text': translated.text,
        'keywords': keywords,
        'explanations': explanations
    })

    
@app.route('/history')
def history():
    records = TranslationHistory.query.order_by(TranslationHistory.timestamp.desc()).limit(10).all()
    return render_template('history.html', records=records)


with app.app_context():
    db.create_all()
if __name__ == '__main__':
    app.run(debug=True)
