from collections import Counter
import re

# 임시 설명 데이터
EXPLANATION_DICT = {
    'translation': 'translation: the process of changing words from one language to another.',
    'language': 'language: a system of communication used by a particular country or community.',
    '텍스트': '텍스트: 문자로 이루어진 자료.',
    '번역': '번역: 한 언어로 된 글을 다른 언어로 옮기는 것.',
    # 필요에 따라 계속 추가 가능
}

def extract_keywords(text, lang='en', top_n=3):
    words = re.findall(r'\b\w+\b', text.lower())
    most_common = Counter(words).most_common(top_n)
    return [word for word, _ in most_common]

def get_explanations(keywords):
    return {kw: EXPLANATION_DICT.get(kw, '설명이 등록되지 않았습니다.') for kw in keywords}