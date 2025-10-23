import "dotenv/config";
import { seedDatabase } from "./seed";

async function runSeed() {
  console.log("🌱 Starting comprehensive database seeding...");
  try {
    await seedDatabase();
    console.log("✅ Comprehensive seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

runSeed();
