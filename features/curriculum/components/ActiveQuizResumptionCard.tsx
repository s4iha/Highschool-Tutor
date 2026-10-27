"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, ArrowRight } from "lucide-react";
import { getActiveQuizSessionAction, discardQuizSessionAction } from "../actions/quiz-session.actions";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { toast } from "sonner";

interface ActiveQuizResumptionCardProps {
  subjectSlug?: string;
  className?: string;
}

export function ActiveQuizResumptionCard({
  subjectSlug,
  className = "",
}: ActiveQuizResumptionCardProps) {
  const queryClient = useQueryClient();
  const [isConfirmingDiscard, setIsConfirmingDiscard] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["active-quiz-session", subjectSlug ?? "global"],
    queryFn: async () => {
      const res = await getActiveQuizSessionAction(subjectSlug);
      if (res.success && res.activeSession) {
        return res.activeSession;
      }
      return null;
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  const discardMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await discardQuizSessionAction(sessionId);
      if (!res.success) {
        throw new Error(res.error || "Failed to discard quiz session");
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-quiz-session"] });
      toast.info("In-progress quiz session discarded.");
      setIsConfirmingDiscard(false);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to discard quiz");
    },
  });

  if (isLoading || !data) {
    return null;
  }

  const answeredPercent = Math.min(
    100,
    Math.round((data.answeredCount / Math.max(1, data.questionCount)) * 100)
  );

  const resumeHref = `/curriculum/${data.subjectSlug}/quiz/${data.lessonNumber}?sessionId=${data.id}&mode=${data.mode}`;

  return (
    <Card className={`border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-background shadow-sm rounded-2xl overflow-hidden ${className}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
              >
                In-Progress Quiz
              </Badge>
              <Badge variant="secondary" className="text-[10px] font-medium">
                {data.mode === "exam" ? "Exam Mode" : "Study Mode"}
              </Badge>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
              {data.lessonTitle}
            </h3>

            <p className="text-xs text-muted-foreground">
              Question {data.activeQuestionIndex + 1} of {data.questionCount} • {data.answeredCount} answered ({answeredPercent}%)
            </p>

            <div className="w-full sm:w-48 pt-1">
              <Progress value={answeredPercent} className="h-1.5" />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
            {isConfirmingDiscard ? (
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => discardMutation.mutate(data.id)}
                  disabled={discardMutation.isPending}
                  className="h-8 text-xs font-bold rounded-xl"
                >
                  Confirm Discard
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsConfirmingDiscard(false)}
                  disabled={discardMutation.isPending}
                  className="h-8 text-xs rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsConfirmingDiscard(true)}
                className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl gap-1"
                title="Discard in-progress session"
              >
                <Trash2 className="size-3.5" />
                <span>Discard</span>
              </Button>
            )}

            <Button
              size="sm"
              asChild
              className="h-8 text-xs font-bold gap-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer"
            >
              <Link href={resumeHref}>
                <span>Resume Quiz</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
