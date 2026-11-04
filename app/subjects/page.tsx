import React from "react";
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { getAllSubjectScopeDefinitions } from "@/features/curriculum/utils/subject-scope-data";
import { PublicSubjectCatalog } from "@/features/curriculum/components/PublicSubjectCatalog";
import {
  JsonLd,
  buildBreadcrumbSchema,
  buildPageMetadata,
} from "@/features/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "DepEd MATATAG Curriculum Subjects Catalog (Grades 7–12)",
  description:
    "Explore the comprehensive Department of Education (DepEd) Order No. 015, s. 2026 MATATAG curriculum across Junior High School and Senior High School tracks, time allotments, prerequisites, and learning competencies.",
  path: "/subjects",
});

export interface SubjectsPageProps {
  searchParams?: Promise<{
    level?: string;
    track?: string;
    strand?: string;
  }>;
}

export default async function SubjectsPage({ searchParams }: SubjectsPageProps) {
  const subjects = getAllSubjectScopeDefinitions();
  const params = await searchParams;

  let initialLevel: "ALL" | "JHS" | "SHS" = "ALL";
  if (params?.level?.toUpperCase() === "JHS") {
    initialLevel = "JHS";
  } else if (params?.level?.toUpperCase() === "SHS") {
    initialLevel = "SHS";
  }

  const initialStrand = params?.track || params?.strand || "ALL";

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Curriculum Subjects", path: "/subjects" },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <div className="min-h-screen bg-muted/20 dark:bg-background pb-20 pt-8 sm:pt-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8 sm:space-y-12">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20 shadow-xs">
              <GraduationCap className="size-4" />
              <span>DepEd Order No. 015, s. 2026 Aligned</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight font-heading leading-[1.15]">
              DepEd MATATAG <span className="text-primary">Curriculum Catalog</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
              Browse the official curriculum scope, prescribed time allotments, and learning competencies for all Junior High School (Grades 7–10) and Senior High School (Grades 11–12) subjects.
            </p>

            {/* Quick Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircleIcon className="size-3.5 text-emerald-500" />
                <span>100% DepEd MATATAG Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircleIcon className="size-3.5 text-primary" />
                <span>8 Lessons &amp; 24 Drills per Subject</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircleIcon className="size-3.5 text-amber-500" />
                <span>24/7 Socratic Taglish AI Tutor</span>
              </div>
            </div>
          </div>

          {/* Interactive Catalog Component */}
          <PublicSubjectCatalog
            initialSubjects={subjects}
            initialLevel={initialLevel}
            initialStrand={initialStrand}
          />
        </div>
      </div>
    </>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
