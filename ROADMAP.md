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

## ✅ Completed (latest)
- ✅ Home screen material list/grid view
- ✅ Material deletion UI
- ✅ Refresh/pull-to-refresh on search screen
- ✅ Loading states and error handling UI (Home, Detail, Search baseline)
- ✅ Image cropping support via native picker
- ✅ Require crop confirmation before saving (guidance to crop to only the material)
- ✅ Color percentage extraction (displayed across app)
- ✅ Manual color editing (hex and percent) on Add screen

## In Progress
- [ ] Add an Inventory Page
- [ ] Add a QTY tracker with live updates including mins and maxes
- [ ] Add Categories, ability to create and use categories and edit.
- [ ] Add a Project Page (Create a Project, add material to the project, add Image)
- [ ] Add a Shopping List
- [ ] Add a modern look and sleek user experience
- [ ] Add a color dropper tool to pick specific colors from the image (eyedropper)

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
- Colors being extracted are way off. Black shirt with Gray and Red is coming up with red - 28% #694944, Gray -16% #68536f, green - 14% #457157, yellow - 14% #656f3c, gray - 28% #4a435b. Can we maybe make it less specific to all the colors and provide a basic color option? 
- Cropping is required when adding an image which is great, but it does not give the ability to re-crop after that. We need to allow them to edit the crop before confirming if needed.

---
Updated: 2025-11-09
