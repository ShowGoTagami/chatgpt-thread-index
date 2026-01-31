# ChatGPT Question Navigator

A Chrome extension that enhances ChatGPT's user experience by providing a persistent sidebar displaying all user questions with click-to-scroll navigation.

## Features

- 📋 **Question Overview** - See all your questions at a glance in a right sidebar
- 🖱️ **One-Click Navigation** - Click any question to instantly scroll to it
- ⚡ **Real-time Updates** - New questions automatically appear as you chat
- 🎯 **Smart Selection** - Visual highlighting of the currently selected question
- 🔄 **SPA Support** - Works seamlessly when switching conversations

## Installation

1. Clone this repository
2. Run `npm install && npm run build`
3. Open `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the project folder

## Development

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch

# Run tests
npm test
```

## Tech Stack

- TypeScript
- Chrome Extension Manifest V3
- MutationObserver API
- Vanilla CSS
- Vitest (testing)

## Project Structure

```
├── manifest.json          # Chrome Extension config
├── src/
│   ├── content_script.ts  # Main entry point
│   ├── sidebar.ts         # Sidebar UI component
│   ├── styles.css         # Sidebar styles
│   ├── types.ts           # Type definitions
│   └── utils/
│       ├── debounce.ts
│       ├── domMonitor.ts
│       ├── domSelectors.ts
│       ├── errorHandler.ts
│       ├── questionExtractor.ts
│       └── scrollController.ts
└── dist/                  # Compiled output
```

## License

MIT
