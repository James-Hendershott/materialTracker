# Local Storage with expo-sqlite

## Why SQLite?
- Persistent, fast, local-first database on both iOS and Android.
- Web fallback: expo-sqlite uses SQLite compiled to WebAssembly (via sql.js) for web targets in Expo SDK 50+.

## Schema
One table: `materials`
```sql
CREATE TABLE materials (
  id TEXT PRIMARY KEY,
  name TEXT,
  location TEXT,
  imageUri TEXT,
  colors TEXT,
  createdAt INTEGER,
  updatedAt INTEGER,
  notes TEXT
)
```
- `colors` is JSON (stringified array of ColorRGB).

## CRUD Operations (`src/storage/db.ts`)
- `openDB()`: opens or creates the database, ensures table exists.
- `saveMaterial(m)`: inserts or replaces a material row.
- `getAllMaterials()`: returns all materials sorted by createdAt DESC.
- `getMaterialById(id)`: fetches a single material.
- `deleteMaterial(id)`: removes a material (future feature in UI).

## Image URIs
- Native: store file:// URIs from expo-image-picker. Images remain in the app's sandboxed directory.
- Web: store blob or data URLs. For production, consider uploading to a CDN/cloud storage and storing HTTPS URLs.

## Future Migration
- Add cloud sync via Supabase Postgres, syncing a `remote_materials` table.
- Keep local SQLite as a cache for offline-first UX.

---
