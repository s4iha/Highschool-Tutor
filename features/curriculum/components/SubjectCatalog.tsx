"use client";

import * as React from "react";
import Link from "next/link";
import { Search, BookOpen, Sparkles, ArrowRight, GraduationCap, School } from "lucide-react";
import { SUBJECTS } from "../utils/curriculum-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export function SubjectCatalog() {
  const [search, setSearch] = React.useState("");
  const [levelFilter, setLevelFilter] = React.useState<"all" | "Junior High School" | "Senior High School">("all");
  const [gradeFilter, setGradeFilter] = React.useState<string>("all");

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

  const availableGrades = React.useMemo(() => {
    if (levelFilter === "Junior High School") return ["Grade 7", "Grade 8", "Grade 9", "Grade 10"];
    if (levelFilter === "Senior High School") return ["Grade 11", "Grade 12"];
    return ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
  }, [levelFilter]);

  return (
    <div className="space-y-8 py-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-b from-indigo-500/10 via-background to-background p-8 sm:p-12 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="size-3.5" />
            DepEd K-12 & MATATAG Curriculum AI Tutor
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            Master Philippine High School Subjects with{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              AI Socratic Guidance
            </span>
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Interactive quizzes, DepEd-aligned competencies, multi-language explanations (English, Tagalog, Cebuano, Ilocano), and real-time step-by-step tutoring powered by Google Gemini.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={levelFilter}
            onValueChange={(val) => {
              setLevelFilter(val as typeof levelFilter);
              setGradeFilter("all");
            }}
          >
            <TabsList>
              <TabsTrigger value="all">All Levels ({SUBJECTS.length})</TabsTrigger>
              <TabsTrigger value="Junior High School">Junior High (G7-10)</TabsTrigger>
              <TabsTrigger value="Senior High School">Senior High STEM (G11-12)</TabsTrigger>
            </TabsList>
          </Tabs>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            aria-label="Filter by Grade Level"
            className="h-9 rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="all">All Grades</option>
            {availableGrades.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subject or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Subject Cards Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <BookOpen className="size-10 text-muted-foreground/60" />
          <h3 className="mt-4 text-base font-semibold text-foreground">No subjects found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search query or level filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => {
            const isSHS = subject.level === "Senior High School";
            return (
              <Card
                key={subject.slug}
                className="group relative flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 transition-opacity group-hover:opacity-100" />
                
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {subject.code}
                    </span>
                    <Badge variant={isSHS ? "default" : "secondary"} className="text-[10px]">
                      {isSHS ? (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="size-3" />
                          SHS STEM
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <School className="size-3" />
                          JHS
                        </span>
                      )}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {subject.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <span>{subject.grade}</span>
                    <span>•</span>
                    <span>{subject.term}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground flex items-center justify-between">
                    <span>Curriculum Module</span>
                    <span className="font-medium text-foreground">DepEd Standard (8–12 Lessons)</span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button asChild className="w-full gap-2 group/btn" size="sm">
                    <Link href={`/curriculum/${subject.slug}`}>
                      <span>View Lessons & Practice</span>
                      <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
