# Material Tracker Project Overview

## Vision
A cross-platform (iOS, Android, Web) Expo app for cataloging textile materials (yarn, cloth, fabric). Users can:
- Capture or upload a photo of a material.
- Store metadata: name, type, location (bin/shelf/room), free-form notes.
- Automatically extract a color palette from images.
- Search materials by name and by color keywords (e.g., "green", "pastel", "teal").

## Stack (Initial)
- **Runtime**: Expo (React Native) with web support
- **Language**: TypeScript
- **Navigation**: expo-router (to add)
- **State**: Lightweight local state + persistent storage in SQLite (expo-sqlite)
- **Media**: expo-image-picker for camera & library
- **Color Extraction**: Phase 1 simple dominant palette via JS (k-means or MMCQ). Phase 2: AI-powered naming & clustering.
- **Styling**: StyleSheet + future option for Tailwind (nativewind) or Dripsy.

## Data Model (Draft)
Material:
- id (string UUID)
- name (string)
- location (string)
- imageUri (string)
- colors (Array<{ hex: string; name?: string; r:number; g:number; b:number }>)
- createdAt (number)
- updatedAt (number)
- notes (string)

## Color Search Approach
1. Extract N dominant colors (e.g., 5) per image.
2. Map each color to a basic semantic bucket (green, blue, red, yellow, brown, gray, black, white, purple, orange, pink) using HSV thresholds.
3. Index those buckets for quick search. A material matches a color query if any of its buckets include that keyword.

## Roadmap Snapshot
See `ROADMAP.md` for prioritized items.

## Documentation Index
- `10-stack-choices.md` - Tech stack decisions
- `20-data-model.md` - Material entity schema
- `30-navigation.md` - expo-router setup
- `40-color-extraction.md` - Color palette extraction
- `50-local-storage.md` - SQLite persistence
- `60-getting-started.md` - Development setup
- `70-server-architecture.md` - Express API & database adapters
- `80-security-setup.md` - **API authentication, CORS, rate limiting**

## Security
Server endpoints are protected with:
- **API Key Authentication** (x-api-key header)
- **CORS Protection** (origin whitelist)
- **Rate Limiting** (100 requests per 15 minutes)
- **Helmet.js** (security headers)

See `80-security-setup.md` for complete security configuration guide.

---
Created: INITIAL
Updated: 2025-11-09 - Added server security documentation
