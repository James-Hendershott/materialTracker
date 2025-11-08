# Navigation & Routing Setup

## expo-router File-based Routing
We use **expo-router** for navigation. Each file in `app/` becomes a route:
- `app/index.tsx` → `/` (Home)
- `app/add.tsx` → `/add` (Add Material)
- `app/detail.tsx` → `/detail` (Material Detail)
- `app/search.tsx` → `/search` (Search Materials)

`app/_layout.tsx` defines a `Stack` navigator for linear flow.

## Navigation Flow
1. Home: list of Materials (future iteration) with links to Add and Search.
2. Add: Capture photo, fill in fields, save to SQLite.
3. Search: Full-text + color search.
4. Detail: View material with colors, location, notes.

## Deep Linking
expo-router supports deep links by default. E.g., `app://detail?id=abc-123` opens the detail screen for that material.

## Future
- Tab navigation or drawer if we add more top-level sections (profile, settings).
- Nested stacks for advanced flows.

---
