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
} from "lucide-react";
import { toast } from "sonner";
import type { Subject, Lesson, LessonProgressStatus } from "../types/curriculum.types";
import { getLessonsAction, getSubjectProgressAction } from "../actions/curriculum.actions";
import { canAccessLesson, FREE_TIER_MAX_LESSONS_PER_SUBJECT } from "../utils/tier-guardrails";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
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

interface LessonListProps {
  subject: Subject;
  isSubscribed?: boolean;
}

export function LessonList({ subject, isSubscribed = false }: LessonListProps) {
  const [lessons, setLessons] = React.useState<Lesson[]>([]);
  const [progress, setProgress] = React.useState<{
    lessonScores: Record<
      number,
      { bestScore: number; status: LessonProgressStatus; attemptsCount: number }
    >;
    totalMastered: number;
    totalLessons: number;
  }>({ lessonScores: {}, totalMastered: 0, totalLessons: 0 });
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const { openUpgradeModal } = useUpgradeModalStore();

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

  const masteryPercent =
    lessons.length > 0
      ? Math.round((progress.totalMastered / lessons.length) * 100)
      : 0;

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
          <Link href="/" className="flex items-center gap-1.5">
            <ArrowLeft className="size-4" />
            <span>Back to Subjects</span>
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
                  Free Tier (3 Lessons Free)
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

      {/* Progress Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/5 to-background rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Trophy className="size-4 text-amber-500" />
                <span>Subject Mastery Progress</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {progress.totalMastered} of {lessons.length} lessons mastered
                (Passing Grade ≥ 75%)
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-64">
              <Progress value={masteryPercent} className="h-2.5 flex-1" />
              <span className="font-mono text-sm font-bold text-primary">
                {masteryPercent}%
              </span>
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
              Lessons 1–3 Unlocked • 4+ Require Premium
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
              const isAccessible = canAccessLesson(lesson.number, isSubscribed);

              return (
                <Card
                  key={lesson.number}
                  className={`transition-all rounded-2xl border border-border/60 ${
                    !isAccessible
                      ? "opacity-80 bg-muted/30 hover:border-amber-500/40"
                      : isMastered
                      ? "border-success/40 bg-success/5"
                      : "hover:border-primary/40 bg-card"
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
                        <CardTitle className="text-base font-bold text-foreground">
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
                            <span>Mastered ({Math.round(stat.bestScore)}%)</span>
                          </Badge>
                        ) : isNeedsReview ? (
                          <Badge variant="secondary" className="gap-1 text-xs bg-warning/20 text-warning-foreground">
                            <AlertCircle className="size-3" />
                            <span>Needs Review ({Math.round(stat.bestScore)}%)</span>
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
                        <>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs rounded-xl"
                          >
                            <Link
                              href={`/curriculum/${subject.slug}/quiz/${lesson.number}?mode=study`}
                            >
                              <Sparkles className="size-3.5 text-primary" />
                              <span>Study Mode</span>
                            </Link>
                          </Button>

                          <Button
                            asChild
                            size="sm"
                            className="gap-1.5 text-xs rounded-xl"
                          >
                            <Link
                              href={`/curriculum/${subject.slug}/quiz/${lesson.number}?mode=exam`}
                            >
                              <Play className="size-3.5 fill-current" />
                              <span>Exam Mode</span>
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={(e) => handleLockedLessonClick(e, lesson)}
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
    </div>
  );
}
