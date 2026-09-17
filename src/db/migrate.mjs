/**
 * Migration script: apply schema changes directly to Neon DB.
 * Run with: node --env-file=.env src/db/migrate.mjs
 */
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
  console.log('🚀 Running schema migrations...')

  // 1. Add `location` column to mentoring_slots (if not exists)
  await sql`
    ALTER TABLE mentoring_slots
    ADD COLUMN IF NOT EXISTS location VARCHAR(256)
  `
  console.log('✅ Added location column to mentoring_slots')

  // 2. Drop old meeting_link column (if exists)
  await sql`
    ALTER TABLE mentoring_slots
    DROP COLUMN IF EXISTS meeting_link
  `
  console.log('✅ Dropped meeting_link column from mentoring_slots')

  // 3. Create session_questions table (if not exists)
  await sql`
    CREATE TABLE IF NOT EXISTS session_questions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      booking_id TEXT NOT NULL REFERENCES slot_bookings(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  console.log('✅ Created session_questions table')

  // 4. Create index on session_questions.booking_id (if not exists)
  await sql`
    CREATE INDEX IF NOT EXISTS session_questions_booking_idx
    ON session_questions(booking_id)
  `
  console.log('✅ Created index on session_questions.booking_id')

  // 5. Remove EXPERT from proficiency enum
  //    PostgreSQL doesn't support removing enum values directly;
  //    we handle this at the application layer (Zod + Drizzle only ever inserts BEGINNER/INTERMEDIATE/ADVANCED)
  console.log('ℹ️  proficiency enum: EXPERT removal is enforced at app layer (no DB change needed)')

  console.log('\n🎉 All migrations applied successfully!')
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
