import * as SQLite from 'expo-sqlite';
import { Material } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

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
      notes TEXT
    )`);
  }
  return db;
}

export async function saveMaterial(m: Material) {
  const database = openDB();
  database.runSync(
    'INSERT OR REPLACE INTO materials (id, name, location, imageUri, colors, createdAt, updatedAt, notes) VALUES (?,?,?,?,?,?,?,?)',
    [m.id, m.name, m.location, m.imageUri, JSON.stringify(m.colors), m.createdAt, m.updatedAt, m.notes]
  );
}

export function getAllMaterials(): Material[] {
  const database = openDB();
  const rows = database.getAllSync('SELECT * FROM materials ORDER BY createdAt DESC') as any[];
  return rows.map((r) => ({
    ...r,
    colors: JSON.parse(r.colors || '[]')
  }));
}

export function getMaterialById(id: string): Material | null {
  const database = openDB();
  const row = database.getFirstSync('SELECT * FROM materials WHERE id = ?', [id]) as any;
  if (!row) return null;
  return { ...row, colors: JSON.parse(row.colors || '[]') };
}

export function deleteMaterial(id: string) {
  const database = openDB();
  database.runSync('DELETE FROM materials WHERE id = ?', [id]);
}
