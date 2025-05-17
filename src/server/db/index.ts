import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from '@/server/db/schema'

export const db = drizzle(process.env.DATABASE_URL ?? '', {
  schema,
  casing: 'snake_case',
})
