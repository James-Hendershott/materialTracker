# Server Architecture & Database Integration

## Overview
The app now supports **server-side storage** on your Unraid server with three database options:
- **PostgreSQL** (recommended)
- **MongoDB**
- **MariaDB/MySQL**

Data is stored on your Unraid server, with local SQLite acting as an offline cache.

## Architecture

```
┌─────────────────┐
│   Mobile/Web    │
│     Client      │
└────────┬────────┘
         │
         │ HTTP API
         │
┌────────▼────────┐      ┌─────────────┐
│  Express API    │◄────►│   Unraid    │
│    Server       │      │  Databases  │
│  (server.ts)    │      ├─────────────┤
└─────────────────┘      │ PostgreSQL  │
                         │   MongoDB   │
                         │   MariaDB   │
                         └─────────────┘
```

## Offline-First Strategy
1. **Write**: Save to local SQLite immediately, then sync to server in background
2. **Read**: Fetch from server, update local cache, fallback to cache if offline
3. **Images**: Upload to server, fallback to local file:// URIs

## Database Setup on Unraid

### Option 1: PostgreSQL (Recommended)

1. Install PostgreSQL container from Community Applications
2. Create database and user:
```sql
CREATE DATABASE materialtracker;
CREATE USER materialtracker_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE materialtracker TO materialtracker_user;
```

3. Update `.env.local`:
```env
DATABASE_TYPE=postgres
POSTGRES_HOST=192.168.1.xxx
POSTGRES_PORT=5432
POSTGRES_DB=materialtracker
POSTGRES_USER=materialtracker_user
POSTGRES_PASSWORD=your_secure_password
```

### Option 2: MongoDB

1. Install MongoDB container
2. Update `.env.local`:
```env
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb://192.168.1.xxx:27017/materialtracker
```

### Option 3: MariaDB

1. Install MariaDB container
2. Create database:
```sql
CREATE DATABASE materialtracker;
CREATE USER 'materialtracker_user'@'%' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON materialtracker.* TO 'materialtracker_user'@'%';
FLUSH PRIVILEGES;
```

3. Update `.env.local`:
```env
DATABASE_TYPE=mariadb
MARIADB_HOST=192.168.1.xxx
MARIADB_PORT=3306
MARIADB_DB=materialtracker
MARIADB_USER=materialtracker_user
MARIADB_PASSWORD=your_secure_password
```

## Running the Server

### Development (on your Unraid server or local machine)
```bash
npm run server
```

### Production
```bash
npm run server:prod
```

Or use PM2 for process management:
```bash
npm i -g pm2
pm2 start server.ts --name material-tracker-api
pm2 save
pm2 startup
```

## Client Configuration

Update the Expo app to use your server by creating `.env.local`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.xxx:3001/api
EXPO_PUBLIC_USE_SERVER=true
```

For local-only mode:
```env
EXPO_PUBLIC_USE_SERVER=false
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/materials` - Get all materials
- `GET /api/materials/:id` - Get single material
- `POST /api/materials` - Create/update material
- `DELETE /api/materials/:id` - Delete material
- `POST /api/upload` - Upload image
- `GET /images/:filename` - Serve uploaded images

## Image Storage

Images are stored in `uploads/` directory on the server. Configure the path:

```env
UPLOAD_DIR=/mnt/user/appdata/material-tracker/uploads
```

## Security Considerations

1. **Firewall**: Restrict API access to local network only
2. **Authentication**: Add JWT auth for production (future enhancement)
3. **HTTPS**: Use reverse proxy (nginx/Caddy) with SSL certificate
4. **Backups**: Regular database backups via Unraid

## Deployment Options

### Option A: Run on Unraid
1. Create a custom Docker container with Node.js
2. Mount volumes for uploads and config
3. Use Unraid's reverse proxy for SSL

### Option B: Run on Local Dev Machine
1. VPN into home network
2. Use dynamic DNS for remote access
3. Run server with `npm run server`

### Option C: Hybrid
1. Server on Unraid for home network
2. SQLite fallback when away from home
3. Sync when reconnected

---
