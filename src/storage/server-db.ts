// Unified server API - routes requests to the appropriate database
// This provides a consistent interface regardless of DB choice

import type { Material } from '../types';
import { loadServerConfig } from '../config/server';

// PostgreSQL
import {
  initPostgres,
  ensureSchema as ensureSchemaPG,
  saveMaterialPG,
  getAllMaterialsPG,
  getMaterialByIdPG,
  deleteMaterialPG,
} from './postgres';

// MongoDB
import {
  initMongoDB,
  saveMaterialMongo,
  getAllMaterialsMongo,
  getMaterialByIdMongo,
  deleteMaterialMongo,
} from './mongodb';

// MariaDB
import {
  initMariaDB,
  ensureSchemaMariaDB,
  saveMaterialMariaDB,
  getAllMaterialsMariaDB,
  getMaterialByIdMariaDB,
  deleteMaterialMariaDB,
} from './mariadb';

let initialized = false;

export async function initServerDatabase() {
  if (initialized) return;

  const config = loadServerConfig();

  switch (config.databaseType) {
    case 'postgres':
      if (config.postgres) {
        initPostgres(config.postgres);
        await ensureSchemaPG();
      }
      break;
    case 'mongodb':
      if (config.mongodb) {
        await initMongoDB(config.mongodb);
      }
      break;
    case 'mariadb':
      if (config.mariadb) {
        initMariaDB(config.mariadb);
        await ensureSchemaMariaDB();
      }
      break;
    default:
      throw new Error('No valid database configuration found');
  }

  initialized = true;
}

export async function saveMaterialServer(material: Material): Promise<void> {
  const config = loadServerConfig();

  switch (config.databaseType) {
    case 'postgres':
      return saveMaterialPG(material);
    case 'mongodb':
      return saveMaterialMongo(material);
    case 'mariadb':
      return saveMaterialMariaDB(material);
    default:
      throw new Error('No database configured');
  }
}

export async function getAllMaterialsServer(): Promise<Material[]> {
  const config = loadServerConfig();

  switch (config.databaseType) {
    case 'postgres':
      return getAllMaterialsPG();
    case 'mongodb':
      return getAllMaterialsMongo();
    case 'mariadb':
      return getAllMaterialsMariaDB();
    default:
      throw new Error('No database configured');
  }
}

export async function getMaterialByIdServer(id: string): Promise<Material | null> {
  const config = loadServerConfig();

  switch (config.databaseType) {
    case 'postgres':
      return getMaterialByIdPG(id);
    case 'mongodb':
      return getMaterialByIdMongo(id);
    case 'mariadb':
      return getMaterialByIdMariaDB(id);
    default:
      throw new Error('No database configured');
  }
}

export async function deleteMaterialServer(id: string): Promise<void> {
  const config = loadServerConfig();

  switch (config.databaseType) {
    case 'postgres':
      return deleteMaterialPG(id);
    case 'mongodb':
      return deleteMaterialMongo(id);
    case 'mariadb':
      return deleteMaterialMariaDB(id);
    default:
      throw new Error('No database configured');
  }
}
