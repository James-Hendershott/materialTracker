# Material Tracker

A cross-platform (iOS, Android, Web) Expo app for cataloging textile materials (yarn, cloth, fabrics).

## Features
- **Capture or Upload**: Take a photo or choose from your library.
- **Metadata**: Store name, location (bin/shelf), and notes.
- **Color Extraction**: Automatically detect dominant colors on web (hue-based naming).
- **Search**: Find materials by name, location, or color keywords (e.g., "green", "blue").

## Quick Start

### Prerequisites
- Node.js 20+ (for Expo CLI)
- npm or yarn

### Install & Run

1. **Install dependencies**:
   ```sh
   npm install
   ```

2. **Start the dev server**:
   ```sh
   npm start
   ```
   This will open the Expo dev tools. You can then:
   - Press `w` to open in a web browser.
   - Scan the QR code with the Expo Go app (iOS/Android) to preview on a physical device.
   - Press `a` for Android emulator or `i` for iOS simulator (macOS only).

3. **Run on specific platforms**:
   ```sh
   npm run web      # Web browser
   npm run android  # Android emulator/device
   npm run ios      # iOS simulator (macOS only)
   ```

## Project Structure
```
materialTracker/
├── app/                # expo-router screens
│   ├── _layout.tsx     # Stack navigator
│   ├── index.tsx       # Home
│   ├── add.tsx         # Add Material
│   ├── detail.tsx      # Material Detail
│   └── search.tsx      # Search
├── src/
│   ├── storage/
│   │   └── db.ts       # SQLite operations
│   ├── utils/
│   │   └── colors.ts   # Color extraction & bucketing
│   └── types.ts        # TypeScript types
├── notes/              # Obsidian documentation
├── CHANGELOG.md
├── ROADMAP.md
└── README.md
```

## Tech Stack
- **Framework**: Expo (React Native + Web)
- **Language**: TypeScript
- **Navigation**: expo-router
- **Storage**: expo-sqlite
- **Media**: expo-image-picker

## Documentation
See `notes/` for detailed Obsidian-compatible documentation on architecture, stack choices, and color extraction logic.

## Roadmap
- Cloud sync (Supabase)
- AI-powered color naming
- Batch capture workflow
- Export/import data

See `ROADMAP.md` for details.

## License
MIT (or your preferred license)
