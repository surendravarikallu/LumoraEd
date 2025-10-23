import "dotenv/config";
import { seedBadges } from "./seed-badges";

async function main() {
  try {
    await seedBadges();
    console.log("🎉 Badge seeding completed successfully!");
  } catch (error) {
    console.error("💥 Badge seeding failed:", error);
    process.exit(1);
  }
}

main();
