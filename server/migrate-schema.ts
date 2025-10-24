import "dotenv/config";
import { db } from "./db";
import { sql } from "drizzle-orm";

async function migrateSchema() {
  try {
    console.log("Starting database schema migration...");

    // Add new columns to users table
    console.log("Adding profile columns to users table...");
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS roll_number TEXT,
      ADD COLUMN IF NOT EXISTS branch TEXT,
      ADD COLUMN IF NOT EXISTS year TEXT,
      ADD COLUMN IF NOT EXISTS college_name TEXT,
      ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false
    `);

    // Create student_requests table
    console.log("Creating student_requests table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS student_requests (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    // Update existing users to have profile_complete = true for admins
    console.log("Updating existing admin users...");
    await db.execute(sql`
      UPDATE users 
      SET profile_complete = true 
      WHERE role = 'admin'
    `);

    console.log("Database schema migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateSchema();
