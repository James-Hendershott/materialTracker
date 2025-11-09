# Testing Material Tracker on iPhone with Expo Go

## Architecture Overview

```
┌─────────────────┐
│  iPhone with    │ ← Expo Go app
│    Expo Go      │ ← Scans QR code
└────────┬────────┘
         │ WiFi (same network)
         │ http://192.168.1.66:3001
┌────────▼────────┐
│  Your Computer  │ ← npm start (Expo Metro)
│  192.168.1.66   │ ← npm run server (API on port 3001)
└────────┬────────┘
         │ Network connection
         │ postgres://192.168.1.153:5433
┌────────▼────────┐
│  Unraid Server  │ ← PostgreSQL database
│  192.168.1.153  │ ← Port 5433
└─────────────────┘
```

## Step-by-Step Testing Guide

### 1. Start the API Server (Terminal 1)
This connects to your Unraid PostgreSQL and provides API endpoints:

```bash
npm run server
```

**Expected output:**
```
🚀 Material Tracker API server running on port 3001
📁 Upload directory: ./uploads
🗄️  Database type: postgres
```

**Keep this terminal running!**

### 2. Start Expo Development Server (Terminal 2)
This serves your React Native app:

```bash
npm start
```

**Expected output:**
```
› Metro waiting on exp://192.168.1.66:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

**Keep this terminal running too!**

### 3. Connect Your iPhone

#### Make Sure:
- ✅ iPhone and computer are on the **same WiFi network**
- ✅ Expo Go app is installed on your iPhone (download from App Store)
- ✅ Both terminals from steps 1-2 are running

#### Option A: QR Code (Easiest)
1. Open **Expo Go** app on your iPhone
2. Tap "Scan QR Code"
3. Point camera at the QR code in Terminal 2
4. App will download and launch!

#### Option B: Manual URL
1. Open **Expo Go** app
2. Tap "Enter URL manually"
3. Type: `exp://192.168.1.66:8081`
4. Tap "Connect"

### 4. Test the App

Once the app loads on your iPhone:

#### Test 1: Add a Material
1. Tap "Add Material" button
2. Tap "Take Photo" or "Choose from Library"
3. Take/select a photo of colorful fabric or yarn
4. Fill in:
   - Name: "Red Yarn"
   - Location: "Shelf A"
   - Notes: "Test material"
5. Tap "Save"

#### Test 2: View Materials
1. Go back to Home screen
2. You should see your new material listed
3. Tap on it to view details

#### Test 3: Search
1. Tap "Search" button
2. Try searching by:
   - Name: "Red"
   - Color: "red"
3. Your material should appear in results

#### Test 4: Verify Server Storage
Back on your computer, check that data is in Unraid:

```bash
# Test API endpoint
curl -H "x-api-key: 7f0dccba96f701c81c3d48cef7b4b15dda6764a76b659ebed5dc38f930e88159" http://localhost:3001/api/materials
```

You should see your material in JSON format!

### 5. Troubleshooting

#### "Unable to connect to server"
- Check both terminals are still running
- Verify your computer IP: `ipconfig` (should be 192.168.1.66)
- Make sure firewall isn't blocking port 3001:
  ```powershell
  # Allow port 3001 through Windows Firewall
  New-NetFirewallRule -DisplayName "Material Tracker API" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
  ```

#### "Cannot connect to Expo"
- Ensure iPhone and computer are on same WiFi
- Try restarting Expo: press `r` in Terminal 2
- Check Expo Go app is latest version

#### "API Error" or "Failed to save"
- Check Terminal 1 (server) for error messages
- Verify `.env` has correct Unraid credentials
- Test database connection:
  ```bash
  curl http://localhost:3001/health
  # Should return: {"status":"ok","timestamp":...}
  ```

#### "Authentication Error"
- Check API key matches in `.env` and `.env.local`
- Look for typos or extra spaces

### 6. Development Tips

#### Hot Reload
- Changes to React components reload automatically
- Shake your iPhone to open Developer Menu
- Tap "Reload" to force refresh

#### Debugging
In Terminal 2, press:
- `j` - Open debugger
- `r` - Reload app
- `m` - Toggle menu
- `shift+m` - More options

#### Console Logs
- All `console.log()` output appears in Terminal 2
- Errors show on your iPhone screen

### 7. When You're Done Testing

Stop both servers:
- Terminal 1 (API): Press `Ctrl+C`
- Terminal 2 (Expo): Press `Ctrl+C`

Your data is safely stored in Unraid PostgreSQL!

## Next Steps

### Deploy API to Unraid (Optional)
Once testing is successful, you can deploy the API server to Unraid so you don't need your computer running:

1. Copy project files to Unraid
2. Update `.env` on Unraid (use `192.168.1.153` for all hosts)
3. Run with Docker or PM2
4. Update `.env.local` to point to Unraid: `EXPO_PUBLIC_API_URL=http://192.168.1.153:3001/api`

See `SETUP_UNRAID.md` for deployment guide.

### Production Mode
For daily use without development mode:

```bash
# Build production version
npx expo export

# Deploy to Expo servers (free tier)
npx expo publish
```

Then your app works without needing `npm start` running!

## Port Reference

| Service | Host | Port | Purpose |
|---------|------|------|---------|
| PostgreSQL | 192.168.1.153 | 5433 | Database storage |
| API Server | 192.168.1.66 | 3001 | REST endpoints |
| Expo Metro | 192.168.1.66 | 8081 | Development server |
| Image Upload | 192.168.1.66 | 3001 | File storage endpoint |

## Security Notes

**Development (Current Setup):**
- ✅ API key required for all requests
- ⚠️ HTTP only (no HTTPS)
- ⚠️ Computer must be on same network as phone

**Production (When Deployed to Unraid):**
- ✅ Use HTTPS with reverse proxy
- ✅ Restrict CORS to your domain
- ✅ Keep API key secret
- ✅ Enable rate limiting

---

Happy Testing! 🎨📱
