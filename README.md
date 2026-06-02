<div align="center">

<h1>Cisco Netacad Auto-Solver</h1>

<img
  width="150"
  height="150"
  alt="netacad-autosolver-modified"
  src="https://github.com/user-attachments/assets/14853378-c93d-4f1a-8b61-ae3c2faa81af"
/>

<br>

<p>
  A lightweight Chrome Extension that extracts quiz questions from the current page,
  sends them to Gemini via its API, and displays the suggested answer directly on the screen. <em>(Originally DOM-based, but now uses OCR and works fine)</em>
</p>

<p>
  Welcoming contributions from the OSS community to make it even better.
</p>

</div>

## Setup

### 1. Google Gemini API Key

Create a Gemini API key from:

https://aistudio.google.com/app/apikey

Copy the generated API key.

---

## Installation

### Step 1: Insert API Key

Open:

```text
background.js
```

Locate:

```javascript
const apiKey = "YOUR_GEMINI_API_KEY";
```

Replace with:

```javascript
const apiKey = "YOUR_ACTUAL_API_KEY";
```

Save the file.

---

### Step 2: Load Extension in Chrome

Open Chrome and navigate to:

```text
chrome://extensions
```

Enable:

```text
Developer Mode
```

Click:

```text
Load unpacked
```

Select the project folder.

The extension should now appear in the Chrome toolbar.

---

### Step 3: Use the Extension

Navigate to any Cisco NetAcad quiz page.

Look for the floating **Solve** button in the **bottom-right corner** of the page:

```text
Click Solve
```
<p align="center">
  <img
    width="75%"
    alt="netacad-screenshot"
    src="https://github.com/user-attachments/assets/12a3ab99-49f4-467c-a188-ef367ed41607"
  />
</p>

Click the button to scan the page using OCR. The suggested correct options will be displayed on the screen.

---

