// Server-side database adapter for MongoDB
// This runs ONLY on the server (API routes), never on client

import { MongoClient, Db, Collection } from 'mongodb';
import type { Material } from '../types';
import type { ServerConfig } from '../config/server';

let client: MongoClient | null = null;
let db: Db | null = null;
let materialsCollection: Collection | null = null;

export async function initMongoDB(config: ServerConfig['mongodb']) {
  if (!config) throw new Error('MongoDB config missing');

  client = new MongoClient(config.uri);
  await client.connect();
  
  db = client.db();
  materialsCollection = db.collection('materials');

  // Create indexes
  await materialsCollection.createIndex({ name: 1 });
  await materialsCollection.createIndex({ createdAt: -1 });
}

export async function saveMaterialMongo(material: Material): Promise<void> {
  if (!materialsCollection) throw new Error('MongoDB not initialized');

  await materialsCollection.updateOne(
    { id: material.id },
    { $set: material },
    { upsert: true }
  );
}

export async function getAllMaterialsMongo(): Promise<Material[]> {
  if (!materialsCollection) throw new Error('MongoDB not initialized');

  const materials = await materialsCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return materials as unknown as Material[];
}

export async function getMaterialByIdMongo(id: string): Promise<Material | null> {
  if (!materialsCollection) throw new Error('MongoDB not initialized');

  const material = await materialsCollection.findOne({ id });
  return material as unknown as Material | null;
}

export async function deleteMaterialMongo(id: string): Promise<void> {
  if (!materialsCollection) throw new Error('MongoDB not initialized');
  await materialsCollection.deleteOne({ id });
}

export async function closeMongoDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    materialsCollection = null;
  }
}
