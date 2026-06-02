if (!document.getElementById("netacad-gemini-solve-btn")) {
    // Inject the Floating Button
    const btn = document.createElement("button");
    btn.id = "netacad-gemini-solve-btn";
    btn.innerHTML = "🧠 Solve";
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999999;
        background: #1976d2;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 50px;
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        transition: transform 0.2s, background 0.2s;
    `;

    btn.onmouseover = () => btn.style.transform = "scale(1.05)";
    btn.onmouseout = () => btn.style.transform = "scale(1)";

    document.body.appendChild(btn);

    // Create Answer Container (Hidden initially)
    const answerBox = document.createElement("div");
    answerBox.id = "netacad-gemini-answer-box";
    answerBox.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        z-index: 999999;
        background: #e8f5e9;
        border: 2px solid #4caf50;
        padding: 20px;
        border-radius: 12px;
        font-family: Arial, sans-serif;
        font-size: 16px;
        color: #2e7d32;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        max-width: 400px;
        display: none;
        line-height: 1.5;
    `;
    document.body.appendChild(answerBox);

    // Handle Button Click
    btn.addEventListener("click", () => {
        btn.innerHTML = "⏳ Processing...";
        btn.disabled = true;
        btn.style.background = "#757575";
        answerBox.style.display = "none";

        chrome.runtime.sendMessage({ action: "captureAndSolve" }, (response) => {
            btn.innerHTML = "🧠 Solve";
            btn.disabled = false;
            btn.style.background = "#1976d2";

            if (chrome.runtime.lastError) {
                showAnswer(`❌ Error: ${chrome.runtime.lastError.message}`, true);
                return;
            }

            if (response && response.error) {
                showAnswer(`❌ Error: ${response.error}`, true);
            } else if (response && response.answer) {
                const formattedAnswer = response.answer.replace(/\n/g, '<br>');
                showAnswer(`✅ <strong>Correct Option(s):</strong><br><br>${formattedAnswer}`);
            } else {
                showAnswer(`❌ Unknown error occurred.`, true);
            }
        });
    });

    function showAnswer(htmlContent, isError = false) {
        answerBox.innerHTML = htmlContent;
        answerBox.style.display = "block";
        if (isError) {
            answerBox.style.background = "#ffebee";
            answerBox.style.border = "2px solid #ef5350";
            answerBox.style.color = "#c62828";
        } else {
            answerBox.style.background = "#e8f5e9";
            answerBox.style.border = "2px solid #4caf50";
            answerBox.style.color = "#2e7d32";
        }
        
        // Add a close button
        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = "✖";
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            font-size: 14px;
            cursor: pointer;
            color: inherit;
            opacity: 0.7;
        `;
        closeBtn.onclick = () => answerBox.style.display = "none";
        answerBox.appendChild(closeBtn);
    }
}
