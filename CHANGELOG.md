# Changelog

All notable changes will be documented in this file.

## [0.3.0] - 2025-11-09
### Added
- **Smart color extraction** for iOS/Android using expo-image-manipulator
- Cross-platform `extractPalette()` function works on web and native
- Automatic color detection from images using k-means clustering
- Color swatches displayed in search results
- Color name labels (red, blue, green, etc.) shown in material cards
- API key authentication middleware (x-api-key header)
- Rate limiting (100 requests per 15 minutes)
- CORS protection with origin whitelist
- Helmet.js security headers
- Keyboard avoidance in Add Material form
- `react-native-get-random-values` polyfill for UUID generation
- Comprehensive security documentation (`notes/80-security-setup.md`)
- iPhone testing guide (`TESTING_ON_IPHONE.md`)
- Getting started guide (`GETTING_STARTED.md`)
- Connection troubleshooting script (`test-connection.bat`)

### Fixed
- Keyboard covering save button on mobile devices
- `crypto.getRandomValues()` not supported error on React Native
- Server TypeScript execution with proper tsconfig.server.json
- Network request failures with proper error handling

### Security
- Generated secure API key for production use
- Configured API authentication for all endpoints (except health check)
- Added rate limiting to prevent abuse
- Implemented CORS whitelist for origin control

### Dependencies
- Added: `helmet`, `express-rate-limit`, `expo-image-manipulator`, `react-native-get-random-values`
- Added dev: `@types/express-rate-limit`

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
