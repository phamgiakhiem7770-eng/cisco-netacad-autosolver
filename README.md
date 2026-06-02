# CISCO Netacad Auto-Solver

A lightweight Chrome Extension that extracts quiz questions from the current page, sends them to Gemini via its API, and displays the suggested answer directly on the screen.

*Originally DOM-based, but now uses OCR and works fine.*


Welcoming contributions from the OSS community to make it even better.

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
