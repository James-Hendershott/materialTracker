# Changelog

All notable changes will be documented in this file.

## [0.2.0] - 2025-11-08
### Added
- **Server-side storage** with support for PostgreSQL, MongoDB, and MariaDB on Unraid
- Express API server (`server.ts`) with REST endpoints for materials and images
- Database adapters for Postgres, MongoDB, and MariaDB with unified interface
- Image upload endpoint and server-side storage
- Offline-first architecture: local SQLite cache with background server sync
- Environment configuration system with `.env.local` support
- Server architecture documentation in `notes/70-server-architecture.md`
- npm scripts for running API server: `npm run server`, `npm run server:prod`

### Changed
- Updated `db.ts` to use server API with automatic fallback to local storage
- Modified Add screen to upload images to server
- Updated Search and Detail screens to use async material loading
- Added `synced` column to local SQLite for tracking sync status

### Dependencies
- Added: `@supabase/supabase-js`, `express`, `cors`, `multer`, `pg`, `mongodb`, `mysql2`, `dotenv`
- Added dev: `@types/express`, `@types/cors`, `@types/multer`, `@types/pg`, `ts-node`, `nodemon`

## [0.1.0] - 2025-11-08
### Added
- Initialized Expo TypeScript project with web + native support.
- Set up expo-router file-based navigation: `/`, `/add`, `/detail`, `/search`.
- Integrated expo-image-picker for camera/library image capture.
- Created expo-sqlite local database with `materials` table.
- Implemented simple color extraction on web (k-means palette) with hue-based semantic naming (red, green, blue, etc.).
- Built Add Material screen with name, location, notes, and image capture.
- Built Search screen with text and color keyword filtering.
- Built Detail screen showing material info and color chips.
- Created `notes/` Obsidian documentation: overview, stack, data model, navigation, color extraction, storage, getting started.
- Added CHANGELOG, ROADMAP, and README files.
- Installed dependencies: expo-router, expo-image-picker, expo-sqlite, uuid, react-native-safe-area-context, react-native-screens.
- Type-checked the entire codebase with TypeScript strict mode (no errors).
- Started dev server successfully.
