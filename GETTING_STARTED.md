# Getting Started Guide - Material Tracker

## What You Have Now

Your Material Tracker app is fully configured and ready to use! Here's what's been set up:

### ✅ Complete Features
1. **Mobile/Web App** (Expo + React Native)
   - Add materials with photos
   - Color extraction from images
   - Search by name, location, or color
   - Offline-first with local SQLite cache

2. **Secure API Server** (Express.js)
   - PostgreSQL database connection configured
   - API key authentication
   - CORS protection
   - Rate limiting (100 requests per 15 min)
   - HTTP security headers (Helmet)

3. **Your Unraid Configuration**
   - PostgreSQL: `192.168.1.153:5433` → `materialTracker` database
   - MongoDB available: port `27018` (optional alternative)
   - API Key: `7f0dccba96f701c81c3d48cef7b4b15dda6764a76b659ebed5dc38f930e88159`

4. **Documentation**
   - Complete security guide: `notes/80-security-setup.md`
   - Server architecture: `notes/70-server-architecture.md`
   - Getting started: `notes/60-getting-started.md`

## How to Use Your App

### Option 1: Run Everything Locally (Easiest to Start)

```bash
# Terminal 1: Start the mobile/web app
npm start
# Press 'w' for web browser

# Terminal 2: Start the API server
npm run server
```

The app will:
- Run in your browser at `http://localhost:8081`
- Connect to your local API server at `http://localhost:3001`
- Store data in your Unraid PostgreSQL database
- Cache data locally in SQLite when offline

### Option 2: Deploy Server to Unraid (Production Setup)

1. **Copy files to Unraid:**
   ```bash
   # On your development machine
   scp -r ./server.ts ./src ./package.json ./package-lock.json ./tsconfig.server.json ./.env root@192.168.1.153:/mnt/user/appdata/materialtracker/
   ```

2. **On Unraid, install and run:**
   ```bash
   ssh root@192.168.1.153
   cd /mnt/user/appdata/materialtracker
   npm install --production
   npm run server:prod
   ```

3. **Or use Docker** (see `SETUP_UNRAID.md`)

### Option 3: Just Use Local Mode (No Server)

Edit `.env.local`:
```env
EXPO_PUBLIC_USE_SERVER=false
```

The app will work entirely offline with local SQLite storage.

## Testing Your Setup

### 1. Test Server is Running
```bash
# Test health endpoint (public, no auth)
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":...}

# Test without API key (should fail)
curl http://localhost:3001/api/materials
# Should return: {"error":"Unauthorized: Invalid or missing API key"}

# Test with API key (should work)
curl -H "x-api-key: 7f0dccba96f701c81c3d48cef7b4b15dda6764a76b659ebed5dc38f930e88159" http://localhost:3001/api/materials
# Should return: []
```

### 2. Test Mobile App
1. Start app: `npm start`
2. Press `w` for web
3. Click "Add Material"
4. Take/upload a photo
5. Fill in details
6. Save
7. Check "Search Materials" to see your entry

### 3. Verify Data in Database
```bash
# Connect to your Unraid PostgreSQL
psql -h 192.168.1.153 -p 5433 -U postgres -d materialTracker

# List materials
SELECT id, name, location FROM materials;
```

## What Files Are Important

### Configuration Files (DO NOT commit to git)
- `.env` - Server secrets (API key, database credentials)
- `.env.local` - App secrets (API key, server URL)

### Files You Can Edit
- `app/` - UI screens (add new features here)
- `src/storage/db.ts` - Database logic
- `src/utils/colors.ts` - Color extraction logic
- `server.ts` - API endpoints

### Documentation
- `README.md` - Quick start guide
- `notes/` - Detailed documentation for Obsidian
- `CHANGELOG.md` - Version history
- `ROADMAP.md` - Future features

## Common Tasks

### Change API Key
1. Generate new key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
2. Update `.env`: `API_KEY=new-key`
3. Update `.env.local`: `EXPO_PUBLIC_API_KEY=new-key`
4. Restart server

### Add New Screen
1. Create file in `app/` (e.g., `app/stats.tsx`)
2. Expo router automatically adds route
3. Link from another screen: `<Link href="/stats">Statistics</Link>`

### Switch Database
Edit `.env`:
```env
# For MongoDB
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb://admin:Trackmate1!@192.168.1.153:27018/materialTracker?authSource=admin

# For MariaDB
DATABASE_TYPE=mariadb
MARIADB_HOST=192.168.1.153
MARIADB_PORT=3306
MARIADB_DB=materialTracker
MARIADB_USER=root
MARIADB_PASSWORD=yourpassword
```

### Deploy Updates
```bash
# 1. Commit your changes
git add .
git commit -m "Add new feature"

# 2. If server changed, update on Unraid
scp server.ts root@192.168.1.153:/mnt/user/appdata/materialtracker/
ssh root@192.168.1.153 "cd /mnt/user/appdata/materialtracker && npm install && pm2 restart materialtracker"

# 3. If app changed, rebuild
npm start
# Users can refresh browser or update Expo Go app
```

## Security Reminders

✅ **DONE - Already Configured:**
- API key authentication enabled
- Database credentials secured in `.env`
- `.env` and `.env.local` in `.gitignore` (won't be committed)

⚠️ **For Production Use:**
- [ ] Set `ALLOWED_ORIGINS` in `.env` to your specific domains
- [ ] Use HTTPS with a reverse proxy (Nginx Proxy Manager)
- [ ] Configure Unraid firewall to restrict port 3001 access
- [ ] Set up regular backups of your PostgreSQL database
- [ ] Rotate API key periodically

See `notes/80-security-setup.md` for the complete security checklist.

## Getting Help

1. **Check Documentation:**
   - `notes/` folder has detailed guides
   - `README.md` has quick reference

2. **Common Issues:**
   - Server won't start: Check `.env` exists and has correct database credentials
   - CORS errors: Add your domain to `ALLOWED_ORIGINS` in `.env`
   - Authentication errors: Verify API key matches in `.env` and `.env.local`
   - Can't connect to Unraid: Check firewall and database is running

3. **Next Steps:**
   - Try adding your first material
   - Test offline mode (disconnect network, add material, reconnect)
   - Explore color search (add materials with different colors, search for "blue")
   - Check `ROADMAP.md` for future enhancements

## Quick Command Reference

```bash
# Development
npm start                    # Start mobile/web app
npm run server              # Start API server (with auto-reload)
npm run server:prod         # Start API server (production)

# Testing
npx expo start --web        # Force web mode
npx expo start --android    # Force Android
npx expo start --ios        # Force iOS (macOS only)

# TypeScript
npx tsc --noEmit           # Check frontend types
npx tsc -p tsconfig.server.json --noEmit  # Check server types

# Database
npm run server              # Server auto-creates tables on first run
```

## Your Database Connection String
```
postgresql://postgres:postgres@192.168.1.153:5433/materialTracker
```

## Your API Endpoint
```
http://192.168.1.153:3001/api
```

---

**You're all set!** 🎉

Start with `npm start` and `npm run server` in two terminals, then open `http://localhost:8081` in your browser to see your app running.

Your data is being securely stored on your Unraid server at `192.168.1.153`.
