import { defineConfig } from 'drizzle-kit'

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env
const databaseUrl = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}`

export default defineConfig({
  schema: './src/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: databaseUrl },
  casing: 'snake_case',
})
