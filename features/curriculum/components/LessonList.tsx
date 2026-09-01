"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, AlertCircle, Play, Sparkles, RefreshCw, Trophy } from "lucide-react";
import type { Subject, Lesson, LessonProgressStatus } from "../types/curriculum.types";
import { getLessonsAction, getSubjectProgressAction } from "../actions/curriculum.actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface LessonListProps {
  subject: Subject;
}

export function LessonList({ subject }: LessonListProps) {
  const [lessons, setLessons] = React.useState<Lesson[]>([]);
  const [progress, setProgress] = React.useState<{
    lessonScores: Record<number, { bestScore: number; status: LessonProgressStatus; attemptsCount: number }>;
    totalMastered: number;
    totalLessons: number;
  }>({ lessonScores: {}, totalMastered: 0, totalLessons: 0 });
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      const [lessonsRes, progressRes] = await Promise.all([
        getLessonsAction(subject.slug),
        getSubjectProgressAction(subject.slug),
      ]);

      if (isMounted) {
        if (lessonsRes.success) {
          setLessons(lessonsRes.lessons);
        }
        setProgress(progressRes);
        setLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [subject.slug]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const [lessonsRes, progressRes] = await Promise.all([
      getLessonsAction(subject.slug),
      getSubjectProgressAction(subject.slug),
    ]);

    if (lessonsRes.success) {
      setLessons(lessonsRes.lessons);
    }
    setProgress(progressRes);
    setRefreshing(false);
  };

  const masteryPercent = lessons.length > 0
    ? Math.round((progress.totalMastered / lessons.length) * 100)
    : 0;

  return (
    <div className="space-y-8 py-6">
      {/* Back Navigation & Subject Overview */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" asChild className="w-fit -ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/" className="flex items-center gap-1.5">
            <ArrowLeft className="size-4" />
            <span>Back to Subjects</span>
          </Link>
        </Button>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {subject.code}
              </span>
              <Badge variant={subject.level === "Senior High School" ? "default" : "secondary"} className="text-xs">
                {subject.level}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {subject.grade} • {subject.term}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl text-foreground">
              {subject.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Master each lesson competency. Take quizzes in Study mode for AI hints or Exam mode for final mastery.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="w-fit gap-1.5"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Sync Progress</span>
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 via-violet-500/5 to-background">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Trophy className="size-4 text-amber-500" />
                <span>Subject Mastery Progress</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {progress.totalMastered} of {lessons.length} lessons mastered (Score ≥ 75%)
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-64">
              <Progress value={masteryPercent} className="h-2.5 flex-1" />
              <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {masteryPercent}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
          <BookOpen className="size-5 text-indigo-500" />
          <span>Curriculum Lessons ({lessons.length})</span>
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : lessons.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No lessons generated yet for this subject.</p>
            <Button onClick={handleRefresh} size="sm" className="mt-4 gap-2">
              <Sparkles className="size-4" />
              <span>Generate Curriculum Outline</span>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {lessons.map((lesson) => {
              const stat = progress.lessonScores[lesson.number];
              const isMastered = stat?.status === "Mastered";
              const isNeedsReview = stat?.status === "Needs Review";

              return (
                <Card
                  key={lesson.number}
                  className={`transition-all hover:border-indigo-500/40 ${
                    isMastered ? "border-emerald-500/30 bg-emerald-500/[0.02]" : ""
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/10 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {lesson.number}
                        </span>
                        <CardTitle className="text-base font-bold text-foreground">
                          {lesson.title}
                        </CardTitle>
                      </div>

                      <div className="flex items-center gap-2">
                        {isMastered ? (
                          <Badge variant="success" className="gap-1 text-xs">
                            <CheckCircle2 className="size-3" />
                            <span>Mastered ({Math.round(stat.bestScore)}%)</span>
                          </Badge>
                        ) : isNeedsReview ? (
                          <Badge variant="warning" className="gap-1 text-xs">
                            <AlertCircle className="size-3" />
                            <span>Needs Review ({Math.round(stat.bestScore)}%)</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            Not Started
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-xs leading-relaxed pt-1">
                      {lesson.summary}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-3 pt-0 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {lesson.keyConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Link href={`/curriculum/${subject.slug}/quiz/${lesson.number}?mode=study`}>
                          <Sparkles className="size-3.5 text-amber-500" />
                          <span>Study Mode</span>
                        </Link>
                      </Button>

                      <Button asChild size="sm" className="gap-1.5 text-xs">
                        <Link href={`/curriculum/${subject.slug}/quiz/${lesson.number}?mode=exam`}>
                          <Play className="size-3.5 fill-current" />
                          <span>Exam Mode</span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
