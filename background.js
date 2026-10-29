chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "captureAndSolve") {
        handleCaptureAndSolve(sender)
            .then(response => sendResponse(response))
            .catch(err => sendResponse({ error: err.message }));
        return true; // Keep message channel open for async response
    }
});

async function handleCaptureAndSolve(sender) {
    const windowId = sender.tab ? sender.tab.windowId : chrome.windows.WINDOW_ID_CURRENT;
    
    const dataUrl = await new Promise((resolve, reject) => {
        try {
            chrome.tabs.captureVisibleTab(windowId, { format: "jpeg", quality: 80 }, (url) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else if (!url) {
                    reject(new Error("Failed to capture screen (no data URL returned). Ensure the extension has 'activeTab' permission."));
                } else {
                    resolve(url);
                }
            });
        } catch (e) {
            reject(new Error("Capture exception: " + e.message));
        }
    });

    const answer = await askGeminiVision(dataUrl);
    return { answer: answer };
}

async function askGeminiVision(dataUrl) {
    const apiKey = "AQ.Ab8RN6L5sjiK-0wcFHxjkUsPOI1EcaUjZVqAdZTAHhBm3-XbCQ"; 
    
    if (!apiKey || apiKey === "AQ.Ab8RN6L5sjiK-0wcFHxjkUsPOI1EcaUjZVqAdZTAHhBm3-XbCQ") {
        throw new Error("Please set your Gemini API key in background.js");
    }

    const base64Data = dataUrl.split(',')[1];

    const prompt = `Analyze the multiple-choice question in the image.
Determine all the correct answer(s). If the question asks to select multiple options (e.g., "Choose two", "Choose three"), you MUST identify all of them.
Return ONLY the exact text of the correct option(s). Do not include any explanations.
If there are multiple correct options, separate each option with a blank line.`;

    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout per request

        let response;
        try {
            response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    signal: controller.signal,
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: prompt },
                                {
                                    inlineData: {
                                        mimeType: "image/jpeg",
                                        data: base64Data
                                    }
                                }
                            ]
                        }],
                        generationConfig: {
                            temperature: 0,
                            maxOutputTokens: 300
                        }
                    })
                }
            );
        } catch (e) {
            clearTimeout(timeoutId);
            if (attempt < MAX_RETRIES - 1) {
                attempt++;
                await new Promise(r => setTimeout(r, 2000 * attempt)); // wait 2s, 4s...
                continue;
            }
            if (e.name === 'AbortError') {
                throw new Error("Gemini API request timed out after multiple attempts.");
            }
            throw new Error("Network error contacting Gemini API: " + e.message);
        }

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            
            // Auto-retry on 503 (High Demand) or 429 (Rate Limit)
            if (response.status === 503 || response.status === 429) {
                if (attempt < MAX_RETRIES - 1) {
                    attempt++;
                    // Exponential backoff: 2s, 4s...
                    await new Promise(r => setTimeout(r, 2000 * Math.pow(2, attempt - 1)));
                    continue;
                }
            }
            throw new Error(`Gemini API Error: ${response.status} ${errData.error?.message || ''}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates.length) {
            throw new Error("No response from Gemini");
        }

        return data.candidates[0].content.parts[0].text.trim();
    }
}
