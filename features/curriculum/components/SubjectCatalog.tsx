"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Sparkles,
  GraduationCap,
  School,
  ChevronRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import {
  getDistinctJhsSubjects,
  getDistinctShsSubjects,
  buildJhsSlug,
  JHS_QUARTERS,
} from "../utils/curriculum-data";
import { useUser } from "@/features/auth/hooks/useUser";
import { usePublicConfigQuery } from "@/features/settings";
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
import { cn } from "@/lib/utils";

export function SubjectCatalog() {
  const { user } = useUser();
  const { data: config } = usePublicConfigQuery();
  const targetLessons = config?.targetLessonsPerSubject ?? 8;

  const [search, setSearch] = React.useState("");
  const [levelFilter, setLevelFilter] = React.useState<
    "all" | "Junior High School" | "Senior High School"
  >("all");
  const [jhsQuarterFilter, setJhsQuarterFilter] = React.useState<
    "all" | "Quarter 1" | "Quarter 2" | "Quarter 3" | "Quarter 4"
  >("all");
  const [shsSemesterFilter, setShsSemesterFilter] = React.useState<
    "all" | "Semester 1" | "Semester 2"
  >("all");
  const [shsStrandFilter, setShsStrandFilter] = React.useState<
    "all" | "STEM" | "ABM" | "HUMSS" | "GAS" | "TVL"
  >("all");

  const studentGrade = user?.profile?.gradeLevel?.trim() || "Grade 7";
  const studentTerm = user?.profile?.termPreference?.trim() || "Quarter 1";

  const isStudentSHS = studentGrade.startsWith("Grade 11") || studentGrade.startsWith("Grade 12");
  const isStudentJHS =
    studentGrade.startsWith("Grade 7") ||
    studentGrade.startsWith("Grade 8") ||
    studentGrade.startsWith("Grade 9") ||
    studentGrade.startsWith("Grade 10");

  // Determine active quarter string for JHS slugs based on filter or student profile
  const resolvedJhsQuarter = React.useMemo(() => {
    if (jhsQuarterFilter !== "all") return jhsQuarterFilter;
    if (studentTerm.startsWith("Quarter")) return studentTerm;
    return "Quarter 1";
  }, [jhsQuarterFilter, studentTerm]);

  // Generate 8 unique JHS subjects with dynamic default slugs
  const allJhsSubjects = React.useMemo(() => {
    const raw = getDistinctJhsSubjects(
      isStudentJHS ? studentGrade : "Grade 7",
      resolvedJhsQuarter
    );
    return raw.map((s) => ({
      ...s,
      defaultSlug: buildJhsSlug(s.abbr || "MATH", isStudentJHS ? studentGrade : "Grade 7", resolvedJhsQuarter),
    }));
  }, [isStudentJHS, studentGrade, resolvedJhsQuarter]);

  // Generate SHS subjects from catalog
  const allShsSubjects = React.useMemo(() => {
    return getDistinctShsSubjects();
  }, []);

  const totalCatalogCount = allJhsSubjects.length + allShsSubjects.length;

  // Filter JHS subjects
  const filteredJhsSubjects = React.useMemo(() => {
    if (levelFilter === "Senior High School") return [];

    return allJhsSubjects.filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(search.toLowerCase()) ||
        subject.code.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [allJhsSubjects, levelFilter, search]);

  // Filter SHS subjects
  const filteredShsSubjects = React.useMemo(() => {
    if (levelFilter === "Junior High School") return [];

    return allShsSubjects.filter((subject) => {
      const matchesSearch =
        subject.name.toLowerCase().includes(search.toLowerCase()) ||
        subject.code.toLowerCase().includes(search.toLowerCase());

      const matchesSemester =
        shsSemesterFilter === "all" || subject.term === shsSemesterFilter;

      const matchesStrand =
        shsStrandFilter === "all" ||
        subject.strand === shsStrandFilter ||
        subject.strand === "Core" ||
        subject.strand === "Applied";

      return matchesSearch && matchesSemester && matchesStrand;
    });
  }, [allShsSubjects, levelFilter, shsSemesterFilter, shsStrandFilter, search]);

  // Sub-group SHS subjects by Grade and Semester
  const shsGradeGroups = React.useMemo(() => {
    const grades = ["Grade 11", "Grade 12"];
    return grades
      .map((g) => ({
        grade: g,
        subjects: filteredShsSubjects.filter((s) => s.grade === g),
      }))
      .filter((g) => g.subjects.length > 0);
  }, [filteredShsSubjects]);

  const hasAnyResults = filteredJhsSubjects.length > 0 || filteredShsSubjects.length > 0;

  // Render JHS Section Component
  const renderJhsSection = () => {
    if (filteredJhsSubjects.length === 0) return null;

    return (
      <section key="jhs-section" className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <School className="size-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
                Junior High School Core Curriculum (Grades 7–10)
              </h2>
              <Badge variant="secondary" className="text-xs font-mono">
                {filteredJhsSubjects.length} Core Subjects
              </Badge>
              {isStudentJHS && (
                <Badge
                  variant="outline"
                  className="text-xs border-primary/40 text-primary bg-primary/5 font-semibold gap-1"
                >
                  <CheckCircle2 className="size-3 text-primary" />
                  Your Grade ({studentGrade})
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Philippine DepEd K-12 MATATAG Core Curriculum across Math, Science, English, Filipino, AP, ESP, MAPEH, and TLE organized into Quarters 1–4.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredJhsSubjects.map((subject) => (
            <Card
              key={subject.id}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
                isStudentJHS ? "border-primary/30" : "border-border/60"
              )}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary/60 opacity-0 transition-opacity group-hover:opacity-100" />

              <CardHeader className="p-5 pb-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                    {subject.code}
                  </span>
                  <Badge variant="secondary" className="text-[10px] rounded-md px-2 py-0.5 font-medium">
                    {resolvedJhsQuarter}
                  </Badge>
                </div>
                <CardTitle className="text-sm sm:text-base font-bold group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                  {subject.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                  <span>{isStudentJHS ? studentGrade : "Grades 7–10"}</span>
                  <span>•</span>
                  <span>DepEd MATATAG</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 pb-3">
                <div className="rounded-xl bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/40 space-y-1.5">
                  <div className="flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-1.5 font-medium text-xs">
                      <BookOpen className="size-3.5 text-primary" />
                      Curriculum Scope
                    </span>
                    <span className="font-semibold text-xs text-primary">
                      {targetLessons} Lessons
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Grading Cycle</span>
                    <span className="font-medium text-foreground">4 DepEd Quarters</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-0">
                <Button
                  asChild
                  variant="secondary"
                  className="w-full gap-2 rounded-xl group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-xs font-semibold h-9"
                  size="sm"
                >
                  <Link href={`/curriculum/${subject.defaultSlug}`}>
                    <span>Explore Subject</span>
                    <ChevronRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    );
  };

  // Render SHS Section Component
  const renderShsSection = () => {
    if (filteredShsSubjects.length === 0) return null;

    return (
      <section key="shs-section" className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <GraduationCap className="size-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
                Senior High School Curriculum (Grades 11–12)
              </h2>
              <Badge variant="secondary" className="text-xs font-mono">
                {filteredShsSubjects.length} Subjects
              </Badge>
              {isStudentSHS && (
                <Badge
                  variant="outline"
                  className="text-xs border-primary/40 text-primary bg-primary/5 font-semibold gap-1"
                >
                  <CheckCircle2 className="size-3 text-primary" />
                  Your Grade ({studentGrade})
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
              DepEd Core, Applied, and Specialized track competencies across STEM, ABM, HUMSS, GAS, and TVL. Filtered strictly by Semester 1 and Semester 2.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {shsGradeGroups.map((gradeGroup) => {
            const isUserGradeGroup = studentGrade === gradeGroup.grade;
            return (
              <div key={gradeGroup.grade} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-primary rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    {gradeGroup.grade} Curriculum ({gradeGroup.subjects.length} Subjects)
                  </h3>
                  {isUserGradeGroup && (
                    <Badge variant="secondary" className="text-[10px] text-primary">
                      Active Grade
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {gradeGroup.subjects.map((subject) => (
                    <Card
                      key={subject.id}
                      className={cn(
                        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
                        isUserGradeGroup ? "border-primary/30" : "border-border/60"
                      )}
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary/60 opacity-0 transition-opacity group-hover:opacity-100" />

                      <CardHeader className="p-5 pb-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                            {subject.code}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {subject.strand && subject.strand !== "Core" && (
                              <Badge variant="outline" className="text-[10px] rounded-md px-1.5 py-0 border-border font-mono text-muted-foreground">
                                {subject.strand}
                              </Badge>
                            )}
                            <Badge variant="default" className="text-[10px] rounded-md px-2 py-0.5 font-medium">
                              {subject.term}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-sm sm:text-base font-bold group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                          {subject.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                          <span>{subject.grade}</span>
                          <span>•</span>
                          <span>DepEd MATATAG</span>
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="p-5 pt-0 pb-3">
                        <div className="rounded-xl bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/40 space-y-1.5">
                          <div className="flex items-center justify-between text-foreground">
                            <span className="flex items-center gap-1.5 font-medium text-xs">
                              <BookOpen className="size-3.5 text-primary" />
                              Curriculum Scope
                            </span>
                            <span className="font-semibold text-xs text-primary">
                              {targetLessons} Lessons
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>Track &amp; Semester</span>
                            <span className="font-medium text-foreground">
                              {subject.strand || "Core"} • {subject.term}
                            </span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-5 pt-0">
                        <Button
                          asChild
                          variant="secondary"
                          className="w-full gap-2 rounded-xl group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-200 text-xs font-semibold h-9"
                          size="sm"
                        >
                          <Link href={`/curriculum/${subject.defaultSlug}`}>
                            <span>Explore Subject</span>
                            <ChevronRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  // Section Ordering: prioritize user's active grade tier
  const sectionElements = isStudentSHS
    ? [renderShsSection(), renderJhsSection()]
    : [renderJhsSection(), renderShsSection()];

  return (
    <div className="space-y-10 py-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-b from-primary/10 via-background to-background p-8 sm:p-12 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            DepEd K-12 &amp; MATATAG Curriculum AI Tutor
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground font-heading">
            Master Philippine High School Subjects with{" "}
            <span className="text-primary">AI Socratic Guidance</span>
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base max-w-2xl leading-relaxed">
            Personalized for your grade level ({studentGrade}). Explore core Junior High disciplines or specialized Senior High tracks with interactive modules and multi-dialect tutoring.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 sticky top-16 z-20 bg-background/80 backdrop-blur-md py-3 border-b border-border/40">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Tabs
              value={levelFilter}
              onValueChange={(val) => {
                setLevelFilter(val as typeof levelFilter);
              }}
            >
              <TabsList className="bg-muted/80">
                <TabsTrigger value="all">
                  All Subjects ({totalCatalogCount})
                </TabsTrigger>
                <TabsTrigger value="Junior High School">
                  Junior High (Grades 7–10)
                </TabsTrigger>
                <TabsTrigger value="Senior High School">
                  Senior High (Grades 11–12)
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* JHS Quarter Filter Chips (Hidden if viewing only SHS) */}
            {levelFilter !== "Senior High School" && (
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50 text-xs">
                <Filter className="size-3.5 text-muted-foreground ml-1 mr-0.5" />
                <span className="text-[10px] font-bold text-muted-foreground px-1 uppercase tracking-wider">JHS:</span>
                <button
                  type="button"
                  onClick={() => setJhsQuarterFilter("all")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                    jhsQuarterFilter === "all"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All Quarters
                </button>
                {JHS_QUARTERS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setJhsQuarterFilter(q)}
                    className={cn(
                      "px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                      jhsQuarterFilter === q
                        ? "bg-card text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {q.replace("Quarter ", "Q")}
                  </button>
                ))}
              </div>
            )}

            {/* SHS Semester Filter Chips (Hidden if viewing only JHS) */}
            {levelFilter !== "Junior High School" && (
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50 text-xs">
                <span className="text-[10px] font-bold text-muted-foreground px-1 uppercase tracking-wider">SHS:</span>
                <button
                  type="button"
                  onClick={() => setShsSemesterFilter("all")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                    shsSemesterFilter === "all"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All Semesters
                </button>
                <button
                  type="button"
                  onClick={() => setShsSemesterFilter("Semester 1")}
                  className={cn(
                    "px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                    shsSemesterFilter === "Semester 1"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Sem 1
                </button>
                <button
                  type="button"
                  onClick={() => setShsSemesterFilter("Semester 2")}
                  className={cn(
                    "px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                    shsSemesterFilter === "Semester 2"
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Sem 2
                </button>
              </div>
            )}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm rounded-xl h-9"
            />
          </div>
        </div>

        {/* SHS Strand Filter Row (Shown if SHS is visible) */}
        {levelFilter !== "Junior High School" && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1">SHS Strands:</span>
            {(["all", "STEM", "ABM", "HUMSS", "GAS", "TVL"] as const).map((strand) => (
              <button
                key={strand}
                type="button"
                onClick={() => setShsStrandFilter(strand)}
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer border",
                  shsStrandFilter === strand
                    ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                    : "bg-muted/40 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
                )}
              >
                {strand === "all" ? "All Tracks" : strand}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Subject Sections */}
      {!hasAnyResults ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 p-12 text-center bg-card/40">
          <BookOpen className="size-10 text-muted-foreground/60" />
          <h3 className="mt-4 text-base font-semibold text-foreground">
            No subjects found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Try adjusting your search query, quarter, or semester filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setLevelFilter("all");
              setJhsQuarterFilter("all");
              setShsSemesterFilter("all");
              setShsStrandFilter("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {sectionElements}
        </div>
      )}
    </div>
  );
}
