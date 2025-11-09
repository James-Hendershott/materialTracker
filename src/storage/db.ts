// Client-side storage layer with server sync and local fallback
import * as SQLite from 'expo-sqlite';
import { Material } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

// Configuration - set this to your Unraid server URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';
const USE_SERVER = process.env.EXPO_PUBLIC_USE_SERVER !== 'false'; // Default to true
const API_KEY = process.env.EXPO_PUBLIC_API_KEY; // Optional: set in .env.local

// Local SQLite database (fallback and cache)
export function openDB() {
  if (!db) {
    db = SQLite.openDatabaseSync('materials.db');
    db.execSync(`CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      name TEXT,
      location TEXT,
      imageUri TEXT,
      colors TEXT,
      createdAt INTEGER,
      updatedAt INTEGER,
      notes TEXT,
      synced INTEGER DEFAULT 0
    )`);
  }
  return db;
}

// Helper: Save to local SQLite
function saveLocalMaterial(m: Material, synced: boolean = false) {
  const database = openDB();
  database.runSync(
    'INSERT OR REPLACE INTO materials (id, name, location, imageUri, colors, createdAt, updatedAt, notes, synced) VALUES (?,?,?,?,?,?,?,?,?)',
    [m.id, m.name, m.location, m.imageUri, JSON.stringify(m.colors), m.createdAt, m.updatedAt, m.notes, synced ? 1 : 0]
  );
}

// Helper: Get from local SQLite
function getLocalMaterials(): Material[] {
  const database = openDB();
  const rows = database.getAllSync('SELECT * FROM materials ORDER BY createdAt DESC') as any[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    location: r.location,
    imageUri: r.imageUri,
    colors: JSON.parse(r.colors || '[]'),
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    notes: r.notes,
  }));
}

// Helper: Server API call with error handling
async function fetchAPI(endpoint: string, options?: RequestInit) {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers as Record<string, string>,
    };
    
    // Add API key if configured
    if (API_KEY) {
      headers['x-api-key'] = API_KEY;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Server API error:', error);
    throw error;
  }
}

// ===== Public API =====

export async function saveMaterial(m: Material) {
  // Always save locally first
  saveLocalMaterial(m, false);

  if (USE_SERVER) {
    try {
      await fetchAPI('/materials', {
        method: 'POST',
        body: JSON.stringify(m),
      });
      // Mark as synced
      saveLocalMaterial(m, true);
    } catch (error) {
      console.warn('Failed to sync to server, saved locally only');
    }
  }
}

export async function getAllMaterials(): Promise<Material[]> {
  if (USE_SERVER) {
    try {
      const materials = await fetchAPI('/materials');
      // Update local cache
      materials.forEach((m: Material) => saveLocalMaterial(m, true));
      return materials;
    } catch (error) {
      console.warn('Failed to fetch from server, using local cache');
    }
  }
  
  // Fallback to local
  return getLocalMaterials();
}

export async function getMaterialById(id: string): Promise<Material | null> {
  if (USE_SERVER) {
    try {
      const material = await fetchAPI(`/materials/${id}`);
      saveLocalMaterial(material, true);
      return material;
    } catch (error) {
      console.warn('Failed to fetch from server, using local cache');
    }
  }

  // Fallback to local
  const database = openDB();
  const row = database.getFirstSync('SELECT * FROM materials WHERE id = ?', [id]) as any;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    imageUri: row.imageUri,
    colors: JSON.parse(row.colors || '[]'),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    notes: row.notes,
  };
}

export async function deleteMaterial(id: string) {
  // Delete locally
  const database = openDB();
  database.runSync('DELETE FROM materials WHERE id = ?', [id]);

  if (USE_SERVER) {
    try {
      await fetchAPI(`/materials/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.warn('Failed to delete from server');
    }
  }
}

// Upload image to server
export async function uploadImage(uri: string): Promise<string> {
  if (!USE_SERVER) return uri; // Use local URI if no server

  try {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'image.jpg';
    
    // @ts-ignore - FormData append with file works in React Native
    formData.append('image', {
      uri,
      name: filename,
      type: 'image/jpeg',
    });

    const headers: Record<string, string> = {};
    if (API_KEY) {
      headers['x-api-key'] = API_KEY;
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    
    const result = await response.json();
    return `${API_BASE_URL.replace('/api', '')}${result.url}`;
  } catch (error) {
    console.warn('Failed to upload image, using local URI');
    return uri;
  }
}
