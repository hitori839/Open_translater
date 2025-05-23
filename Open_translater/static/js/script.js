function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = elementId === 'translatedText' ? element.innerText : element.value;

    navigator.clipboard.writeText(text).then(() => {
        alert("클립보드에 복사되었습니다!");
    }).catch(err => {
        console.error("복사 실패:", err);
    });
}

document.getElementById("text").addEventListener("input", function () {
    const text = this.value;
    const sourceLang = document.getElementById("sourceLang").value;
    const targetLang = document.getElementById("targetLang").value;
    document.getElementById("charCount").innerText = text.length + " / 1000";

    if (text.trim() !== "") {
        fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `text=${encodeURIComponent(text)}&source_lang=${sourceLang}&target_lang=${targetLang}&from_autosave=1`
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById("translatedText").innerText = data.translated_text;
        });
    } else {
        document.getElementById("translatedText").innerText = "";
    }
});

document.getElementById("translateButton").addEventListener("click", function () {
    const text = document.getElementById("text").value;
    const sourceLang = document.getElementById("sourceLang").value;
    const targetLang = document.getElementById("targetLang").value;

    if (text.trim() !== "") {
        fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `text=${encodeURIComponent(text)}&source_lang=${sourceLang}&target_lang=${targetLang}`
        })
        .then(res => res.json())
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

document.addEventListener("DOMContentLoaded", function () {
    const openBtn = document.getElementById("openHistory");
    const closeBtn = document.querySelector(".close");

    if (openBtn) {
        openBtn.addEventListener("click", () => {
            fetch("/history_json")
                .then(res => res.json())
                .then(data => {
                    const table = document.getElementById("historyTable");
                    table.innerHTML = "";
                    data.forEach(record => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${record.timestamp}</td>
                            <td>${record.source_text}</td>
                            <td>${record.translated_text}</td>
                            <td>${record.source_lang} → ${record.target_lang}</td>
                        `;
                        table.appendChild(row);
                    });
                    document.getElementById("historyModal").style.display = "block";
                });
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            document.getElementById("historyModal").style.display = "none";
        });
    }

    window.onclick = function (event) {
        if (event.target === document.getElementById("historyModal")) {
            document.getElementById("historyModal").style.display = "none";
        }
    };
});
