import { prisma } from "../lib/prisma";
import { AppRole, AnnouncementType, AudienceType, SubPlan, SubStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting HighSchool Tutor database seeding...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@highschooltutor.ph";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // 1. Seed or Update Admin User
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "System Admin",
      emailVerified: true,
    },
    create: {
      email: adminEmail,
      name: "System Admin",
      passwordHash,
      emailVerified: true,
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

  // Ensure Admin Role exists
  await prisma.userRole.upsert({
    where: {
      userId_role: {
        userId: admin.id,
        role: AppRole.ADMIN,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      role: AppRole.ADMIN,
    },
  });

  // Ensure Admin Profile exists and hasOnboarded is true
  await prisma.profile.upsert({
    where: { id: admin.id },
    update: {
      hasOnboarded: true,
      fullName: "System Admin",
      school: "Department of Education - Central Office",
      gradeLevel: "Staff",
    },
    create: {
      id: admin.id,
      fullName: "System Admin",
      email: adminEmail,
      school: "Department of Education - Central Office",
      gradeLevel: "Staff",
      track: "Administration",
      hasOnboarded: true,
    },
  });

  console.log(`✅ Seeded Admin Account:`);
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);

  // 2. Seed Default Admin Configuration (Pricing & Guardrails)
  const config = await prisma.adminConfig.upsert({
    where: { id: "default_config" },
    update: {},
    create: {
      id: "default_config",
      monthlyPricePhp: 300,
      annualPricePhp: 2600,
      maxTrialSubjects: 3,
      maxFreeLessons: 3,
      gcashReceiverNumber: "0917-888-4321",
      gcashAccountName: "HIGHSCHOOL TUTOR PH",
      mayaReceiverNumber: "0918-999-8765",
      mayaAccountName: "HIGHSCHOOL TUTOR PH",
      enableAiTutorTrial: true,
      promoDiscountPercent: 20,
    },
  });
  console.log(`✅ Seeded AdminConfig (Pricing: ₱${config.monthlyPricePhp}/mo, ₱${config.annualPricePhp}/yr)`);

  // 3. Seed Starter Announcements
  const sampleAnnouncements = [
    {
      title: "DepEd MATATAG DO 015 s. 2026 Curriculum Quizzes Active",
      body: "All Junior and Senior High School practice tests are now graded according to the official DepEd 75% transmutation scale. Practice anytime in Study Mode or Exam Mode!",
      type: AnnouncementType.INFO,
      targetAudience: AudienceType.ALL,
      isActive: true,
      publishedAt: new Date(),
    },
    {
      title: "Special Upgrade Promo: Save ₱1,000 on Annual Pass",
      body: "Upgrade your learning access today for only ₱2,600 for the entire academic school year via GCash and Maya (save ₱1,000 compared to monthly).",
      type: AnnouncementType.PROMO,
      targetAudience: AudienceType.TRIAL,
      isActive: true,
      publishedAt: new Date(),
    },
    {
      title: "Senior High School STEM Mock Calculus Exam Schedule",
      body: "Basic Calculus and Pre-Calculus live review drills are scheduled this weekend. Premium members get unlimited Socratic AI hints.",
      type: AnnouncementType.INFO,
      targetAudience: AudienceType.PREMIUM,
      isActive: true,
      publishedAt: new Date(),
    },
  ];

  for (const item of sampleAnnouncements) {
    const existing = await prisma.announcement.findFirst({
      where: { title: item.title },
    });
    if (!existing) {
      await prisma.announcement.create({
        data: item,
      });
    }
  }
  console.log(`✅ Seeded Starter Announcements (3 items)`);

  // 4. Seed Sample Students (if none exist)
  const studentCount = await prisma.user.count({
    where: {
      roles: {
        some: { role: AppRole.STUDENT },
      },
    },
  });

  if (studentCount === 0 && process.env.NODE_ENV !== "production") {
    const sampleStudents = [
      {
        name: "Juan Dela Cruz",
        email: "juan.delacruz@deped.gov.ph",
        school: "Manila Science High School",
        gradeLevel: "Grade 11",
        track: "STEM",
        status: SubStatus.ACTIVE,
        plan: SubPlan.ANNUAL,
        amount: 1499,
        paymentRef: "GC-982103491",
        method: "gcash",
        paymentStatus: PaymentStatus.VERIFIED,
      },
      {
        name: "Maria Clara Santos",
        email: "maria.clara@gmail.com",
        school: "Quezon City High School",
        gradeLevel: "Grade 10",
        track: "Junior High",
        status: SubStatus.PENDING,
        plan: SubPlan.MONTHLY,
        amount: 199,
        paymentRef: "MY-339180211",
        method: "maya",
        paymentStatus: PaymentStatus.PENDING,
      },
      {
        name: "Gabriel Silang",
        email: "gabriel.silang@deped.gov.ph",
        school: "Rizal National High School",
        gradeLevel: "Grade 12",
        track: "STEM",
        status: SubStatus.TRIAL,
        plan: SubPlan.MONTHLY,
        amount: 0,
        paymentRef: "",
        method: "gcash",
        paymentStatus: PaymentStatus.PENDING,
      },
    ];

    const studentPasswordHash = await bcrypt.hash("Student2026!", 10);

    for (const studentData of sampleStudents) {
      const student = await prisma.user.create({
        data: {
          name: studentData.name,
          email: studentData.email,
          passwordHash: studentPasswordHash,
          emailVerified: true,
          roles: {
            create: { role: AppRole.STUDENT },
          },
          profile: {
            create: {
              fullName: studentData.name,
              email: studentData.email,
              school: studentData.school,
              gradeLevel: studentData.gradeLevel,
              track: studentData.track,
              hasOnboarded: true,
            },
          },
          subscriptions: {
            create: {
              plan: studentData.plan,
              status: studentData.status,
              amountPhp: studentData.amount,
              startedAt: studentData.status === SubStatus.ACTIVE ? new Date() : null,
              expiresAt:
                studentData.status === SubStatus.ACTIVE
                  ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                  : null,
            },
          },
          trialSubjects: {
            createMany: {
              data: [
                { subjectSlug: "g11-s1-genmath", subjectLabel: "General Mathematics" },
                { subjectSlug: "g11-s1-precalc", subjectLabel: "Pre-Calculus" },
              ],
            },
          },
          quizAttempts: {
            create: {
              subjectSlug: "g11-s1-genmath",
              subjectCode: "GENMATH",
              lessonNumber: 1,
              lessonTitle: "Functions and Graphs",
              score: 9,
              total: 10,
              mode: "exam",
            },
          },
        },
      });

      if (studentData.paymentRef) {
        await prisma.payment.create({
          data: {
            userId: student.id,
            amountPhp: studentData.amount,
            method: studentData.method,
            referenceNo: studentData.paymentRef,
            status: studentData.paymentStatus,
            paidAt: new Date(),
          },
        });
      }
    }

    console.log(`✅ Seeded Sample Students (Juan Dela Cruz, Maria Clara Santos, Gabriel Silang)`);
    console.log(`   Default Student Password: Student2026!`);
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
