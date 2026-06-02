document.getElementById("findAnswer").addEventListener("click", async () => {
    const statusDiv = document.getElementById("status");
    const button = document.getElementById("findAnswer");
    
    statusDiv.textContent = "Processing...";
    statusDiv.className = "";
    button.disabled = true;

    try {
        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!tabs[0]) {
            throw new Error("No active tab found");
        }

        const response = await chrome.runtime.sendMessage({
            action: "processQuestion",
            tabId: tabs[0].id
        });

        if (response && response.error) {
            throw new Error(response.error);
        }

        statusDiv.textContent = "Answer found and displayed!";
        statusDiv.className = "success";
    } catch (err) {
        statusDiv.textContent = `Error: ${err.message}`;
        statusDiv.className = "error";
    } finally {
        button.disabled = false;
    }
});