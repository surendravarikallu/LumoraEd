import "dotenv/config";
import { seedRoadmaps } from "./seed-roadmaps";

async function runSeedRoadmaps() {
  console.log("🚀 Starting roadmap seeding process...");
  
  try {
    await seedRoadmaps();
    console.log("✅ Roadmap seeding completed successfully!");
  } catch (error) {
    console.error("❌ Roadmap seeding failed:", error);
    process.exit(1);
  }
}

runSeedRoadmaps();
