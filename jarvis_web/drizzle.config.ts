import { defineConfig } from 'drizzle-kit';

const db_url = process.env.DATABASE_URL;
if (!db_url) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: db_url,
  },
});