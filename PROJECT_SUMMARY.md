# Material Tracker - Project Summary

## 🎉 What We Built

A **cross-platform material tracking app** with **server-side storage on your Unraid server**.

### Version 0.2.0 - Server Integration Complete!

---

## ✅ Completed Features

### Client App (Mobile/Web)
- ✅ Expo React Native app (iOS, Android, Web)
- ✅ Camera & photo library integration
- ✅ Material metadata (name, location, notes)
- ✅ Color extraction (web) using k-means clustering
- ✅ Smart search by name, location, and color
- ✅ Offline-first architecture with SQLite cache
- ✅ Automatic background sync to server

### Server Infrastructure
- ✅ Express REST API server
- ✅ Support for 3 databases:
  - PostgreSQL (recommended)
  - MongoDB
  - MariaDB/MySQL
- ✅ Image upload and storage on server
- ✅ Docker Compose setup for Unraid
- ✅ Health check and monitoring endpoints
- ✅ CORS support for cross-origin requests

### Documentation
- ✅ Comprehensive Obsidian vault (`notes/`)
- ✅ Server architecture guide
- ✅ 5-minute Unraid setup guide
- ✅ CHANGELOG tracking all changes
- ✅ ROADMAP for future features

---

## 📁 Project Structure

```
materialTracker/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Navigation
│   ├── index.tsx                 # Home
│   ├── add.tsx                   # Add Material
│   ├── detail.tsx                # Material Detail
│   └── search.tsx                # Search
│
├── src/
│   ├── config/
│   │   └── server.ts             # Server configuration
│   ├── storage/
│   │   ├── db.ts                 # Client storage (with sync)
│   │   ├── server-db.ts          # Unified server interface
│   │   ├── postgres.ts           # PostgreSQL adapter
│   │   ├── mongodb.ts            # MongoDB adapter
│   │   └── mariadb.ts            # MariaDB adapter
│   ├── utils/
│   │   └── colors.ts             # Color extraction & search
│   └── types.ts                  # TypeScript types
│
├── notes/                        # Obsidian documentation
│   ├── README.md                 # Documentation index
│   ├── 00-overview.md
│   ├── 10-stack-choices.md
│   ├── 20-data-model.md
│   ├── 30-navigation.md
│   ├── 40-color-extraction.md
│   ├── 50-local-storage.md
│   ├── 60-getting-started.md
│   └── 70-server-architecture.md
│
├── server.ts                     # Express API server
├── docker-compose.yml            # Docker setup
├── Dockerfile                    # Container build
├── .env.example                  # Config template
├── SETUP_UNRAID.md              # Quick setup guide
├── CHANGELOG.md                  # Version history
├── ROADMAP.md                    # Future plans
└── README.md                     # Main docs
```

---

## 🚀 How to Use

### For Your Wife (App User)

1. **Add Materials**:
   - Open app on phone or web
   - Click "Add Material"
   - Take photo or choose from library
   - Enter name, location, notes
   - Save!

2. **Search**:
   - Type color names (e.g., "green", "blue")
   - Type material names or locations
   - Results show instantly

3. **View Details**:
   - Click any material card
   - See full image, colors, location, notes

### For You (Developer/Admin)

1. **Set Up Unraid Server**:
   ```bash
   # See SETUP_UNRAID.md for detailed steps
   docker-compose up -d
   ```

2. **Configure App**:
   ```env
   # .env.local
   EXPO_PUBLIC_API_URL=http://192.168.1.xxx:3001/api
   EXPO_PUBLIC_USE_SERVER=true
   ```

3. **Run App**:
   ```bash
   npm start
   ```

---

## 🔧 Tech Stack (2025 Modern)

| Category | Technology | Why? |
|----------|-----------|------|
| **Framework** | Expo SDK 54 | Cross-platform (iOS/Android/Web) |
| **Language** | TypeScript | Type safety, better DX |
| **Navigation** | expo-router | File-system routing |
| **Local DB** | expo-sqlite | Offline cache |
| **Server DB** | Postgres/Mongo/MariaDB | Your choice on Unraid |
| **API Server** | Express.js | Simple, fast REST API |
| **Image Handling** | expo-image-picker + Multer | Camera & upload |
| **Color Science** | k-means + HSV | Palette extraction |
| **Deployment** | Docker Compose | Easy Unraid setup |

---

## 📊 Data Flow

```
┌─────────────────┐
│   Your Phone    │  1. Take photo
│   (Expo App)    │  2. Add metadata
└────────┬────────┘  3. Save (instant)
         │
         │ Background sync
         ↓
┌────────────────────┐
│  Local SQLite DB   │  4. Cache locally
│   (Offline Cache)  │     (works offline)
└────────┬───────────┘
         │
         │ HTTP POST
         ↓
┌────────────────────┐
│   Unraid Server    │  5. Upload image
│   Express API      │  6. Save to DB
│   (port 3001)      │  7. Return success
└────────┬───────────┘
         │
         ↓
┌────────────────────┐
│   PostgreSQL DB    │  8. Persistent storage
│   (Your Unraid)    │     (accessible from anywhere)
└────────────────────┘
```

---

## 🎯 Next Steps (From ROADMAP.md)

### High Priority
- [ ] Home screen material grid view
- [ ] Material deletion UI
- [ ] Pull-to-refresh on search
- [ ] Loading states and error handling

### Server Enhancements
- [ ] Authentication (JWT login)
- [ ] HTTPS/SSL setup
- [ ] Automated backups
- [ ] Image thumbnails

### AI & Advanced
- [ ] Better color naming ("forest green" vs "green")
- [ ] Native color extraction
- [ ] Duplicate detection

---

## 📚 Learning Resources

All documentation is in `notes/` as Obsidian-compatible Markdown:

1. **Start Here**: `notes/README.md`
2. **Architecture**: `notes/00-overview.md`
3. **Stack Choices**: `notes/10-stack-choices.md`
4. **Server Setup**: `notes/70-server-architecture.md`
5. **Quick Start**: `SETUP_UNRAID.md`

---

## 🐛 Troubleshooting

### Can't Connect to Server
```bash
# Test API
curl http://YOUR_UNRAID_IP:3001/health

# Check logs
docker-compose logs api
```

### Images Not Syncing
- Check network connection
- Verify `.env.local` has correct IP
- Look at browser console for errors

### Database Issues
```bash
# Check database
docker exec -it postgres psql -U materialtracker_user -d materialtracker
SELECT COUNT(*) FROM materials;
```

---

## 🎓 What You Learned

This project teaches:
- **Expo/React Native**: Cross-platform mobile development
- **TypeScript**: Type-safe JavaScript
- **Express.js**: REST API development
- **PostgreSQL/MongoDB/MariaDB**: Database management
- **Docker**: Containerization and deployment
- **Offline-first**: Sync patterns and caching
- **Color Science**: k-means clustering, HSV color space
- **Git**: Version control with conventional commits

---

## 🙏 Credits

Built with:
- Expo (React Native framework)
- TypeScript (Microsoft)
- PostgreSQL / MongoDB / MariaDB
- Express.js
- Docker

---

## 📝 Version History

- **v0.2.0** (2025-11-08): Server integration with Unraid
- **v0.1.0** (2025-11-08): Initial MVP with local storage

---

**Enjoy your Material Tracker app!** 🧶✨

For questions, check the `notes/` documentation or review the code comments.
