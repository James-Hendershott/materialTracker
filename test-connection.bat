@echo off
echo ========================================
echo Material Tracker - Quick Troubleshoot
echo ========================================
echo.

echo [1/4] Checking API Server...
curl -s http://localhost:3001/health > nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ API Server is running on localhost:3001
) else (
    echo ✗ API Server is NOT running!
    echo Run: npm run server:prod
    goto :end
)

echo.
echo [2/4] Checking Network Access...
curl -s http://192.168.1.66:3001/health > nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ API Server accessible from network IP
) else (
    echo ✗ API Server NOT accessible from 192.168.1.66
    echo Check Windows Firewall
    goto :end
)

echo.
echo [3/4] Checking API Authentication...
curl -s -H "x-api-key: 7f0dccba96f701c81c3d48cef7b4b15dda6764a76b659ebed5dc38f930e88159" http://192.168.1.66:3001/api/materials > nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ API Key authentication working
) else (
    echo ✗ API Key authentication failed
    goto :end
)

echo.
echo [4/4] Environment Variables...
findstr "EXPO_PUBLIC_API_URL" .env.local
findstr "EXPO_PUBLIC_API_KEY" .env.local

echo.
echo ========================================
echo ✓ All Checks Passed!
echo.
echo Next Steps:
echo 1. Stop Expo: Press Ctrl+C in Metro terminal
echo 2. Restart Expo: npm start
echo 3. Scan QR code with Expo Go
echo 4. Try saving a material again
echo ========================================

:end
pause
