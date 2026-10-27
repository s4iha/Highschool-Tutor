"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Award,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  getSubjectWeakPointsAction,
  createTargetedPracticeAction,
} from "../actions/curriculum.actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { toast } from "sonner";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";

interface SubjectWeakPointsCardProps {
  subjectSlug: string;
  className?: string;
}

export function SubjectWeakPointsCard({
  subjectSlug,
  className = "",
}: SubjectWeakPointsCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activePracticingLesson, setActivePracticingLesson] = React.useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["subject-weak-points", subjectSlug],
    queryFn: async () => {
      const res = await getSubjectWeakPointsAction(subjectSlug);
      if (res.success) {
        return res;
      }
      return null;
    },
    staleTime: 60 * 1000,
  });

  const targetedPracticeMutation = useMutation({
    mutationFn: async (lessonNumber: number) => {
      setActivePracticingLesson(lessonNumber);
      const res = await createTargetedPracticeAction({ subjectSlug, lessonNumber });
      if (!res.success || !res.redirectUrl) {
        throw new Error(res.error || "Failed to start targeted practice");
      }
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["active-quiz-session"] });
      if (res.redirectUrl) {
        router.push(res.redirectUrl);
      }
    },
    onError: (err) => {
      setActivePracticingLesson(null);
      if (err.message === "TRIAL_EXPIRED") {
        useUpgradeModalStore.getState().openUpgradeModal({
          featureName: "Targeted Practice",
          reason: "Your 30-day free trial has expired. Subscribe to an Annual or Monthly Pass to continue targeted weak-point drills.",
        });
      } else {
        toast.error(err.message || "Could not launch targeted practice");
      }
    },
  });

  if (isLoading) {
    return (
      <Card className={`rounded-2xl border-border/60 p-5 space-y-3 ${className}`}>
        <Skeleton className="h-5 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-lg" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </Card>
    );
  }

  // If no weak points exist or no attempts yet
  if (!data || data.weakPoints.length === 0) {
    return (
      <Card className={`rounded-2xl border-emerald-500/30 bg-emerald-500/5 shadow-xs p-5 ${className}`}>
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Award className="size-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Diagnostic Mastery Achieved</span>
              <Badge variant="outline" className="text-[10px] font-semibold border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                DepEd DO 015 Passing Grade ≥ 75%
              </Badge>
            </h4>
            <p className="text-xs text-muted-foreground">
              All attempted competencies for this subject currently meet or exceed the official passing threshold. Keep up the great work!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`rounded-2xl border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-background shadow-xs overflow-hidden ${className}`}>
      <CardHeader className="p-5 pb-3 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="size-4 text-amber-500 shrink-0" />
            <CardTitle className="text-sm sm:text-base font-bold">
              Diagnostic Weak Points
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] font-bold border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/15">
            {data.totalWeakPoints} {data.totalWeakPoints === 1 ? "Competency" : "Competencies"} Under 75%
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground leading-relaxed">
          Based on your latest attempt per lesson, these topics fall below the DepEd DO 015 s. 2026 passing threshold (&lt; 75%). Practice them in Socratic Study mode to strengthen your mastery.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3">
        <div className="divide-y divide-border/50 rounded-xl border border-border/60 bg-card/60 overflow-hidden">
          {data.weakPoints.map((wp) => {
            const isPracticing = activePracticingLesson === wp.lessonNumber && targetedPracticeMutation.isPending;

            return (
              <div
                key={wp.lessonNumber}
                className="p-3.5 sm:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/30"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      Lesson {wp.lessonNumber}
                    </span>
                    <span className="text-xs font-bold text-foreground truncate">
                      {wp.lessonTitle}
                    </span>
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0 font-bold shrink-0">
                      {wp.transmutedScore}% • Needs Review
                    </Badge>
                  </div>

                  {wp.keyConcepts.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Key Concepts:
                      </span>
                      {wp.keyConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/40"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={() => targetedPracticeMutation.mutate(wp.lessonNumber)}
                  disabled={isPracticing}
                  className="shrink-0 h-8 text-xs font-bold gap-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer"
                >
                  {isPracticing ? (
                    <>
                      <Loader2 className="size-3 animate-spin" />
                      <span>Starting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3 text-amber-300" />
                      <span>Targeted Practice</span>
                      <ArrowRight className="size-3" />
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
