"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Sparkles,
  GraduationCap,
  School,
  Layers,
  ChevronRight,
} from "lucide-react";
import { SUBJECTS } from "../utils/curriculum-data";
import type { Subject } from "../types/curriculum.types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export function SubjectCatalog() {
  const [search, setSearch] = React.useState("");
  const [levelFilter, setLevelFilter] = React.useState<
    "all" | "Junior High School" | "Senior High School"
  >("all");
  const [gradeFilter, setGradeFilter] = React.useState<string>("all");

  const availableGrades = React.useMemo(() => {
    if (levelFilter === "Junior High School")
      return ["Grade 7", "Grade 8", "Grade 9", "Grade 10"];
    if (levelFilter === "Senior High School")
      return ["Grade 11", "Grade 12"];
    return [
      "Grade 7",
      "Grade 8",
      "Grade 9",
      "Grade 10",
      "Grade 11",
      "Grade 12",
    ];
  }, [levelFilter]);

  const filteredSubjects = React.useMemo(() => {
    return SUBJECTS.filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(search.toLowerCase()) ||
        subject.code.toLowerCase().includes(search.toLowerCase());
      const matchesLevel =
        levelFilter === "all" || subject.level === levelFilter;
      const matchesGrade =
        gradeFilter === "all" || subject.grade === gradeFilter;

      return matchesSearch && matchesLevel && matchesGrade;
    });
  }, [search, levelFilter, gradeFilter]);

  // Group subjects by category / level & grade
  const groupedSections = React.useMemo(() => {
    const sections: {
      id: string;
      title: string;
      level: "Junior High School" | "Senior High School";
      description: string;
      icon: React.ElementType;
      grades: {
        grade: string;
        subjects: Subject[];
      }[];
    }[] = [];

    const jhsSubjects = filteredSubjects.filter(
      (s) => s.level === "Junior High School"
    );
    const shsSubjects = filteredSubjects.filter(
      (s) => s.level === "Senior High School"
    );

    if (
      (levelFilter === "all" || levelFilter === "Junior High School") &&
      jhsSubjects.length > 0
    ) {
      const jhsGrades = ["Grade 7", "Grade 8", "Grade 9", "Grade 10"]
        .map((g) => ({
          grade: g,
          subjects: jhsSubjects.filter((s) => s.grade === g),
        }))
        .filter((g) => g.subjects.length > 0);

      sections.push({
        id: "jhs",
        title: "Junior High School (Grades 7–10)",
        level: "Junior High School",
        description:
          "Philippine DepEd K-12 MATATAG Core Curriculum across Math, Science, English, Filipino, AP, MAPEH, and TLE.",
        icon: School,
        grades: jhsGrades,
      });
    }

    if (
      (levelFilter === "all" || levelFilter === "Senior High School") &&
      shsSubjects.length > 0
    ) {
      const shsGrades = ["Grade 11", "Grade 12"]
        .map((g) => ({
          grade: g,
          subjects: shsSubjects.filter((s) => s.grade === g),
        }))
        .filter((g) => g.subjects.length > 0);

      sections.push({
        id: "shs",
        title: "Senior High School — STEM Track (Grades 11–12)",
        level: "Senior High School",
        description:
          "Advanced Science, Technology, Engineering & Mathematics specialized competencies, Calculus, Physics, and Chemistry.",
        icon: GraduationCap,
        grades: shsGrades,
      });
    }

    return sections;
  }, [filteredSubjects, levelFilter]);

  return (
    <div className="space-y-10 py-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-b from-primary/10 via-background to-background p-8 sm:p-12 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            DepEd K-12 & MATATAG Curriculum AI Tutor
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground font-heading">
            Master Philippine High School Subjects with{" "}
            <span className="text-primary">AI Socratic Guidance</span>
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base max-w-2xl leading-relaxed">
            Structured DepEd competencies, interactive lesson modules, multi-dialect explanations (English, Tagalog, Cebuano, Ilocano), and real-time step-by-step drills powered by Google Gemini.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between sticky top-16 z-20 bg-background/80 backdrop-blur-md py-3 border-b border-border/40">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={levelFilter}
            onValueChange={(val) => {
              setLevelFilter(val as typeof levelFilter);
              setGradeFilter("all");
            }}
          >
            <TabsList className="bg-muted/80">
              <TabsTrigger value="all">
                All Levels ({SUBJECTS.length})
              </TabsTrigger>
              <TabsTrigger value="Junior High School">
                Junior High (G7–10)
              </TabsTrigger>
              <TabsTrigger value="Senior High School">
                Senior High STEM (G11–12)
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            aria-label="Filter by Grade Level"
            className="h-9 rounded-xl border border-input bg-card px-3 text-xs font-medium text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Grades</option>
            {availableGrades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subject by title or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm rounded-xl"
          />
        </div>
      </div>

      {/* Categorized Subject Sections */}
      {groupedSections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 p-12 text-center bg-card/40">
          <BookOpen className="size-10 text-muted-foreground/60" />
          <h3 className="mt-4 text-base font-semibold text-foreground">
            No subjects found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search query or grade level filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setLevelFilter("all");
              setGradeFilter("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {groupedSections.map((section) => {
            const SectionIcon = section.icon;
            const totalSectionSubjects = section.grades.reduce(
              (acc, g) => acc + g.subjects.length,
              0
            );

            return (
              <section key={section.id} className="space-y-6">
                {/* Category Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                        <SectionIcon className="size-4" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
                        {section.title}
                      </h2>
                      <Badge variant="secondary" className="text-xs font-mono">
                        {totalSectionSubjects} {totalSectionSubjects === 1 ? "Subject" : "Subjects"}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Sub-groups by Grade Level */}
                <div className="space-y-8">
                  {section.grades.map((gradeGroup) => (
                    <div key={gradeGroup.grade} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-1 bg-primary rounded-full" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                          {gradeGroup.grade} Curriculum ({gradeGroup.subjects.length})
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {gradeGroup.subjects.map((subject) => {
                          const isSHS = subject.level === "Senior High School";
                          return (
                            <Card
                              key={subject.slug}
                              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md hover:shadow-primary/5"
                            >
                              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary/60 opacity-0 transition-opacity group-hover:opacity-100" />

                              <CardHeader className="space-y-2.5 pb-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                                    {subject.code}
                                  </span>
                                  <Badge
                                    variant={isSHS ? "default" : "secondary"}
                                    className="text-[10px] rounded-md px-2 py-0.5"
                                  >
                                    {subject.term}
                                  </Badge>
                                </div>
                                <CardTitle className="text-base font-bold group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                                  {subject.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <span>{subject.grade}</span>
                                  <span>•</span>
                                  <span>DepEd MATATAG</span>
                                </CardDescription>
                              </CardHeader>

                              <CardContent className="pb-3">
                                <div className="rounded-xl bg-muted/50 p-2 text-xs text-muted-foreground flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Layers className="size-3 text-primary" />
                                    Modules
                                  </span>
                                  <span className="font-medium text-foreground">
                                    8–12 Lessons + AI Quiz
                                  </span>
                                </div>
                              </CardContent>

                              <CardFooter className="pt-0">
                                <Button
                                  asChild
                                  variant="secondary"
                                  className="w-full gap-2 rounded-xl group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-xs font-medium"
                                  size="sm"
                                >
                                  <Link href={`/curriculum/${subject.slug}`}>
                                    <span>Explore Subject</span>
                                    <ChevronRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
                                  </Link>
                                </Button>
                              </CardFooter>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
