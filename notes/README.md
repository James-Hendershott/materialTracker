# Index - Material Tracker Documentation

Welcome to the Material Tracker documentation vault! This is your central hub for understanding how the app works.

## Getting Started
- [[60-getting-started]] - How to run and test the app

## Architecture & Design
- [[00-overview]] - Project vision and high-level architecture
- [[10-stack-choices]] - Why we chose Expo, TypeScript, expo-router, etc.
- [[20-data-model]] - Database schema and TypeScript types

## Features
- [[30-navigation]] - expo-router file-based routing explained
- [[40-color-extraction]] - How color palette extraction and semantic naming works
- [[50-local-storage]] - SQLite setup and CRUD operations

## Project Files
- `CHANGELOG.md` - Version history and change log
- `ROADMAP.md` - Future features and known issues
- `README.md` - Quick start guide for developers

## Learning Path (Recommended Order)
1. Start with [[00-overview]] to understand the vision
2. Read [[10-stack-choices]] to learn why we picked this tech
3. Review [[20-data-model]] to see how data is structured
4. Follow [[60-getting-started]] to run the app
5. Dive into [[30-navigation]], [[40-color-extraction]], [[50-local-storage]] as needed

## Key Concepts to Learn
- **Expo**: React Native framework with web support and great DX
- **expo-router**: File-system based routing (like Next.js)
- **expo-sqlite**: Cross-platform SQLite database
- **expo-image-picker**: Native camera & photo library access
- **k-means clustering**: Color palette extraction algorithm
- **HSV color space**: Hue-saturation-value for color classification

## Tips for Your Wife (App User)
1. Take clear photos with good lighting for best color detection
2. Use consistent location naming (e.g., "Bin A1", "Shelf 3")
3. Add notes about material type, brand, quantity
4. Search by color works best on web (where extraction is automatic)

---
Last updated: 2025-11-08
