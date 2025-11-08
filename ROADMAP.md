# Roadmap

## ✅ Completed (v0.2.0)
- ✅ Navigation with expo-router: Home, Add Material, Detail, Search
- ✅ Capture or pick image for a material
- ✅ Store materials locally in SQLite
- ✅ Color tagging on web (k-means extraction)
- ✅ Search by name and color buckets
- ✅ Server-side storage (Postgres/MongoDB/MariaDB on Unraid)
- ✅ Image upload to server
- ✅ Offline-first sync architecture

## In Progress
- [ ] Home screen material list/grid view
- [ ] Material deletion UI
- [ ] Refresh/pull-to-refresh on search screen
- [ ] Loading states and error handling UI

## Near-term Enhancements
- [ ] Authentication (JWT-based login)
- [ ] Multi-user support with permissions
- [ ] Native color extraction (use react-native-image-colors or similar)
- [ ] Color naming improvements (more granular buckets)
- [ ] Material categories/tags (yarn, fabric, thread, etc.)
- [ ] Quantity tracking (yards, meters, skeins)

## Server & Infrastructure
- [ ] Docker compose for easy Unraid deployment
- [ ] Automated database backups
- [ ] HTTPS/SSL support via reverse proxy
- [ ] Rate limiting and security headers
- [ ] Image optimization and thumbnails
- [ ] CDN integration for faster image loading

## AI & Advanced Features
- [ ] Edge function for reliable palette extraction
- [ ] Semantic color naming (e.g., "forest green", "coral pink") via AI
- [ ] Duplicate detection (similar images)
- [ ] Barcode/QR scanning for location tracking
- [ ] Voice notes and text-to-speech

## UX & Polish
- [ ] Basic theming (light/dark mode)
- [ ] Accessibility improvements (screen reader, contrast)
- [ ] Batch upload workflow
- [ ] Import/export data (JSON + images) for backup
- [ ] PWA enhancements: install prompt, icons, manifest
- [ ] Onboarding tutorial for first-time users

## Later / Nice-to-Have
- [ ] Project tracking (link materials to crafting projects)
- [ ] Shopping list generation
- [ ] Price tracking and inventory value
- [] Sharing materials with friends (public links)
- [ ] Integration with Ravelry or other craft platforms
- [ ] Mobile widgets for quick material lookup

## Known Issues
- Native color extraction not implemented (manual workaround)
- No conflict resolution for simultaneous edits from multiple devices
- Image upload may fail on slow connections (no retry logic)

---
Updated: 2025-11-08
