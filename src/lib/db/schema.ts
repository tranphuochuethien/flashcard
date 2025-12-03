import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const vocabulary = sqliteTable('vocabulary', {
  id: integer('id').primaryKey(),
  kanji: text('kanji').notNull(),
  hiragana: text('hiragana').notNull(),
  hanViet: text('han_viet').notNull(),
  vietnameseMeaning: text('vietnamese_meaning').notNull(),
  itContext: text('it_context'),
  createdAt: text('created_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
