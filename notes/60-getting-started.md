# Getting Started & Testing

## Running the App

### 1. Install Dependencies
```sh
npm install
```

### 2. Start Dev Server
```sh
npm start
```

This opens the Expo Developer Tools in your terminal. From here:
- Press **`w`** to open in your web browser (instant preview)
- Scan the QR code with Expo Go app on your phone (iOS/Android)
- Press **`a`** for Android emulator
- Press **`i`** for iOS simulator (macOS only)

### 3. Platform-Specific Commands
```sh
npm run web      # Launch in browser
npm run android  # Launch Android
npm run ios      # Launch iOS (macOS)
```

## What to Try
1. **Home Screen**: Click "Add Material"
2. **Add Material**: 
   - Fill in name, location, notes
   - Click "Take Photo" or "Choose Image"
   - On web, color extraction will run automatically
   - Click "Save"
3. **Search**: Type a color name (e.g., "green", "blue") or material name
4. **Detail**: Click any material card to see details and color chips

## Testing Color Extraction (Web Only for MVP)
- Upload an image with distinct colors (e.g., a multicolor yarn skein)
- After saving, go to Search and type a color keyword
- The material should appear if that color was detected

## TypeScript Checks
```sh
npx tsc --noEmit
```

## Debugging Tips
- Check the terminal for any Metro bundler errors
- Use Chrome DevTools for web (F12)
- Expo Go app shows runtime errors and logs
- Check `console.log` statements in Metro output

## Known Limitations (MVP)
- Native color extraction not yet implemented (manual tagging coming soon)
- No cloud sync yet
- No batch upload
- Basic UI without theming

See `ROADMAP.md` for planned improvements.

---
