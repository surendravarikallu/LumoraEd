import "dotenv/config";
import { storage } from "./storage";

async function fixUserRoles() {
  try {
    console.log("🔧 Checking and fixing user roles...");
    
    const allUsers = await storage.getAllUsers();
    console.log(`Found ${allUsers.length} users in database`);
    
    for (const user of allUsers) {
      console.log(`User: ${user.email} - Current role: ${user.role}`);
      
      // Only admin@lumoraed.com should be admin, all others should be students
      const shouldBeAdmin = user.email === "admin@lumoraed.com";
      const correctRole = shouldBeAdmin ? "admin" : "student";
      
      if (user.role !== correctRole) {
        console.log(`⚠️  Fixing ${user.email}: ${user.role} → ${correctRole}`);
        await storage.updateUser(user.id, { role: correctRole });
        console.log(`✅ Updated ${user.email} to ${correctRole}`);
      } else {
        console.log(`✅ ${user.email} already has correct role: ${user.role}`);
      }
    }
    
    console.log("🎉 User roles fixed successfully!");
    return allUsers.length;
  } catch (error) {
    console.error("❌ Error fixing user roles:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixUserRoles()
    .then(() => {
      console.log("🎉 User role fixing completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 User role fixing failed:", error);
      process.exit(1);
    });
}

export { fixUserRoles };
