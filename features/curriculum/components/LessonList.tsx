"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Play,
  Sparkles,
  RefreshCw,
  Trophy,
  Lock,
  Crown,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Subject, Lesson } from "../types/curriculum.types";
import { getLessonsAction, getSubjectProgressAction } from "../actions/curriculum.actions";
import { canAccessLesson } from "../utils/tier-guardrails";
import { usePublicConfigQuery } from "@/features/settings";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { GradeTermPicker } from "./GradeTermPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

interface LessonListProps {
  subject: Subject;
  isSubscribed?: boolean;
}

export function LessonList({ subject, isSubscribed = false }: LessonListProps) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedLessonForMode, setSelectedLessonForMode] = React.useState<Lesson | null>(null);
  const [selectedCount, setSelectedCount] = React.useState<number>(10);

  const { openUpgradeModal } = useUpgradeModalStore();
  const { data: config } = usePublicConfigQuery();
  const maxFreeLessons = config?.maxFreeLessons ?? 3;

  const { data: lessons = [], isLoading: loadingLessons } = useQuery({
    queryKey: ["lessons", subject.slug],
    queryFn: async () => {
      const res = await getLessonsAction(subject.slug);
      return res.success ? res.lessons : [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: progressData, isLoading: loadingProgress, refetch: refetchProgress } = useQuery({
    queryKey: ["subject-progress", subject.slug],
    queryFn: async () => {
      return await getSubjectProgressAction(subject.slug);
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const progress = progressData || {
    lessonScores: {},
    totalAttempted: 0,
    totalMastered: 0,
    totalLessons: 0,
  };

  const loading = loadingLessons || loadingProgress;

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["lessons", subject.slug] }),
      queryClient.invalidateQueries({ queryKey: ["subject-progress", subject.slug] }),
    ]);
    await refetchProgress();
    setRefreshing(false);
    toast.success("Progress Synchronized", {
      description: "Latest scores and lesson outlines have been updated.",
    });
  };

  const handleLockedLessonClick = (e: React.MouseEvent, lesson: Lesson) => {
    e.preventDefault();
    openUpgradeModal({
      featureName: lesson.title,
      reason: `Unlock all 12 lessons & full DepEd competencies for ${subject.name}.`,
    });
  };

  const totalLessonsCount = lessons.length > 0 ? lessons.length : 12;
  const attemptedCount = progress.totalAttempted || 0;
  const masteredCount = progress.totalMastered || 0;

  // Real-time progress percentages
  const progressPercent = Math.min(
    100,
    Math.round((attemptedCount / totalLessonsCount) * 100)
  );
  const masteryPercent = Math.min(
    100,
    Math.round((masteredCount / totalLessonsCount) * 100)
  );

  return (
    <div className="space-y-8 py-6">
      {/* Back Navigation & Subject Overview */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/curriculum" className="flex items-center gap-1.5">
            <ArrowLeft className="size-4" />
            <span>Back to Curriculum Catalog</span>
          </Link>
        </Button>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                {subject.code}
              </span>
              <Badge
                variant={
                  subject.level === "Senior High School"
                    ? "default"
                    : "secondary"
                }
                className="text-xs"
              >
                {subject.level}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {subject.grade} • {subject.term}
              </Badge>
              {!isSubscribed && (
                <Badge
                  variant="outline"
                  className="text-xs border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10 gap-1"
                >
                  <Sparkles className="size-3" />
                  Free Tier ({maxFreeLessons} Lessons Free)
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl text-foreground font-heading">
              {subject.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Master each lesson competency. Practice in Study mode for AI Socratic hints or take Exam mode for graded mastery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isSubscribed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  openUpgradeModal({
                    featureName: subject.name,
                    reason: "Upgrade to unlock all lessons and unlimited AI tutoring.",
                  })
                }
                className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
              >
                <Crown className="size-3.5" />
                <span>Upgrade Plan</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="w-fit gap-1.5"
            >
              <RefreshCw
                className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>Sync</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Grade & Term Picker for JHS Subjects */}
      <GradeTermPicker subject={subject} />

      {/* Progress Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/5 to-background rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Trophy className="size-4 text-amber-500" />
                <span>Subject Mastery Progress</span>
                {attemptedCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-bold"
                  >
                    {masteredCount} Mastered •{" "}
                    {attemptedCount - masteredCount > 0
                      ? `${attemptedCount - masteredCount} Needs Review`
                      : "All Passed"}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {attemptedCount} of {totalLessonsCount} lessons completed •{" "}
                {masteredCount} mastered (DepEd DO 015 Passing Grade ≥ 75%)
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-64">
              <Progress value={progressPercent} className="h-2.5 flex-1" />
              <div className="flex flex-col items-end shrink-0">
                <span className="font-mono text-sm font-bold text-primary">
                  {progressPercent}%
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {masteryPercent}% mastered
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2 font-heading">
            <BookOpen className="size-5 text-primary" />
            <span>Curriculum Lessons ({lessons.length})</span>
          </h2>
          {!isSubscribed && (
            <span className="text-xs text-muted-foreground">
              Lessons 1–{maxFreeLessons} Unlocked • {maxFreeLessons + 1}+ Require Premium
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : lessons.length === 0 ? (
          <Card className="p-8 text-center rounded-2xl border-dashed border-border/70">
            <p className="text-sm text-muted-foreground">
              No lessons loaded yet for this subject.
            </p>
            <Button onClick={handleRefresh} size="sm" className="mt-4 gap-2 rounded-xl">
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
              const isAccessible = canAccessLesson(lesson.number, isSubscribed, maxFreeLessons);

              return (
                <Card
                  key={lesson.number}
                  onClick={(e) => {
                    if (isAccessible) {
                      setSelectedLessonForMode(lesson);
                    } else {
                      handleLockedLessonClick(e, lesson);
                    }
                  }}
                  className={`group cursor-pointer transition-all duration-200 rounded-2xl border border-border/60 hover:shadow-md ${
                    !isAccessible
                      ? "opacity-80 bg-muted/30 hover:border-amber-500/40"
                      : isMastered
                      ? "border-success/40 bg-success/5 hover:border-success/60"
                      : "hover:border-primary/50 bg-card"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex size-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                            !isAccessible
                              ? "bg-muted text-muted-foreground"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {lesson.number}
                        </span>
                        <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {lesson.title}
                        </CardTitle>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isAccessible ? (
                          <Badge
                            variant="outline"
                            className="gap-1 text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                          >
                            <Lock className="size-3" />
                            <span>Premium Tier</span>
                          </Badge>
                        ) : isMastered ? (
                          <Badge variant="default" className="gap-1 text-xs bg-success text-success-foreground hover:bg-success">
                            <CheckCircle2 className="size-3" />
                            <span>Mastered ({stat.transmutedGrade}%)</span>
                          </Badge>
                        ) : isNeedsReview ? (
                          <Badge variant="secondary" className="gap-1 text-xs bg-warning/20 text-warning-foreground">
                            <AlertCircle className="size-3" />
                            <span>Needs Review ({stat.transmutedGrade}%)</span>
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs text-muted-foreground"
                          >
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
                      {isAccessible ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                          <Play className="size-3.5 fill-current" />
                          <span>Practice Lesson</span>
                          <ArrowRight className="size-3.5" />
                        </div>
                      ) : (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLockedLessonClick(e, lesson);
                          }}
                          variant="secondary"
                          size="sm"
                          className="gap-1.5 text-xs rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                        >
                          <Lock className="size-3.5" />
                          <span>Unlock Lesson</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Mode & Quiz Setup Selection Modal */}
      {selectedLessonForMode && (
        <Dialog
          open={!!selectedLessonForMode}
          onOpenChange={(open) => !open && setSelectedLessonForMode(null)}
        >
          <DialogContent className="sm:max-w-lg rounded-3xl p-6">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
                <BookOpen className="size-4" />
                <span>Lesson {selectedLessonForMode.number}</span>
              </div>
              <DialogTitle className="text-xl font-bold font-heading text-foreground">
                {selectedLessonForMode.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Configure quiz items and select your preferred learning mode for this DepEd competency.
              </DialogDescription>
            </DialogHeader>

            {/* Question Count Selection */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  1. Number of Questions
                </label>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Clock className="size-3 text-primary" />
                  Est. {Math.max(1, Math.round(selectedCount * 1.5))} mins
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 15, 20].map((count) => {
                  const isSelected = selectedCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setSelectedCount(count)}
                      className={cn(
                        "py-2 px-1 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-xs scale-102 ring-1 ring-primary"
                          : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40"
                      )}
                    >
                      <span className="text-sm font-extrabold font-mono">{count}</span>
                      <span className="text-[9px] uppercase tracking-wider font-semibold">Qs</span>
                    </button>
                  );
                })}
                {/* All 24 Questions */}
                <button
                  type="button"
                  onClick={() => setSelectedCount(24)}
                  className={cn(
                    "py-2 px-1 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                    selectedCount === 24
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs scale-102 ring-1 ring-primary"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40"
                  )}
                >
                  <span className="text-sm font-extrabold font-mono">All</span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold">24 Qs</span>
                </button>
              </div>
            </div>

            {/* Mode Selection Cards */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-foreground">
                2. Select Mode &amp; Start
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Study Mode Card */}
                <div className="p-4 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                        <Sparkles className="size-4" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                        Untimed &amp; Guided
                      </Badge>
                    </div>
                    <h3 className="font-bold text-sm text-foreground">Study Mode</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Instant feedback, Socratic hints, and step-by-step Gemini AI explanations.
                    </p>
                  </div>

                  <Button asChild size="sm" variant="outline" className="w-full rounded-xl text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
                    <Link
                      href={`/curriculum/${subject.slug}/quiz/${selectedLessonForMode.number}?mode=study&count=${selectedCount}`}
                      onClick={() => setSelectedLessonForMode(null)}
                    >
                      <Sparkles className="size-3.5" />
                      <span>Start Study Mode</span>
                    </Link>
                  </Button>
                </div>

                {/* Exam Mode Card */}
                <div className="p-4 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Trophy className="size-4" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        DO 015 Graded
                      </Badge>
                    </div>
                    <h3 className="font-bold text-sm text-foreground">Exam Mode</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Formal simulation with score recording &amp; DO 015 s. 2026 grade transmutation.
                    </p>
                  </div>

                  <Button asChild size="sm" className="w-full rounded-xl text-xs font-bold gap-1.5 shadow-xs">
                    <Link
                      href={`/curriculum/${subject.slug}/quiz/${selectedLessonForMode.number}?mode=exam&count=${selectedCount}`}
                      onClick={() => setSelectedLessonForMode(null)}
                    >
                      <Play className="size-3.5 fill-current" />
                      <span>Start Exam Mode</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

