// Server-side database adapter for MariaDB/MySQL
// This runs ONLY on the server (API routes), never on client

import mysql from 'mysql2/promise';
import type { Material } from '../types';
import type { ServerConfig } from '../config/server';

let pool: mysql.Pool | null = null;

export function initMariaDB(config: ServerConfig['mariadb']) {
  if (!config) throw new Error('MariaDB config missing');

  pool = mysql.createPool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

export async function ensureSchemaMariaDB() {
  if (!pool) throw new Error('MariaDB not initialized');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS materials (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(500) NOT NULL,
      location VARCHAR(500),
      image_uri TEXT,
      colors JSON,
      created_at BIGINT,
      updated_at BIGINT,
      notes TEXT
    )
  `);

  // Create indexes
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_materials_name ON materials (name);
    CREATE INDEX IF NOT EXISTS idx_materials_created_at ON materials (created_at DESC);
  `);
}

export async function saveMaterialMariaDB(material: Material): Promise<void> {
  if (!pool) throw new Error('MariaDB not initialized');

  await pool.query(
    `INSERT INTO materials (id, name, location, image_uri, colors, created_at, updated_at, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       location = VALUES(location),
       image_uri = VALUES(image_uri),
       colors = VALUES(colors),
       updated_at = VALUES(updated_at),
       notes = VALUES(notes)`,
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

export async function getAllMaterialsMariaDB(): Promise<Material[]> {
  if (!pool) throw new Error('MariaDB not initialized');

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM materials ORDER BY created_at DESC'
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    location: row.location,
    imageUri: row.image_uri,
    colors: typeof row.colors === 'string' ? JSON.parse(row.colors) : row.colors || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: row.notes,
  }));
}

export async function getMaterialByIdMariaDB(id: string): Promise<Material | null> {
  if (!pool) throw new Error('MariaDB not initialized');

  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    'SELECT * FROM materials WHERE id = ?',
    [id]
  );

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    imageUri: row.image_uri,
    colors: typeof row.colors === 'string' ? JSON.parse(row.colors) : row.colors || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: row.notes,
  };
}

export async function deleteMaterialMariaDB(id: string): Promise<void> {
  if (!pool) throw new Error('MariaDB not initialized');
  await pool.query('DELETE FROM materials WHERE id = ?', [id]);
}

export async function closeMariaDB() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
