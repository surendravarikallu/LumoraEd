import "dotenv/config";
import { storage } from "./storage";

async function createStudentUser() {
  try {
    console.log("🎓 Creating a student user for testing...");
    
    const studentUser = await storage.createUser({
      email: "student@lumoraed.com",
      name: "Test Student",
      firebaseUid: "student-test-123",
      role: "student"
    });
    
    console.log("✅ Student user created:", {
      id: studentUser.id,
      email: studentUser.email,
      name: studentUser.name,
      role: studentUser.role
    });
    
    return studentUser;
  } catch (error) {
    console.error("❌ Error creating student user:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createStudentUser()
    .then(() => {
      console.log("🎉 Student user creation completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Student user creation failed:", error);
      process.exit(1);
    });
}

export { createStudentUser };
