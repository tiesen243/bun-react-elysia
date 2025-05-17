import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'

import * as schema from '@/server/db/schema'

const sql = new Database('sqlite.db')
export const db = drizzle({ client: sql, schema })
