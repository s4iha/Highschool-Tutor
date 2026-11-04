"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Bot,
  Layers,
  ChevronLeft,
  Briefcase,
  BookOpenCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import type { SubjectScopeDefinition } from "../types/subjectScope.types";
import { getJhsGradeQuarterScope } from "../utils/subject-scope-data";
import { cn } from "@/lib/utils";

export interface SubjectScopeViewProps {
  subject: SubjectScopeDefinition;
}

const JHS_GRADES_LIST = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"] as const;
const JHS_QUARTERS_LIST = ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"] as const;

export function SubjectScopeView({ subject }: SubjectScopeViewProps) {
  // Determine initial grade and quarter for JHS subjects
  const initialGrade = useMemo(() => {
    if (subject.grade && (JHS_GRADES_LIST as readonly string[]).includes(subject.grade)) {
      return subject.grade as (typeof JHS_GRADES_LIST)[number];
    }
    return "Grade 7";
  }, [subject.grade]);

  const initialQuarter = useMemo(() => {
    if (subject.term && (JHS_QUARTERS_LIST as readonly string[]).includes(subject.term)) {
      return subject.term as (typeof JHS_QUARTERS_LIST)[number];
    }
    return "Quarter 1";
  }, [subject.term]);

  const [selectedGrade, setSelectedGrade] = useState<(typeof JHS_GRADES_LIST)[number]>(initialGrade);
  const [selectedQuarter, setSelectedQuarter] = useState<(typeof JHS_QUARTERS_LIST)[number]>(initialQuarter);

  // For JHS Core subjects, dynamically resolve active scope based on grade/quarter toggle
  const activeScope = useMemo(() => {
    if (subject.isJhsCore && subject.abbr) {
      const jhsScope = getJhsGradeQuarterScope(subject.abbr, selectedGrade, selectedQuarter);
      const gradeNum = selectedGrade.replace(/\D+/g, "") || "7";
      const quarterNum = selectedQuarter.replace(/\D+/g, "") || "1";
      return {
        slug: jhsScope.slug,
        code: `G${gradeNum}-Q${quarterNum}-${subject.abbr}`,
        grade: selectedGrade,
        term: selectedQuarter,
        description: jhsScope.description,
        competencies: jhsScope.competencies,
        lessons: jhsScope.lessons,
      };
    }

    return {
      slug: subject.slug,
      code: subject.code,
      grade: subject.grade,
      term: subject.term,
      description: subject.description,
      competencies: subject.competencies,
      lessons: subject.lessons,
    };
  }, [subject, selectedGrade, selectedQuarter]);

  const hasPrereq = subject.prerequisites.length > 0 && !subject.prerequisites.includes("None");

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/subjects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          <span>Back to All Curriculum Subjects</span>
        </Link>
      </div>

      {/* Main Subject Header Hero */}
      <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/15 border-primary/20 text-xs font-bold uppercase tracking-wider">
            {subject.strand}
          </Badge>
          <Badge variant="outline" className="text-xs font-semibold">
            {subject.level}
          </Badge>
          <span className="text-xs font-mono font-medium text-muted-foreground">
            {activeScope.grade} • {activeScope.term}
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight font-heading leading-[1.18]">
            {subject.name}
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-muted-foreground">
            <span className="font-semibold text-foreground">DepEd Subject Code:</span>
            <span className="bg-muted px-2 py-0.5 rounded-md text-foreground font-bold border border-border/60">
              {activeScope.code}
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
          {activeScope.description}
        </p>

        {/* JHS Interactive Grade & Quarter Switcher */}
        {subject.isJhsCore && (
          <div className="rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <BookOpenCheck className="size-4 text-primary" />
                <span>Select Grade &amp; Grading Period:</span>
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Canonical: {activeScope.code}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground font-medium shrink-0 mr-1">Grade:</span>
              {JHS_GRADES_LIST.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setSelectedGrade(grade)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-semibold transition-all border",
                    selectedGrade === grade
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {grade}
                </button>
              ))}

              <div className="w-px h-4 bg-border/80 mx-1 hidden sm:block" />

              <span className="text-xs text-muted-foreground font-medium shrink-0 mr-1">Quarter:</span>
              {JHS_QUARTERS_LIST.map((quarter) => (
                <button
                  key={quarter}
                  type="button"
                  onClick={() => setSelectedQuarter(quarter)}
                  className={cn(
                    "px-3 py-1 rounded-xl text-xs font-semibold transition-all border",
                    selectedQuarter === quarter
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {quarter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Spec Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Time Allotment */}
          <div className="rounded-2xl border border-border/60 bg-background/80 p-4 space-y-1 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Clock className="size-3.5 text-primary" />
              <span>Time Allotment</span>
            </div>
            <div className="text-sm font-bold text-foreground">
              {subject.timeAllotment}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="rounded-2xl border border-border/60 bg-background/80 p-4 space-y-1 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <BookOpen className="size-3.5 text-primary" />
              <span>Prerequisites</span>
            </div>
            <div className="text-sm font-bold text-foreground truncate">
              {hasPrereq ? subject.prerequisites.join(", ") : "No Prerequisite"}
            </div>
          </div>

          {/* Standard Modules */}
          <div className="rounded-2xl border border-border/60 bg-background/80 p-4 space-y-1 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Layers className="size-3.5 text-primary" />
              <span>Standard Modules</span>
            </div>
            <div className="text-sm font-bold text-foreground">
              8 Lessons • 24 Drills
            </div>
          </div>

          {/* Academic Track */}
          <div className="rounded-2xl border border-border/60 bg-background/80 p-4 space-y-1 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <GraduationCap className="size-3.5 text-primary" />
              <span>DepEd Track</span>
            </div>
            <div className="text-sm font-bold text-foreground truncate">
              {subject.track}
            </div>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
          <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl px-8 py-6 text-sm font-bold shadow-lg shadow-primary/20 gap-2">
            <Link href={`/curriculum/${activeScope.slug}`}>
              <span>Start Practicing with Socratic AI</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>

          <span className="text-xs text-muted-foreground font-medium">
            30-day all-access trial • No credit card required
          </span>
        </div>
      </div>

      {/* Curriculum Syllabus & 8-Lesson Breakdown Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="size-4.5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                Curriculum Syllabus &amp; Topic Breakdown
              </h2>
              <p className="text-xs text-muted-foreground">
                8 sequential DepEd MATATAG lesson modules with 24 verified practice drills for {activeScope.grade} {activeScope.term}.
              </p>
            </div>
          </div>

          <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-semibold text-muted-foreground border-border/60">
            8 Lessons • 24 Socratic Drills
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeScope.lessons.map((lesson) => (
            <div
              key={lesson.lessonNumber}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Header tag and drill indicator */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border-primary/20">
                    Lesson {String(lesson.lessonNumber).padStart(2, "0")}
                  </Badge>

                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <Sparkles className="size-3" />
                    <span>3 Socratic Drills</span>
                  </span>
                </div>

                {/* Lesson Title */}
                <h3 className="text-sm sm:text-base font-bold text-foreground font-heading group-hover:text-primary transition-colors leading-snug">
                  {lesson.title}
                </h3>

                {/* Lesson Summary */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {lesson.summary}
                </p>

                {/* Key Concepts Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {lesson.keyConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-muted/60 border border-border/40 text-[10px] font-medium text-muted-foreground"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lesson Footer Link */}
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-end">
                <Link
                  href={`/curriculum/${activeScope.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Practice Lesson {lesson.lessonNumber}</span>
                  <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Competencies Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CheckCircle2 className="size-4.5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
              Prescribed Learning Competencies
            </h2>
            <p className="text-xs text-muted-foreground">
              Mandatory knowledge and skills aligned with DepEd Order No. 015, s. 2026 MATATAG standards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeScope.competencies.map((competency, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-xs hover:border-border transition-all"
            >
              <div className="size-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-card-foreground leading-relaxed font-normal">
                {competency}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Career Pathways Section (if available) */}
      {subject.careerPathways && subject.careerPathways.length > 0 && (
        <div className="rounded-3xl border border-border/80 bg-muted/20 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Briefcase className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-foreground">
                Higher Education &amp; Career Pathways
              </h3>
              <p className="text-xs text-muted-foreground">
                Specialized degree programs and vocational industries built upon this learning area.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {subject.careerPathways.map((pathway, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-background border border-border/70 text-xs font-semibold text-foreground shadow-xs"
              >
                {pathway}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Socratic AI Study Callout Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider">
            <Bot className="size-3.5" />
            <span>24/7 DepEd Socratic AI Tutor</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
            Stuck on complex {subject.name} concepts?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Practice with 24 verified drills per lesson. Our Google Gemini Socratic AI guides you with step-by-step reasoning in English, Taglish, or Cebuano without spoiling test answers.
          </p>
        </div>

        <Button asChild size="lg" className="rounded-2xl px-8 py-6 text-sm font-bold shadow-lg shadow-primary/20 shrink-0 gap-2">
          <Link href={`/curriculum/${activeScope.slug}`}>
            <span>Launch Subject Drills</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
