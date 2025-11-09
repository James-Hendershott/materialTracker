# Roadmap

## ✅ Completed (v0.3.0)
- ✅ Navigation with expo-router: Home, Add Material, Detail, Search
- ✅ Capture or pick image for a material
- ✅ Store materials locally in SQLite
- ✅ **Smart color extraction on iOS/Android/Web** (k-means clustering)
- ✅ Search by name and color buckets
- ✅ Server-side storage (Postgres/MongoDB/MariaDB on Unraid)
- ✅ Image upload to server
- ✅ Offline-first sync architecture
- ✅ **API authentication with API keys**
- ✅ **Rate limiting and CORS protection**
- ✅ **Keyboard avoidance for mobile forms**
- ✅ Security headers (Helmet.js)
- ✅ **Display color swatches and names in search**

## In Progress
- [ ] Home screen material list/grid view
- [ ] Material deletion UI
- [ ] Refresh/pull-to-refresh on search screen
- [ ] Loading states and error handling UI
- [ ] Add a Inventory Page
- [ ] Add a QTY tracker with live updates including mins and maxes
- [ ] Add Categories, ability to create and use categories and edit.
- [ ] Add a Project Page (Create a Project, add material to the project, add Image)
- [ ] Add a Shopping List
- [ ] 

## Near-term Enhancements
- [ ] Authentication (JWT-based user login)
- [ ] Multi-user support with permissions
- [ ] Color naming improvements (more granular buckets, pastel detection)
- [ ] Material categories/tags (yarn, fabric, thread, etc.)
- [ ] Quantity tracking (yards, meters, skeins)
- [ ] Better color extraction accuracy (ML model integration)

## Server & Infrastructure
- [ ] ~~Docker compose for easy Unraid deployment~~ (Dockerfile exists, needs testing)
- [ ] Automated database backups
- [ ] HTTPS/SSL support via reverse proxy (Nginx Proxy Manager)
- [ ] ~~Rate limiting and security headers~~ ✅ Implemented
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
- [ ] Sharing materials with friends (public links)
- [ ] Integration with Ravelry or other craft platforms
- [ ] Mobile widgets for quick material lookup

## Known Issues
- ~~Native color extraction not implemented~~ ✅ Fixed in v0.3.0
- No conflict resolution for simultaneous edits from multiple devices
- Image upload may fail on slow connections (no retry logic)
- Color extraction accuracy can vary (base64 sampling approximation)

---
Updated: 2025-11-09
