from flask import Flask, render_template, request, jsonify, send_from_directory
from googletrans import Translator
from models import db, TranslationHistory
from utils import handle_uploaded_file
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///translations.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploaded'
app.config['TRANSLATED_FOLDER'] = 'translated'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['TRANSLATED_FOLDER'], exist_ok=True)

db.init_app(app)
translator = Translator()

SUPPORTED_LANGUAGES = {
    'ko': '한국어', 'en': '영어', 'ja': '일본어', 'zh-CN': '중국어(간체)',
    'zh-TW': '중국어(번체)', 'es': '스페인어', 'fr': '프랑스어',
    'de': '독일어', 'ru': '러시아어', 'vi': '베트남어', 'id': '인도네시아어', 'th': '태국어'
}

@app.route('/')
def index():
    return render_template('index.html', languages=SUPPORTED_LANGUAGES)

@app.route('/translate', methods=['POST'])
def translate():
    text = request.form['text']
    source_lang = request.form['source_lang']
    target_lang = request.form['target_lang']

    translated = translator.translate(text, src=source_lang, dest=target_lang)

    if not request.form.get('from_autosave'):
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
    })

@app.route('/upload_translate', methods=['POST'])
def upload_translate():
    file = request.files['file']
    source_lang = request.form['source_lang']
    target_lang = request.form['target_lang']

    saved_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(saved_path)

    translated_text, output_path = handle_uploaded_file(saved_path, source_lang, target_lang, app.config['TRANSLATED_FOLDER'])

    download_url = f'/download/{os.path.basename(output_path)}'  # 다운로드용 URL 생성

    return jsonify({
        'translated_text': translated_text,
        'download_url': download_url
    })

@app.route('/download/<filename>')
def download(filename):
    translated_folder = os.path.abspath(app.config['TRANSLATED_FOLDER'])
    return send_from_directory(translated_folder, filename, as_attachment=True)

@app.route('/history_json')
def history_json():
    records = TranslationHistory.query.order_by(TranslationHistory.timestamp.desc()).limit(10).all()
    result = [{
        "timestamp": r.timestamp.strftime('%Y-%m-%d %H:%M'),
        "source_text": r.source_text,
        "translated_text": r.translated_text,
        "source_lang": r.source_lang,
        "target_lang": r.target_lang
    } for r in records]
    return jsonify(result)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
