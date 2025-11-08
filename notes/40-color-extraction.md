# Color Extraction & Classification

## Phase 1 (Current MVP)
### Web Platform
- Uses HTML Canvas API to load the image, downsample pixels.
- Applies a simple k-means clustering to pick N dominant colors.
- Maps each RGB color to a semantic bucket (red, green, blue, yellow, orange, purple, pink, gray, white, black) using basic hue/lightness thresholds.

### Native Platform (iOS/Android)
- Palette extraction on native is more complex (requires native image processing or third-party library like react-native-image-colors).
- For MVP, we skip automatic extraction. Users can manually tag colors (future feature) or rely on name/location search only.

## Mapping RGB to Color Names
In `src/utils/colors.ts`, `rgbToColorName()` uses:
- **Grayscale detection**: if max–min < 30, classify by lightness (black/gray/white).
- **Hue-based**: compute HSV hue angle, then map ranges to basic color names.

This is a **heuristic** approach. For better accuracy, use a color dictionary or AI.

## Phase 2 (Roadmap)
- Integrate an edge function or on-device ML model for consistent palette extraction on all platforms.
- Use a trained model or API (e.g., OpenAI Vision, Google Cloud Vision) to assign semantic labels ("forest green", "coral pink").
- Store these labels in `colors[].name` for richer search.

## Search by Color
When a user types "green" in search, we:
1. Call `toBuckets()` on each material's palette.
2. Check if any bucket name contains "green".
3. Return matching materials.

This enables intuitive color-based filtering without complex image analysis at query time.

---
