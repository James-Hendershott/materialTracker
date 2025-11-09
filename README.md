# Material Tracker

A cross-platform (iOS, Android, Web) Expo app for cataloging textile materials (yarn, cloth, fabrics) with **server-side storage on your Unraid server**.

## Features
- **Server Storage**: Data stored on your Unraid server (PostgreSQL/MongoDB/MariaDB).
- **Offline-First**: Works offline, syncs automatically when connected.
- **Color Extraction**: Automatically detect dominant colors (web).
- **Smart Search**: Find materials by name, location, or color keywords (e.g., "green", "blue").
- **Image Management**: Images uploaded to your server, accessible from all devices.

## Architecture

```
┌─────────────────┐
│   Mobile/Web    │  ← Expo app (iOS/Android/Web)
│     Client      │  ← Local SQLite cache
└────────┬────────┘
         │ HTTP
┌────────▼────────┐
│  Express API    │  ← server.ts (runs on Unraid)
│     Server      │
└────────┬────────┘
         │
┌────────▼────────┐
│     Unraid      │  ← Your home server
│   Databases     │
│ Postgres/Mongo  │
│    /MariaDB     │
└─────────────────┘
```

## Quick Start

### Client (Mobile/Web App)

1. **Install dependencies**:
   ```sh
   npm install
   ```

2. **Configure server connection** (optional, uses local SQLite if skipped):
   
   Create `.env.local`:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.xxx:3001/api
   EXPO_PUBLIC_USE_SERVER=true
   EXPO_PUBLIC_API_KEY=your-generated-api-key
   ```
   
   > **Security Note**: Generate a secure API key with:
   > ```bash
   > node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   > ```
   > See `notes/80-security-setup.md` for full security guide.

3. **Start the app**:
   ```sh
   npm start
   ```
   Then:
   - Press `w` for web browser
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (macOS only)
   - Scan QR with Expo Go app for physical devices

### Server (Unraid / API)

#### Option A: Docker Compose (Recommended for Unraid)

1. **Configure environment**:
   
   Create `.env` file:
   ```env
   POSTGRES_PASSWORD=your_secure_password
   API_KEY=your-generated-api-key
   ```
   
   Generate API key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

2. **Start services**:
   ```sh
   docker-compose up -d
   ```

This starts PostgreSQL and the API server on port 3001.

#### Option B: Manual Setup

1. **Set up database** on your Unraid server (see `notes/70-server-architecture.md`)

2. **Configure `.env`** (for server):
   ```env
   DATABASE_TYPE=postgres
   POSTGRES_HOST=192.168.1.xxx
   POSTGRES_PORT=5432
   POSTGRES_DB=materialtracker
   POSTGRES_USER=materialtracker_user
   POSTGRES_PASSWORD=your_password
   API_KEY=your-generated-api-key
   ```

3. **Run server**:
   ```sh
   npm run server
   ```

   For production with PM2:
   ```sh
   npm i -g pm2
   pm2 start server.ts --name material-tracker
   pm2 save
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
