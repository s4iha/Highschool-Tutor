"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  RefreshCw,
  Trophy,
  RotateCcw,
  BookOpen,
  HelpCircle,
  SlidersHorizontal,
} from "lucide-react";
import { useUser } from "@/features/auth/hooks/useUser";
import { useAiPromptsModalStore } from "@/shared/hooks/useAiPromptsModalStore";
import type { Subject, QuizQuestion } from "../types/curriculum.types";
import {
  getQuizAction,
  recordQuizAttemptAction,
  batchTranslateAction,
} from "../actions/curriculum.actions";
import {
  createQuizSessionAction,
  getQuizSessionAction,
  submitQuizSessionAction,
} from "../actions/quiz-session.actions";
import { MarkdownRenderer } from "@/shared/components/ui/MarkdownRenderer";
import { AiPromptsHelpModal } from "@/shared/components/ui/AiPromptsHelpModal";
import { AiPromptsFab } from "@/shared/components/ui/AiPromptsFab";
import { TranslationControls } from "./TranslationControls";
import { sampleQuizQuestions } from "../utils/quiz-sampler";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/shared/components/ui/alert";
import { cn } from "@/lib/utils";

interface QuizRunnerProps {
  subject: Subject;
  lessonNumber: number;
  initialSessionId?: string;
}

