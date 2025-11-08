// Server-side database adapter for PostgreSQL
// This runs ONLY on the server (API routes), never on client

import { Pool, PoolClient } from 'pg';
import type { Material } from '../types';
import type { ServerConfig } from '../config/server';

let pool: Pool | null = null;

export function initPostgres(config: ServerConfig['postgres']) {
  if (!config) throw new Error('PostgreSQL config missing');
  
  pool = new Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  return pool;
}

export async function ensureSchema() {
  if (!pool) throw new Error('PostgreSQL not initialized');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT,
      image_uri TEXT,
      colors JSONB,
      created_at BIGINT,
      updated_at BIGINT,
      notes TEXT
    )
  `);

  // Create index for faster searches
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_materials_name ON materials (name);
    CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials (created_at DESC);
  `);
}

export async function saveMaterialPG(material: Material): Promise<void> {
  if (!pool) throw new Error('PostgreSQL not initialized');

  await pool.query(
    `INSERT INTO materials (id, name, location, image_uri, colors, created_at, updated_at, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       location = EXCLUDED.location,
       image_uri = EXCLUDED.image_uri,
       colors = EXCLUDED.colors,
       updated_at = EXCLUDED.updated_at,
       notes = EXCLUDED.notes`,
    [
      material.id,
      material.name,
      material.location,
      material.imageUri,
      JSON.stringify(material.colors),
      material.createdAt,
      material.updatedAt,
      material.notes,
    ]
  );
}

export async function getAllMaterialsPG(): Promise<Material[]> {
  if (!pool) throw new Error('PostgreSQL not initialized');

  const result = await pool.query(
    'SELECT * FROM materials ORDER BY created_at DESC'
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    location: row.location,
    imageUri: row.image_uri,
    colors: row.colors || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: row.notes,
  }));
}

export async function getMaterialByIdPG(id: string): Promise<Material | null> {
  if (!pool) throw new Error('PostgreSQL not initialized');

  const result = await pool.query('SELECT * FROM materials WHERE id = $1', [id]);

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    imageUri: row.image_uri,
    colors: row.colors || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: row.notes,
  };
}

export async function deleteMaterialPG(id: string): Promise<void> {
  if (!pool) throw new Error('PostgreSQL not initialized');
  await pool.query('DELETE FROM materials WHERE id = $1', [id]);
}

export async function closePostgres() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
