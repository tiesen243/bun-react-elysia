import { sqliteTable } from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable('post', (t) => ({
  id: t
    .integer()
    .$default(() => Date.now())
    .primaryKey()
    .notNull(),
  title: t.text().notNull(),
  content: t.text().notNull(),
}))
