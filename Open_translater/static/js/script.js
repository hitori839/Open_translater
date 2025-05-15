function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = elementId === 'translatedText' ? element.innerText : element.value;

    navigator.clipboard.writeText(text).then(() => {
        alert("클립보드에 복사되었습니다!");
    }).catch(err => {
        console.error("복사 실패:", err);
    });
}

document.getElementById("text").addEventListener("input", function() {
    const textArea = document.getElementById("text");
    const text = textArea.value;
    const sourceLang = document.getElementById("sourceLang").value;
    const targetLang = document.getElementById("targetLang").value;

    // 글자 수 표시
    const charCount = text.length;
    document.getElementById("charCount").innerText = charCount + " / 1000";

    if (text.trim() !== "") {
        fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'text=' + encodeURIComponent(text) +
                  '&source_lang=' + sourceLang +
                  '&target_lang=' + targetLang
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("translatedText").innerText = data.translated_text;
        });
    } else {
        document.getElementById("translatedText").innerText = "";
    }
});

document.getElementById("translateButton").addEventListener("click", function() {
    const text = document.getElementById("text").value;
    const sourceLang = document.getElementById("sourceLang").value;
    const targetLang = document.getElementById("targetLang").value;

    if (text.trim() !== "") {
        fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'text=' + encodeURIComponent(text) +
                  '&source_lang=' + sourceLang +
                  '&target_lang=' + targetLang
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("translatedText").innerText = data.translated_text;
            updateKeywords(data.keywords, data.explanations);
        });
    } else {
        document.getElementById("translatedText").innerText = "";
    }
});

function updateKeywords(keywords, explanations) {
    const keywordList = document.getElementById("keywordList");
    keywordList.innerHTML = "";
    keywords.forEach(word => {
        const li = document.createElement("li");
        li.textContent = `${word}: ${explanations[word]}`;
        keywordList.appendChild(li);
    });
}