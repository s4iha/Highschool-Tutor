"use server";

import { prisma } from "@/lib/prisma";
import { AppRole } from "@prisma/client";
import { CATALOG_BASELINE_STATS } from "../constants/catalog-stats";
import type { LandingStatsResponse } from "../types/landing.types";

/**
 * Server Action to fetch landing page statistics:
 * 1. Attempts to query live student count and quiz attempt count from PostgreSQL.
 * 2. If counts are non-zero, returns live metrics merged with baseline catalog constants (source: "live").
 * 3. On database disconnection, cold start, or zero records, returns verified catalog constants (source: "catalog_fallback").
 */
export async function getLandingStatsAction(): Promise<LandingStatsResponse> {
  try {
    const [liveStudents, liveQuizzesTaken] = await Promise.all([
      prisma.user.count({
        where: {
          roles: {
            some: {
              role: AppRole.STUDENT,
            },
          },
        },
      }),
      prisma.quizAttempt.count(),
    ]);

    if (liveStudents > 0 || liveQuizzesTaken > 0) {
      return {
        success: true,
        source: "live",
        data: {
          ...CATALOG_BASELINE_STATS,
          liveStudents,
          liveQuizzesTaken,
        },
      };
    }

    return {
      success: true,
      source: "catalog_fallback",
      data: {
        ...CATALOG_BASELINE_STATS,
      },
    };
  } catch (error) {
    console.warn("Unable to fetch live landing stats, falling back to catalog baseline:", error);
    return {
      success: true,
      source: "catalog_fallback",
      data: {
        ...CATALOG_BASELINE_STATS,
      },
      error: error instanceof Error ? error.message : "Database query failed",
    };
  }
}
