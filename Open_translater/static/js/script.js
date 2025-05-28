let uploadedFile = null;
let translatedFileUrl = null;

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = elementId === 'translatedText' ? element.innerText : element.value;

    navigator.clipboard.writeText(text).then(() => {
        alert("클립보드에 복사되었습니다!");
    }).catch(err => {
        console.error("복사 실패:", err);
    });
}

document.getElementById("fileInput").addEventListener("change", function () {
    uploadedFile = this.files[0];
    document.getElementById("fileNameDisplay").innerText = uploadedFile.name;
});

document.getElementById("translateButton").addEventListener("click", function () {
    const sourceLang = document.getElementById("sourceLang").value;
    const targetLang = document.getElementById("targetLang").value;

    if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('source_lang', sourceLang);
        formData.append('target_lang', targetLang);

        fetch('/upload_translate', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById("translatedText").innerText = data.translated_text;
            translatedFileUrl = data.download_url;
        });
    } else {
        const text = document.getElementById("text").value;
        fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `text=${encodeURIComponent(text)}&source_lang=${sourceLang}&target_lang=${targetLang}`
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById("translatedText").innerText = data.translated_text;
            translatedFileUrl = null;
        });
    }
});

document.querySelector(".output-btn").addEventListener("click", function () {
    if (translatedFileUrl) {
        const link = document.createElement("a");
        link.href = translatedFileUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("파일을 첨부하고 번역한 경우에만 다운로드할 수 있습니다.");
    }
});

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

    // 🔻 실시간 번역
    let typingTimer;
    const doneTypingInterval = 1000;
    const textInput = document.getElementById("text");

    textInput.addEventListener("input", function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            if (!textInput.value.trim()) {
                document.getElementById("translatedText").innerText = "";
                return;
            }

            const sourceLang = document.getElementById("sourceLang").value;
            const targetLang = document.getElementById("targetLang").value;
            const text = textInput.value;

            fetch('/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `text=${encodeURIComponent(text)}&source_lang=${sourceLang}&target_lang=${targetLang}&from_autosave=true`
            })
            .then(res => res.json())
            .then(data => {
                document.getElementById("translatedText").innerText = data.translated_text;
            });
        }, doneTypingInterval);
    });
});