export function QuizRunner({ subject, lessonNumber, initialSessionId }: QuizRunnerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const openPromptsModal = useAiPromptsModalStore((s) => s.openModal);

  const [sessionId, setSessionId] = React.useState<string | null>(initialSessionId || null);
  const rawModeParam = (searchParams.get("mode") as "study" | "exam") || "study";
  const [mode, setMode] = React.useState<"study" | "exam">(rawModeParam);
  const countParam = searchParams.get("count");
  const initialCount = countParam ? Math.max(1, parseInt(countParam, 10)) : 10;

  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [selectedCount, setSelectedCount] = React.useState<number>(initialCount);
  const [lessonTitle, setLessonTitle] = React.useState<string>(`Lesson ${lessonNumber}`);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [userAnswers, setUserAnswers] = React.useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [serverScore, setServerScore] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [savingAttempt, setSavingAttempt] = React.useState(false);

  // Translation State
  const [language, setLanguage] = React.useState("English");
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [translatedContent, setTranslatedContent] = React.useState<{
    question?: string;
    options?: Record<string, string>;
    explanation?: string;
  }>({});

  React.useEffect(() => {
    let isMounted = true;
    const initSession = async () => {
      try {
        let activeSessionId = initialSessionId;
        if (!activeSessionId) {
          const res = await createQuizSessionAction({
            subjectSlug: subject.slug,
            lessonNumber,
            mode: rawModeParam,
            count: initialCount,
          });
          if (res.success && res.sessionId) {
            activeSessionId = res.sessionId;
            if (isMounted) setSessionId(res.sessionId);
          }
        }

        if (activeSessionId) {
          const sessionRes = await getQuizSessionAction(activeSessionId);
          if (isMounted && sessionRes.success && sessionRes.session) {
            setQuestions(sessionRes.session.questions);
            setLessonTitle(sessionRes.session.lessonTitle);
            setMode(sessionRes.session.mode);
            setSelectedCount(sessionRes.session.questionCount);
            if (sessionRes.session.completedAt && sessionRes.session.score !== null) {
              setIsSubmitted(true);
              setServerScore(sessionRes.session.score);
            }
          }
        } else {
          // Fallback if session creation failed
          const res = await getQuizAction(subject.slug, lessonNumber, false);
          if (isMounted && res.success && res.questions.length > 0) {
            setLessonTitle(res.lessonTitle);
            const sampled = sampleQuizQuestions(res.questions, initialCount);
            setQuestions(sampled);
          }
        }
      } catch (err) {
        console.error("Failed to initialize quiz session:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initSession();

    return () => {
      isMounted = false;
    };
  }, [subject.slug, lessonNumber, initialSessionId, initialCount, rawModeParam]);

  const loadQuiz = async () => {
    setLoading(true);
    setUserAnswers({});
    setIsSubmitted(false);
    setServerScore(null);
    setCurrentIndex(0);
    setTranslatedContent({});

    try {
      const sessRes = await createQuizSessionAction({
        subjectSlug: subject.slug,
        lessonNumber,
        mode,
        count: selectedCount,
      });
      if (sessRes.success && sessRes.sessionId) {
        setSessionId(sessRes.sessionId);
        const sessionRes = await getQuizSessionAction(sessRes.sessionId);
        if (sessionRes.success && sessionRes.session) {
          setQuestions(sessionRes.session.questions);
          setLessonTitle(sessionRes.session.lessonTitle);
          setMode(sessionRes.session.mode);
          setSelectedCount(sessionRes.session.questionCount);
        }
      }
    } catch (err) {
      console.error("Error reloading quiz session:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeSame = () => {
    loadQuiz();
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setTranslatedContent({});
  };

  const handleNext = () => {
    setTranslatedContent({});
    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
  };

  const handlePrev = () => {
    setTranslatedContent({});
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const currentQ = questions[currentIndex];

  // Batch translate the current question in a single prompt to prevent 429 bursts
  React.useEffect(() => {
    if (!currentQ || language === "English") {
      return;
    }

    let isMounted = true;
    const doTranslate = async () => {
      setIsTranslating(true);
      const res = await batchTranslateAction({
        question: currentQ.question,
        options: currentQ.options,
        explanation: currentQ.explanation,
        language,
      });

      if (isMounted) {
        if (res.success && res.data) {
          setTranslatedContent({
            question: res.data.question,
            options: res.data.options,
            explanation: res.data.explanation,
          });
        }
        setIsTranslating(false);
      }
    };

    doTranslate();

    return () => {
      isMounted = false;
    };
  }, [currentQ, language]);

  const handleSelectOption = (optionKey: "A" | "B" | "C" | "D") => {
    if (mode === "study" && userAnswers[currentIndex]) {
      return;
    }
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optionKey }));
  };

  const calculateScore = () => {
    if (serverScore !== null) return serverScore;
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] && userAnswers[idx] === q.answer) score++;
    });
    return score;
  };

  const handleSubmitExam = async () => {
    setIsSubmitted(true);
    setSavingAttempt(true);
    try {
      if (sessionId) {
        const subRes = await submitQuizSessionAction(sessionId, userAnswers);
        if (subRes.success) {
          if (subRes.score !== undefined) setServerScore(subRes.score);
          if (subRes.questions) setQuestions(subRes.questions);
        }
      } else {
        const score = calculateScore();
        setServerScore(score);
        await recordQuizAttemptAction({
          subjectSlug: subject.slug,
          subjectCode: subject.code,
          lessonNumber,
          lessonTitle,
          score,
          total: questions.length,
          mode,
        });
      }
      // Invalidate queries so that returning to LessonList or Dashboard updates immediately in real-time
      await queryClient.invalidateQueries({ queryKey: ["subject-progress", subject.slug] });
      await queryClient.invalidateQueries({ queryKey: ["user-quiz-attempts"] });
      await queryClient.invalidateQueries({ queryKey: ["lessons", subject.slug] });
      await queryClient.invalidateQueries({ queryKey: ["student", "dashboard-data"] });
      router.refresh();
    } finally {
      setSavingAttempt(false);
    }
  };

  // Improved AI Loading Card (Item #7)
  if (loading) {
    return (
      <div className="mx-auto max-w-lg py-16 px-4">
        <Card className="rounded-3xl border border-border bg-card shadow-lg text-center p-8 sm:p-12 space-y-6">
          <div className="relative mx-auto size-16 flex items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-foreground tracking-tight">
              Generating your quiz...
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed animate-pulse">
              Our AI is crafting DepEd-aligned competencies and practice questions tailored to {lessonTitle}.
            </p>
          </div>
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted text-[11px] font-semibold text-muted-foreground border border-border/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>DepEd DO 015 s. 2026 MATATAG Standards</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">No questions generated</h2>
        <p className="text-sm text-muted-foreground">Unable to generate quiz questions for this lesson.</p>
        <Button onClick={() => loadQuiz()} className="gap-2">
          <RefreshCw className="size-4" />
          <span>Regenerate Quiz</span>
        </Button>
      </div>
    );
  }

  // Quiz Results Summary View
  if (isSubmitted) {
    const finalScore = calculateScore();
    const percent = Math.round((finalScore / questions.length) * 100);

    // DepEd DO 015 s. 2026 Transmutation Formula
    let transmuted = 60;
    if (percent >= 100) {
      transmuted = 100;
    } else if (percent >= 60) {
      transmuted = Math.round(75 + ((percent - 60) * 25) / 40);
    } else {
      transmuted = Math.round(60 + (percent / 60) * 14);
    }

    const isMastered = transmuted >= 75;

    return (
      <div className="mx-auto max-w-xl py-12 px-4">
        <Card className="text-center shadow-lg border-border/80 rounded-3xl overflow-hidden">
          <div className="p-8 space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Trophy className="size-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">
                {mode === "exam" ? "Exam Completed!" : "Practice Completed!"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {subject.name} • {lessonTitle}
              </p>
            </div>

            <div className="py-2">
              <span className="text-5xl font-black text-foreground">{finalScore}</span>
              <span className="text-base font-semibold text-muted-foreground">
                / {questions.length} (Raw: {percent}% • Transmuted: {transmuted}%)
              </span>
            </div>

            <div className="pt-2">
              <Badge variant={isMastered ? "secondary" : "destructive"} className="text-sm px-3.5 py-1 font-bold">
                {isMastered ? `Mastered Competency (${transmuted}%)` : `Needs Review (${transmuted}% < 75%)`}
              </Badge>
            </div>
          </div>

          <CardFooter className="flex flex-col gap-3 p-6 sm:flex-row sm:justify-center bg-muted/20 border-t border-border/40">
            <Button variant="outline" onClick={handleRetakeSame} className="w-full sm:w-auto gap-2 rounded-xl text-xs font-bold">
              <RotateCcw className="size-4" />
              <span>Retake Quiz ({questions.length} Qs)</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/curriculum/${subject.slug}?reconfigure=${lessonNumber}`)}
              className="w-full sm:w-auto gap-2 rounded-xl text-xs font-bold"
            >
              <SlidersHorizontal className="size-4" />
              <span>Change Options</span>
            </Button>
            <Button
              onClick={async () => {
                await queryClient.invalidateQueries({ queryKey: ["subject-progress", subject.slug] });
                await queryClient.invalidateQueries({ queryKey: ["user-quiz-attempts"] });
                await queryClient.invalidateQueries({ queryKey: ["student", "dashboard-data"] });
                router.push(`/curriculum/${subject.slug}`);
              }}
              className="w-full sm:w-auto gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-xs font-bold"
            >
              <BookOpen className="size-4" />
              <span>Back to Lessons</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!currentQ) {
    return null;
  }

  const selectedAnswer = userAnswers[currentIndex];
  const isAnswered = Boolean(selectedAnswer);
  const displayQuestion =
    language !== "English" && translatedContent.question
      ? translatedContent.question
      : currentQ.question;
  const displayOptions =
    language !== "English" && translatedContent.options
      ? translatedContent.options
      : currentQ.options;
  const displayExplanation =
    language !== "English" && translatedContent.explanation
      ? translatedContent.explanation
      : currentQ.explanation;

  const isPremiumUser = user?.role === "ADMIN"; // Admin and subscribed users

  return (
    <div className="mx-auto max-w-3xl flex flex-col h-[calc(100dvh-5.5rem)] min-h-[560px] max-h-[880px] pb-2">
      {/* Top Bar Navigation (Fixed Header) */}
      <div className="shrink-0 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between mb-3">
        <Button variant="ghost" size="sm" asChild className="w-fit -ml-2 text-muted-foreground hover:text-foreground">
          <Link href={`/curriculum/${subject.slug}`} className="flex items-center gap-1.5">
            <ArrowLeft className="size-4" />
            <span className="text-xs font-bold">Lessons</span>
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-3">
          <TranslationControls
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
            isTranslating={isTranslating}
            isPremium={isPremiumUser}
          />

          {/* Locked Static Mode Badge (Item #9: Replaced cheating mode toggle) */}
          <Badge
            variant="secondary"
            className={cn(
              "text-xs font-bold px-3 py-1 rounded-xl border shadow-xs",
              mode === "study"
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            )}
          >
            {mode === "exam" ? "Exam Mode (DO 015 Graded)" : "Study Mode (Guided)"}
          </Badge>
        </div>
      </div>

      {/* Progress Bar & Question Counter */}
      <div className="shrink-0 space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="font-mono text-primary font-bold">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />
      </div>

      {/* Viewport-Constrained Question Card with Internal Scroll (Item #12) */}
      <Card className="flex-1 flex flex-col min-h-0 border-border/60 shadow-md rounded-3xl overflow-hidden">
        <CardHeader className="shrink-0 space-y-1.5 pb-2 pt-4 px-5 sm:px-6">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs font-mono font-bold">
              {subject.code} • Lesson {lessonNumber}
            </Badge>
            {mode === "study" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openPromptsModal(lessonTitle || subject.name)}
                className="gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/10 rounded-xl font-bold"
              >
                <Sparkles className="size-3.5 text-amber-500" />
                <span>AI Study Prompts</span>
              </Button>
            )}
          </div>
          <CardTitle className="text-base sm:text-lg font-bold leading-snug text-foreground pt-1">
            <MarkdownRenderer content={displayQuestion} />
          </CardTitle>
        </CardHeader>

        {/* Scrollable Question Content (Options & Feedback) */}
        <CardContent className="flex-1 overflow-y-auto space-y-2.5 pt-1 pb-4 px-5 sm:px-6 scrollbar-thin">
          {(["A", "B", "C", "D"] as const).map((key) => {
            const isSelected = selectedAnswer === key;
            const isCorrectAnswer = currentQ.answer === key;
            const showStudyFeedback = mode === "study" && isAnswered;

            let buttonStyle = "border-border bg-card hover:bg-muted/50 hover:border-primary/40 text-foreground";
            if (isSelected) {
              buttonStyle = "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary";
            }
            if (showStudyFeedback) {
              if (isCorrectAnswer) {
                buttonStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500";
              } else if (isSelected && !isCorrectAnswer) {
                buttonStyle = "border-destructive bg-destructive/15 text-destructive font-semibold ring-1 ring-destructive";
              }
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectOption(key)}
                className={`flex w-full items-center justify-between rounded-2xl border p-3.5 sm:p-4 text-left text-xs sm:text-sm transition-all duration-150 cursor-pointer ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-bold text-foreground">
                    {key}
                  </span>
                  <div className="leading-snug">
                    <MarkdownRenderer content={displayOptions?.[key] || ""} inline />
                  </div>
                </div>

                {showStudyFeedback && (
                  <div className="shrink-0 ml-2">
                    {isCorrectAnswer && <CheckCircle2 className="size-5 text-emerald-600" />}
                    {isSelected && !isCorrectAnswer && <XCircle className="size-5 text-destructive" />}
                  </div>
                )}
              </button>
            );
          })}

          {/* Study Mode Instant Feedback Box */}
          {mode === "study" && isAnswered && (
            <div className="mt-3 space-y-2.5 pt-1">
              <Alert variant={selectedAnswer === currentQ.answer ? "default" : "destructive"} className="rounded-2xl">
                <div className="flex items-center gap-2">
                  {selectedAnswer === currentQ.answer ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : (
                    <HelpCircle className="size-4 text-amber-600" />
                  )}
                  <AlertTitle className="text-xs font-bold">
                    {selectedAnswer === currentQ.answer ? "Correct!" : "Not quite right"}
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-1 text-xs leading-relaxed">
                  <MarkdownRenderer content={displayExplanation} />
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>

        {/* Pinned Footer Navigation (Always Visible Without Scrolling) */}
        <CardFooter className="shrink-0 flex items-center justify-between border-t border-border/40 p-3 sm:p-4 bg-muted/20">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="gap-1.5 text-xs font-bold rounded-xl"
          >
            <ArrowLeft className="size-3.5" />
            <span>Previous</span>
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button
              size="sm"
              onClick={handleSubmitExam}
              disabled={Object.keys(userAnswers).length === 0}
              className="gap-1.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <span>{savingAttempt ? "Saving..." : "Finish & Submit"}</span>
              <Trophy className="size-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleNext}
              disabled={!isAnswered && mode === "study"}
              className="gap-1.5 text-xs font-bold rounded-xl"
            >
              <span>Next</span>
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Pre-configured AI Study Prompts Modal & FAB (Study mode only) */}
      <AiPromptsHelpModal />
      {mode === "study" && <AiPromptsFab topic={lessonTitle || subject.name} />}
    </div>
  );
}
