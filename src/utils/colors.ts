// Simple color extraction & bucketing for MVP.

import { ColorRGB } from '../types';

// Extract 'count' dominant colors via canvas on web. Native uses manual selection (future).
export function extractPaletteWeb(imageUri: string, count: number): Promise<ColorRGB[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('No canvas context'));
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);
      const imgData = ctx.getImageData(0, 0, size, size);
      const pixels = imgData.data;
      // Downsample to 1/4 for speed
      const samples: [number, number, number][] = [];
      for (let i = 0; i < pixels.length; i += 16) {
        samples.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
      }
      // k-means (simple approach) or we pick the first N unique colors. For MVP: cluster top N.
      const palette = simplePaletteKMeans(samples, count);
      resolve(palette);
    };
    img.onerror = reject;
    img.src = imageUri;
  });
}

function simplePaletteKMeans(samples: [number, number, number][], k: number): ColorRGB[] {
  if (!samples.length) return [];
  // Random init
  let centroids = samples.slice(0, k).map((s) => [...s] as [number, number, number]);
  const maxIter = 10;
  for (let iter = 0; iter < maxIter; iter++) {
    const clusters: [number, number, number][][] = Array.from({ length: k }, () => []);
    for (const s of samples) {
      let best = 0;
      let bestDist = dist(s, centroids[0]);
      for (let i = 1; i < k; i++) {
        const d = dist(s, centroids[i]);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      clusters[best].push(s);
    }
    centroids = clusters.map((c) => {
      if (!c.length) return centroids[0];
      const avg = c.reduce((acc, col) => [acc[0] + col[0], acc[1] + col[1], acc[2] + col[2]], [0, 0, 0]);
      return [Math.round(avg[0] / c.length), Math.round(avg[1] / c.length), Math.round(avg[2] / c.length)] as [number, number, number];
    });
  }
  return centroids.map((c) => ({
    r: c[0],
    g: c[1],
    b: c[2],
    hex: rgbToHex(c[0], c[1], c[2])
  }));
}

function dist(a: [number, number, number], b: [number, number, number]) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

// Basic bucketing: map RGB to a semantic color keyword
export function toBuckets(colors: ColorRGB[]): { name: string; hex: string }[] {
  return colors.map((c) => ({ name: rgbToColorName(c.r, c.g, c.b), hex: c.hex }));
}

function rgbToColorName(r: number, g: number, b: number): string {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  // Grayscale
  if (max - min < 30) {
    if (lightness < 50) return 'black';
    if (lightness < 190) return 'gray';
    return 'white';
  }
  // Hue-based
  let hue = 0;
  const delta = max - min;
  if (r === max) hue = ((g - b) / delta) % 6;
  else if (g === max) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  hue *= 60;
  if (hue < 0) hue += 360;

  // Very simple hue to name
  if (hue < 15 || hue >= 345) return 'red';
  if (hue < 45) return 'orange';
  if (hue < 75) return 'yellow';
  if (hue < 165) return 'green';
  if (hue < 255) return 'blue';
  if (hue < 300) return 'purple';
  return 'pink';
}

export function searchByColor(materials: any[], query: string): any[] {
  const lowerQuery = query.toLowerCase();
  return materials.filter((m) => {
    const buckets = toBuckets(m.colors);
    return buckets.some((b) => b.name.includes(lowerQuery));
  });
}
