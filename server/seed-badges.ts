import { db } from "./db";
import { badges } from "@shared/schema";

export async function seedBadges() {
  console.log("🌱 Seeding badges...");

  const badgeData = [
    // Learning milestones
    {
      name: "First Steps",
      description: "Complete your first task",
      icon: "👶",
      color: "blue",
      xpRequired: 0,
      category: "milestone",
      isRare: false,
    },
    {
      name: "Quick Learner",
      description: "Complete 5 tasks in a single day",
      icon: "⚡",
      color: "yellow",
      xpRequired: 50,
      category: "achievement",
      isRare: false,
    },
    {
      name: "Knowledge Seeker",
      description: "Complete 10 tasks",
      icon: "🔍",
      color: "green",
      xpRequired: 100,
      category: "milestone",
      isRare: false,
    },
    {
      name: "Dedicated Student",
      description: "Complete 25 tasks",
      icon: "📚",
      color: "purple",
      xpRequired: 250,
      category: "milestone",
      isRare: false,
    },
    {
      name: "Learning Champion",
      description: "Complete 50 tasks",
      icon: "🏆",
      color: "gold",
      xpRequired: 500,
      category: "milestone",
      isRare: true,
    },

    // Streak badges
    {
      name: "Getting Started",
      description: "Maintain a 3-day learning streak",
      icon: "🔥",
      color: "orange",
      xpRequired: 30,
      category: "streak",
      isRare: false,
    },
    {
      name: "Consistent Learner",
      description: "Maintain a 7-day learning streak",
      icon: "🔥🔥",
      color: "red",
      xpRequired: 70,
      category: "streak",
      isRare: false,
    },
    {
      name: "Unstoppable",
      description: "Maintain a 30-day learning streak",
      icon: "🔥🔥🔥",
      color: "red",
      xpRequired: 300,
      category: "streak",
      isRare: true,
    },

    // Quiz performance
    {
      name: "Perfect Score",
      description: "Get 100% on a quiz",
      icon: "💯",
      color: "gold",
      xpRequired: 0,
      category: "performance",
      isRare: false,
    },
    {
      name: "Quiz Master",
      description: "Get perfect scores on 5 quizzes",
      icon: "🧠",
      color: "purple",
      xpRequired: 0,
      category: "performance",
      isRare: true,
    },

    // Challenge completion
    {
      name: "Challenge Conqueror",
      description: "Complete your first challenge",
      icon: "🎯",
      color: "blue",
      xpRequired: 100,
      category: "challenge",
      isRare: false,
    },
    {
      name: "Multi-Challenge Master",
      description: "Complete 3 different challenges",
      icon: "🎖️",
      color: "gold",
      xpRequired: 300,
      category: "challenge",
      isRare: true,
    },

    // Roadmap progress
    {
      name: "Roadmap Explorer",
      description: "Start your first roadmap",
      icon: "🗺️",
      color: "blue",
      xpRequired: 0,
      category: "roadmap",
      isRare: false,
    },
    {
      name: "Pathfinder",
      description: "Complete 25% of a roadmap",
      icon: "🧭",
      color: "green",
      xpRequired: 50,
      category: "roadmap",
      isRare: false,
    },
    {
      name: "Journey Master",
      description: "Complete 50% of a roadmap",
      icon: "🏔️",
      color: "purple",
      xpRequired: 100,
      category: "roadmap",
      isRare: false,
    },
    {
      name: "Roadmap Legend",
      description: "Complete an entire roadmap",
      icon: "🏆",
      color: "gold",
      xpRequired: 500,
      category: "roadmap",
      isRare: true,
    },

    // Special achievements
    {
      name: "Early Bird",
      description: "Complete a task before 8 AM",
      icon: "🌅",
      color: "yellow",
      xpRequired: 0,
      category: "special",
      isRare: false,
    },
    {
      name: "Night Owl",
      description: "Complete a task after 10 PM",
      icon: "🦉",
      color: "purple",
      xpRequired: 0,
      category: "special",
      isRare: false,
    },
    {
      name: "Weekend Warrior",
      description: "Complete tasks on both weekend days",
      icon: "⚔️",
      color: "orange",
      xpRequired: 0,
      category: "special",
      isRare: false,
    },
    {
      name: "Speed Learner",
      description: "Complete a task in under 5 minutes",
      icon: "⚡",
      color: "yellow",
      xpRequired: 0,
      category: "special",
      isRare: true,
    },
    {
      name: "Deep Thinker",
      description: "Spend over 30 minutes on a single task",
      icon: "🤔",
      color: "blue",
      xpRequired: 0,
      category: "special",
      isRare: false,
    },
  ];

  try {
    // Clear existing badges
    await db.delete(badges);
    console.log("🗑️ Cleared existing badges");

    // Insert new badges
    await db.insert(badges).values(badgeData);
    console.log(`✅ Seeded ${badgeData.length} badges`);

    return badgeData.length;
  } catch (error) {
    console.error("❌ Error seeding badges:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedBadges()
    .then(() => {
      console.log("🎉 Badge seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Badge seeding failed:", error);
      process.exit(1);
    });
}
