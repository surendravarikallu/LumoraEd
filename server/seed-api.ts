import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function seedDatabase() {
  console.log("🌱 Starting database seeding via API...");

  try {
    // Create admin user
    console.log("👤 Creating admin user...");
    const adminResponse = await fetch(`${API_BASE}/admin/create-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@lumoraed.com',
        password: 'Admin@123'
      })
    });

    if (adminResponse.ok) {
      const adminData = await adminResponse.json() as { user: { email: string } };
      console.log("✅ Admin user created:", adminData.user.email);
    } else {
      console.log("ℹ️ Admin user may already exist or error occurred");
    }

    console.log("🎉 Database seeding completed!");
    console.log("\n📊 Summary:");
    console.log(`- Admin credentials: admin@lumoraed.com / Admin@123`);
    console.log(`- You can now login as admin and create challenges through the admin panel`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    console.log("💡 Make sure the server is running on port 5000");
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
