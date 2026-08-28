import { prisma } from "../lib/prisma";
import { AppRole } from "@prisma/client";

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@highschooltutor.ph";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "System Admin",
      roles: {
        create: {
          role: AppRole.ADMIN,
        },
      },
      profile: {
        create: {
          fullName: "System Admin",
          email: adminEmail,
          school: "Administration",
          gradeLevel: "Staff",
        },
      },
    },
  });

  console.log(`✅ Seeded admin user: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
