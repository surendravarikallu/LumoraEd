import "dotenv/config";
import { storage } from "./storage";

async function checkUsers() {
  try {
    console.log("👥 Checking all users in database...");
    
    const allUsers = await storage.getAllUsers();
    console.log(`Found ${allUsers.length} users:`);
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - Role: ${user.role} - Firebase UID: ${user.firebaseUid}`);
    });
    
    return allUsers;
  } catch (error) {
    console.error("❌ Error checking users:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkUsers()
    .then(() => {
      console.log("🎉 User check completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 User check failed:", error);
      process.exit(1);
    });
}

export { checkUsers };
