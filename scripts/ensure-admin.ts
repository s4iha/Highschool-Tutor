import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { prisma } from "../lib/prisma";
import { AppRole } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@highschooltutor.ph";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin2026!";
  const resetPassword = process.argv.includes("--reset-password");

  console.log(`🔍 Checking administrator account for: ${adminEmail}...`);

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { roles: true, profile: true },
  });

  let userId: string;

  if (!existingUser) {
    console.log(`Creating new administrator account...`);
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const created = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "System Admin",
        emailVerified: true,
        passwordHash,
        roles: {
          create: {
            role: AppRole.ADMIN,
          },
        },
        profile: {
          create: {
            fullName: "System Admin",
            email: adminEmail,
            school: "Department of Education - Central Office",
            gradeLevel: "Staff",
            track: "Administration",
            hasOnboarded: true,
          },
        },
      },
    });
    userId = created.id;
    console.log(`✅ Created Admin user with ID: ${userId}`);
  } else {
    userId = existingUser.id;
    console.log(`ℹ️ Existing user found with ID: ${userId}`);

    // Update password if requested or if missing
    if (!existingUser.passwordHash || resetPassword) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash,
          emailVerified: true,
        },
      });
      console.log(`🔑 Admin password updated/reset.`);
    }

    // Ensure ADMIN role exists in user_roles
    const hasAdminRole = existingUser.roles.some((r) => r.role === AppRole.ADMIN);
    if (!hasAdminRole) {
      await prisma.userRole.create({
        data: {
          userId,
          role: AppRole.ADMIN,
        },
      });
      console.log(`🛡️ Attached ADMIN role to user.`);
    } else {
      console.log(`🛡️ User already has ADMIN role.`);
    }

    // Ensure profile exists and hasOnboarded is true
    await prisma.profile.upsert({
      where: { id: userId },
      update: {
        hasOnboarded: true,
      },
      create: {
        id: userId,
        fullName: existingUser.name || "System Admin",
        email: adminEmail,
        school: "Department of Education - Central Office",
        gradeLevel: "Staff",
        track: "Administration",
        hasOnboarded: true,
      },
    });
  }

  // Ensure AdminConfig exists
  const config = await prisma.adminConfig.upsert({
    where: { id: "default_config" },
    update: {},
    create: {
      id: "default_config",
      monthlyPricePhp: 299,
      annualPricePhp: 2999,
      maxTrialSubjects: 3,
      maxFreeLessons: 3,
      targetLessonsPerSubject: 8,
      trialDurationDays: 30,
      availableQuestionCounts: "5, 10, 15, 20",
      gcashReceiverNumber: "0917-888-4321",
      gcashAccountName: "HIGHSCHOOL TUTOR PH",
      mayaReceiverNumber: "0918-999-8765",
      mayaAccountName: "HIGHSCHOOL TUTOR PH",
      enableAiTutorTrial: true,
      promoDiscountPercent: 20,
    },
  });

  console.log(`⚙️ AdminConfig verified (Pricing: ₱${config.monthlyPricePhp}/mo, ₱${config.annualPricePhp}/yr).`);
  console.log(`🎉 Administrator provisioned successfully:`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Role:  ADMIN`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed to ensure admin:", err);
  process.exit(1);
});
