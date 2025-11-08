// Server configuration and environment variables
// This file handles loading config for server-side connections

export type DatabaseType = 'postgres' | 'mongodb' | 'mariadb' | 'local';

export interface ServerConfig {
  databaseType: DatabaseType;
  postgres?: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  mongodb?: {
    uri: string;
  };
  mariadb?: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  imageUploadUrl?: string;
  imageBaseUrl?: string;
}

// Load from environment variables (for Node.js/API routes)
export function loadServerConfig(): ServerConfig {
  // Check if we're in a Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    const dbType = (process.env.DATABASE_TYPE as DatabaseType) || 'local';
    
    const config: ServerConfig = {
      databaseType: dbType,
      imageUploadUrl: process.env.IMAGE_UPLOAD_URL,
      imageBaseUrl: process.env.IMAGE_BASE_URL,
    };

    if (dbType === 'postgres' && process.env.POSTGRES_HOST) {
      config.postgres = {
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        database: process.env.POSTGRES_DB || 'materialtracker',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || '',
      };
    }

    if (dbType === 'mongodb' && process.env.MONGODB_URI) {
      config.mongodb = {
        uri: process.env.MONGODB_URI,
      };
    }

    if (dbType === 'mariadb' && process.env.MARIADB_HOST) {
      config.mariadb = {
        host: process.env.MARIADB_HOST,
        port: parseInt(process.env.MARIADB_PORT || '3306'),
        database: process.env.MARIADB_DB || 'materialtracker',
        user: process.env.MARIADB_USER || 'root',
        password: process.env.MARIADB_PASSWORD || '',
      };
    }

    return config;
  }

  // Default to local for client-side
  return { databaseType: 'local' };
}

// Client-side config (hardcoded for security)
export function getClientConfig(): { apiBaseUrl?: string; imageBaseUrl?: string } {
  // In production, replace with your actual Unraid server URL
  // For now, we'll try to use local API routes
  return {
    apiBaseUrl: '/api',
    imageBaseUrl: process.env.IMAGE_BASE_URL || '/api/images',
  };
}
