import "dotenv/config";
import { storage } from "./storage";

async function resetUsers() {
  try {
    console.log("🔄 Resetting all users to ensure correct roles...");
    
    const allUsers = await storage.getAllUsers();
    console.log(`Found ${allUsers.length} users to process`);
    
    for (const user of allUsers) {
      console.log(`Processing user: ${user.email} (current role: ${user.role})`);
      
      // Only admin@lumoraed.com should be admin, all others should be students
      const shouldBeAdmin = user.email === "admin@lumoraed.com";
      const correctRole = shouldBeAdmin ? "admin" : "student";
      
      if (user.role !== correctRole) {
        console.log(`🔄 Updating ${user.email}: ${user.role} → ${correctRole}`);
        await storage.updateUser(user.id, { role: correctRole });
        console.log(`✅ Updated ${user.email} to ${correctRole}`);
      } else {
        console.log(`✅ ${user.email} already has correct role: ${user.role}`);
      }
    }
    
    console.log("🎉 User roles reset successfully!");
    console.log("📝 Summary:");
    console.log("  - Only admin@lumoraed.com is admin");
    console.log("  - All other users are students");
    console.log("  - New Google/Firebase logins will create student users");
    
    return allUsers.length;
  } catch (error) {
    console.error("❌ Error resetting users:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  resetUsers()
    .then(() => {
      console.log("🎉 User reset completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 User reset failed:", error);
      process.exit(1);
    });
}

export { resetUsers };
