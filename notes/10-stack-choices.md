# Stack Choices and Rationale

## Why Expo (2025)
- One codebase for iOS, Android, and Web via React Native + react-native-web.
- Batteries-included dev tooling and OTA updates (future option).
- Rich ecosystem of first-party APIs (camera, filesystem, sqlite).

## Navigation: expo-router
- File-system based routing makes screens easy to organize.
- Great web support and deep linking out of the box.

## Storage: expo-sqlite
- Simple local persistence, durable offline.
- Easy to migrate to cloud later (e.g., Supabase) while keeping local cache.

## Color Extraction
- Phase 1: JavaScript palette extraction (web via Canvas). Native fallback: manual color pick (temporary).
- Phase 2: Edge function / AI service for consistent palette + semantic naming.

## Styling
- Start with StyleSheet to minimize complexity.
- Optionally adopt NativeWind or Tamagui later.

## Testing & Quality
- TypeScript strict mode.
- Add minimal unit tests later via Jest or Vitest (with react-native-testing-library).

---
