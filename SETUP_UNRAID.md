# Quick Setup Guide - Unraid Server Integration

## 🎯 Goal
Get your Material Tracker app storing data on your Unraid server instead of just locally.

## 📋 Prerequisites
- Unraid server with Docker support
- Network access between your devices and Unraid
- PostgreSQL, MongoDB, or MariaDB container on Unraid

---

## 🚀 5-Minute Setup

### Step 1: Choose Your Database

Pick ONE of these options based on what you already have on Unraid:

#### Option A: PostgreSQL (Recommended)
```bash
# On Unraid, install PostgreSQL from Community Applications
# Then create the database:
docker exec -it postgres psql -U postgres
CREATE DATABASE materialtracker;
CREATE USER materialtracker_user WITH PASSWORD 'YourSecurePassword123';
GRANT ALL PRIVILEGES ON DATABASE materialtracker TO materialtracker_user;
\q
```

#### Option B: MongoDB
```bash
# Just install MongoDB from Community Applications
# Database will be created automatically
```

#### Option C: MariaDB
```bash
# Install MariaDB from Community Applications
docker exec -it mariadb mysql -u root -p
CREATE DATABASE materialtracker;
CREATE USER 'materialtracker_user'@'%' IDENTIFIED BY 'YourSecurePassword123';
GRANT ALL PRIVILEGES ON materialtracker.* TO 'materialtracker_user'@'%';
FLUSH PRIVILEGES;
exit;
```

---

### Step 2: Deploy API Server on Unraid

#### Method 1: Docker Compose (Easiest)

1. **Create project folder** on Unraid:
   ```bash
   mkdir -p /mnt/user/appdata/materialtracker
   cd /mnt/user/appdata/materialtracker
   ```

2. **Copy files** from your dev machine:
   - `docker-compose.yml`
   - `Dockerfile`
   - `server.ts`
   - `src/` folder
   - `package.json`
   - `tsconfig.json`

3. **Create `.env` file**:
   ```env
   POSTGRES_PASSWORD=YourSecurePassword123
   ```

4. **Start services**:
   ```bash
   docker-compose up -d
   ```

#### Method 2: Node.js Directly

1. **Install Node.js** on Unraid (if not already):
   ```bash
   # Install from Community Applications or use nerdpack
   ```

2. **Copy project files** to `/mnt/user/appdata/materialtracker`

3. **Create `.env.local`**:
   ```env
   DATABASE_TYPE=postgres
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=materialtracker
   POSTGRES_USER=materialtracker_user
   POSTGRES_PASSWORD=YourSecurePassword123
   PORT=3001
   UPLOAD_DIR=/mnt/user/appdata/materialtracker/uploads
   ```

4. **Install & run**:
   ```bash
   npm install
   npm run server
   ```

---

### Step 3: Configure Mobile/Web App

On your **development machine** (Windows):

1. **Edit `.env.local`** in the project root:
   ```env
   EXPO_PUBLIC_API_URL=http://YOUR_UNRAID_IP:3001/api
   EXPO_PUBLIC_USE_SERVER=true
   ```
   
   Replace `YOUR_UNRAID_IP` with your Unraid server's IP (e.g., `192.168.1.100`)

2. **Restart the Expo app**:
   ```powershell
   npm start
   ```

---

## ✅ Test It

1. **Open the web app**: Press `w` in Expo terminal
2. **Add a material**: Upload an image, fill in details
3. **Check Unraid**: 
   ```bash
   # Check if data arrived
   docker exec -it postgres psql -U materialtracker_user -d materialtracker
   SELECT * FROM materials;
   ```

---

## 🔍 Troubleshooting

### Can't Connect to Server
```bash
# Test API health
curl http://YOUR_UNRAID_IP:3001/health

# Check server logs
docker-compose logs api
```

### Images Not Uploading
- Check `uploads/` folder permissions
- Verify firewall allows port 3001
- Check CORS settings in `server.ts`

### Database Connection Failed
- Verify database container is running: `docker ps`
- Check credentials in `.env.local`
- Test database connection manually

---

## 🎓 What You Just Did

```
BEFORE                           AFTER
┌──────────┐                    ┌──────────┐
│  Phone   │                    │  Phone   │◄─┐
└──────────┘                    └──────────┘  │
     ↓                                ↓        │
┌──────────┐                    ┌──────────┐  │ sync
│  SQLite  │                    │  SQLite  │  │
│  Local   │                    │  Cache   │  │
└──────────┘                    └──────────┘  │
                                       ↓       │
                                ┌──────────────▼───┐
                                │   Unraid Server  │
                                ├──────────────────┤
                                │  API (port 3001) │
                                │  PostgreSQL DB   │
                                │  Image Storage   │
                                └──────────────────┘
```

Now all your devices sync to one central database!

---

## 🔐 Security Notes

1. **Firewall**: Only allow port 3001 from your local network
2. **Passwords**: Use strong passwords in `.env` files
3. **Backup**: Set up automated database backups
4. **HTTPS**: For remote access, add SSL via reverse proxy

---

## 📚 Next Steps

- Read `notes/70-server-architecture.md` for detailed info
- Set up automated backups
- Add authentication (future feature)
- Configure HTTPS for remote access

---

**Need Help?** Check the logs:
```bash
# API server logs
docker-compose logs -f api

# Database logs
docker-compose logs -f postgres
```
