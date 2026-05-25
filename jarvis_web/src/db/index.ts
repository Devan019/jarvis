import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const db_url = process.env.DATABASE_URL;

if(!db_url) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// 'file:jarvis.db' tells libSQL to create a local SQLite file right in your project folder
const client = createClient({
  url: db_url,
});

// We pass the schema here so we get full TypeScript autocompletion when querying
export const db = drizzle(client, { schema });