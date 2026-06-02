chrome.runtime.onMessage.addListener(
    async (request) => {

        if (request.action !== "findAnswer")
            return;

        const questionElement =
            document.querySelector("h2");

        if (!questionElement) {
            alert("Question not found");
            return;
        }

        const question =
            questionElement.innerText;

        const optionElements =
            document.querySelectorAll("label");

        const options =
            [...optionElements]
            .map(el => el.innerText.trim());

        const answer =
            await askGemini(
                question,
                options
            );

        showAnswer(answer);
    }
);

async function askGemini(
    question,
    options
) {

    const apiKey =
        "PUT_YOUR_GEMINI_API_KEY_HERE";

    const prompt = `
Q: ${question}

Options:
${options.join("\n")}

Reply with only the correct option text.
`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0,
                    maxOutputTokens: 10
                }
            })
        }
    );

    const data =
        await response.json();

    return data.candidates[0]
        .content.parts[0].text;
}

function showAnswer(answer) {

    let oldBox =
        document.getElementById(
            "gemini-answer-box"
        );

    if (oldBox)
        oldBox.remove();

    const box =
        document.createElement("div");

    box.id =
        "gemini-answer-box";

    box.innerHTML = `
        <h3>Gemini Answer</h3>
        <p>${answer}</p>
    `;

    document.body.prepend(box);
}