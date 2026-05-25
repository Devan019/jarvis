import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  task: text('task').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  date: text('date').notNull().default(sql`CURRENT_TIMESTAMP`),
  timestamp: integer('timestamp').notNull().default(sql`(strftime('%s', CURRENT_TIMESTAMP))`),
});