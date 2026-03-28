import { pgTable, uuid, text, boolean, timestamp, jsonb, pgEnum, integer } from 'drizzle-orm/pg-core';

export const pageTypeEnum = pgEnum('page_type', [
  'scratch',
  'rightnow',
  'todo',
  'story',
  'kanban',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').unique().notNull(),
  email: text('email'),
  passwordHash: text('password_hash').notNull(),
  theme: text('theme').default('dark'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pages = pgTable('pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  title: text('title').notNull().default('Untitled'),
  type: pageTypeEnum('type').notNull(),
  content: jsonb('content').default({}),
  sortOrder: integer('sort_order').default(0),
  isPinned: boolean('is_pinned').default(false),
  isDeleted: boolean('is_deleted').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
