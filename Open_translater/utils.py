import os
from googletrans import Translator
from docx import Document
from PyPDF2 import PdfReader
from docx import Document as DocxDocument

translator = Translator()

def handle_uploaded_file(filepath, source_lang, target_lang, output_folder):
    filename = os.path.basename(filepath)
    name, ext = os.path.splitext(filename)
    ext = ext.lower()

    if ext == '.docx':
        doc = Document(filepath)
        text = "\n".join([p.text for p in doc.paragraphs])
    elif ext == '.pdf':
        reader = PdfReader(filepath)
        text = "\n".join([page.extract_text() for page in reader.pages])
    else:
        raise ValueError("지원하지 않는 파일 형식입니다.")

    translated = translator.translate(text, src=source_lang, dest=target_lang).text

    output_filename = f"{name}_translated.docx"
    output_path = os.path.join(output_folder, output_filename)

    new_doc = DocxDocument()
    for line in translated.split("\n"):
        new_doc.add_paragraph(line)
    new_doc.save(output_path)

    return translated, output_path
