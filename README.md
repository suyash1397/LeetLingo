
# Leetcode Paraphraser Chrome Extension

A Chrome extension that scrapes Leetcode problem descriptions and sends them to the Groq API for paraphrasing. The paraphrased text is then displayed in the extension’s popup.

---

## Table of Contents

1. [Features](#features)  
2. [Prerequisites](#prerequisites)  
3. [Installation](#installation)  
4. [Configuration](#configuration)  
5. [Project Structure](#project-structure)  
6. [Usage](#usage)  
7. [Development](#development)  
8. [Build & Deployment](#build--deployment)  
9. [Troubleshooting](#troubleshooting)  
10. [Contributing](#contributing)  
11. [License](#license)  

---

## Features

- **Automatic Scraping**  
  Scrapes title, description, constraints, and examples from the current Leetcode problem page.

- **Groq-Powered Paraphrasing**  
  Sends scraped text to the Groq API using your private API key and returns a fluent paraphrase.

- **In-Context Display**  
  Shows the paraphrased text directly in the extension popup for quick copying.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14+  
- NPM (comes with Node.js)  
- Google Chrome (or Chromium-based browser)  

---

## Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/leetcode-paraphraser.git
   cd leetcode-paraphraser
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

---

## Configuration

### Environment Variables

Create a `.env` file in the project root and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> **Warning:** Make sure `.env` is listed in your `.gitignore` to avoid exposing your key.

### Webpack Setup

We use `dotenv-webpack` to inject environment variables into the build. Ensure your `webpack.config.js` includes:

```js
const Dotenv = require('dotenv-webpack');

module.exports = {
  // ...existing config...
  plugins: [
    new Dotenv()
  ]
};
```

---

## Project Structure

```
.
├── dist/                   # Bundled output (auto-generated)
├── src/
│   ├── background.js       # Handles API requests
│   └── content_script.js   # Scrapes Leetcode content
├── popup.html              # Extension UI
├── popup.js                # Popup logic
├── manifest.json           # Chrome extension manifest
├── webpack.config.js       # Build configuration
├── .env                    # Environment variables (ignored by git)
└── .gitignore              # Files to ignore
```

---

## Usage

1. **Build the extension**  
   ```bash
   npm run build
   ```
2. **Load into Chrome**  
   - Open `chrome://extensions`  
   - Enable **Developer Mode**  
   - Click **Load unpacked** and select this project’s root folder  

3. **Paraphrase a Problem**  
   - Navigate to any Leetcode problem page.  
   - Click the extension icon.  
   - Hit **Run**.  
   - The paraphrased text will appear in the textarea—copy it anywhere you like!

---

## Development

- **Watching for Changes**  
  ```bash
  npm run watch
  ```
  Automatically rebuilds on source changes.

- **Linting & Formatting**  
  Add ESLint/Prettier as desired:
  ```bash
  npm install --save-dev eslint prettier
  ```

---

## Build & Deployment

- **Production Build**  
  ```bash
  npm run build
  ```
- **Publish to Chrome Web Store**  
  1. Zip the contents of the `dist/` folder plus `manifest.json`, `popup.html`, and `popup.js`.  
  2. Upload via the [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard).

---

## Troubleshooting

- **Invalid API Key**  
  - Ensure `.env` contains the correct `GROQ_API_KEY`.  
  - Re-run `npm run build`.

- **Extension Not Loading**  
  - Confirm you selected the correct folder in **Load unpacked**.  
  - Check `chrome://extensions` for error messages.

- **Scraping Fails**  
  - Leetcode’s DOM structure may have changed.  
  - Update the selector in `src/content_script.js` (currently `.elfjS`).

---

## Contributing

1. Fork the repository  
2. Create your feature branch:  
   ```bash
   git checkout -b feature/my-new-feature
   ```  
3. Commit your changes:  
   ```bash
   git commit -am 'Add some feature'
   ```  
4. Push to the branch:  
   ```bash
   git push origin feature/my-new-feature
   ```  
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
