import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://career_user:career_password@postgres-service:5432/career_loop',
})

export const db = drizzle(pool, { schema })