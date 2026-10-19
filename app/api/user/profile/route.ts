import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";
import { SUBJECT_BY_SLUG } from "@/features/curriculum/utils/curriculum-data";
import { z } from "zod";

const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  school: z.string().optional(),
  gradeLevel: z.string().optional(),
  track: z.string().optional(),
  termPreference: z.string().optional(),
  tutoringPersona: z.enum(["socratic", "detailed", "exam-prep"]).optional(),
});

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: sessionUser.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = updateProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues[0]?.message || "Invalid input data" },
        { status: 400 }
      );
    }

    const { fullName, school, gradeLevel, track, termPreference, tutoringPersona } = validated.data;

    const existingProfile = await prisma.profile.findUnique({
      where: { id: sessionUser.id },
    });

    const isGradeChanging = Boolean(
      gradeLevel && existingProfile?.gradeLevel && existingProfile.gradeLevel !== gradeLevel
    );

    const profile = await prisma.profile.upsert({
      where: { id: sessionUser.id },
      update: {
        fullName,
        school: school || "",
        ...(gradeLevel ? { gradeLevel } : {}),
        ...(track ? { track } : {}),
        ...(termPreference !== undefined ? { termPreference } : {}),
        ...(tutoringPersona ? { tutoringPersona } : {}),
      },
      create: {
        id: sessionUser.id,
        fullName,
        email: sessionUser.email,
        school: school || "",
        gradeLevel: gradeLevel || "Grade 11",
        track: track || "STEM Strand",
        termPreference: termPreference || "",
        tutoringPersona: tutoringPersona || "socratic",
        hasOnboarded: true,
      },
    });

    // Migrate enrolled trial subjects if grade level changed
    if (isGradeChanging && gradeLevel) {
      try {
        const existingTrialSubjects = await prisma.trialSubject.findMany({
          where: { userId: sessionUser.id },
        });

        const oldGradeStr = existingProfile?.gradeLevel || "";
        const newGradeStr = gradeLevel;

        const isOldJhs =
          oldGradeStr.startsWith("Grade 7") ||
          oldGradeStr.startsWith("Grade 8") ||
          oldGradeStr.startsWith("Grade 9") ||
          oldGradeStr.startsWith("Grade 10");
        const isNewJhs =
          newGradeStr.startsWith("Grade 7") ||
          newGradeStr.startsWith("Grade 8") ||
          newGradeStr.startsWith("Grade 9") ||
          newGradeStr.startsWith("Grade 10");
        const newGradeNum = newGradeStr.replace(/\D+/g, "") || "7";

        if (isOldJhs && isNewJhs) {
          // Update all JHS subjects to new grade level number
          for (const ts of existingTrialSubjects) {
            const jhsMatch = ts.subjectSlug.match(/^g(\d+)-(q\d|t\d)-([a-z0-9]+)$/i);
            if (jhsMatch) {
              const [, , term, abbr] = jhsMatch;
              const newSlug = `g${newGradeNum}-${term.toLowerCase()}-${abbr.toLowerCase()}`;
              const newSubject = SUBJECT_BY_SLUG.get(newSlug);
              await prisma.trialSubject.update({
                where: { id: ts.id },
                data: {
                  subjectSlug: newSlug,
                  subjectLabel: newSubject?.name || ts.subjectLabel,
                },
              });
            }
          }
        } else if (!isOldJhs && isNewJhs) {
          // Switched from SHS to JHS: clear old subjects and enroll starter JHS subjects
          await prisma.trialSubject.deleteMany({
            where: { userId: sessionUser.id },
          });
          const defaultJhsSlugs = [
            `g${newGradeNum}-q1-math`,
            `g${newGradeNum}-q1-sci`,
            `g${newGradeNum}-q1-eng`,
          ];
          for (const slug of defaultJhsSlugs) {
            const sub = SUBJECT_BY_SLUG.get(slug);
            if (sub) {
              await prisma.trialSubject.create({
                data: {
                  userId: sessionUser.id,
                  subjectSlug: slug,
                  subjectLabel: sub.name,
                },
              }).catch(() => {});
            }
          }
        } else if (isOldJhs && !isNewJhs) {
          // Switched from JHS to SHS: clear old subjects and enroll starter SHS subjects
          await prisma.trialSubject.deleteMany({
            where: { userId: sessionUser.id },
          });
          const defaultShsSlugs =
            newGradeNum === "12"
              ? ["g12-s1-lit21", "g12-s1-pracres2", "g12-s1-phys1"]
              : ["g11-s1-genmath", "g11-s1-oralcomm", "g11-s1-earthlife"];
          for (const slug of defaultShsSlugs) {
            const sub = SUBJECT_BY_SLUG.get(slug);
            if (sub) {
              await prisma.trialSubject.create({
                data: {
                  userId: sessionUser.id,
                  subjectSlug: slug,
                  subjectLabel: sub.name,
                },
              }).catch(() => {});
            }
          }
        }
      } catch (migrationErr) {
        console.warn("Failed to migrate trial subjects on grade change:", migrationErr);
      }
    }

    await prisma.user.update({
      where: { id: sessionUser.id },
      data: { name: fullName },
    });

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

