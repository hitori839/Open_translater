from flask import Flask, render_template, request, jsonify
from googletrans import Translator

app = Flask(__name__)

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

    # 번역 요청
    translated = translator.translate(text, src=source_lang, dest=target_lang)
    
    return jsonify({
        'translated_text': translated.text
    })

if __name__ == '__main__':
    app.run(debug=True)
