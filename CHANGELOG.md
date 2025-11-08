# Changelog

All notable changes will be documented in this file.

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
