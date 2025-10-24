import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Database operations will fail.");
  // Don't throw immediately to allow graceful degradation
}

let pool: Pool | null = null;
let db: any = null;

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log("Database connection initialized successfully");
  }
} catch (error) {
  console.error("Failed to initialize database connection:", error);
}

export { pool, db };
