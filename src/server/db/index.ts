import { drizzle } from 'drizzle-orm/postgres-js'

import * as schema from '@/server/db/schema'

const { DATABASE_URL, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } =
  process.env
const POSTGRES_PORT =
  process.env.NODE_ENV === 'production' ? 'postgres' : 'localhost'

const databaseUrl =
  DATABASE_URL ??
  `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_PORT}:5432/${POSTGRES_DB}`

export const db = drizzle(databaseUrl, {
  schema,
  casing: 'snake_case',
})
