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
  Sparkles,
  Bot,
  RefreshCw,
  Trophy,
  RotateCcw,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import type { Subject, QuizQuestion } from "../types/curriculum.types";
import { getQuizAction, recordQuizAttemptAction, translateAction } from "../actions/curriculum.actions";
import { AITutorDrawer } from "./AITutorDrawer";
import { TranslationControls } from "./TranslationControls";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/shared/components/ui/alert";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface QuizRunnerProps {
  subject: Subject;
  lessonNumber: number;
}

export function QuizRunner({ subject, lessonNumber }: QuizRunnerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as "study" | "exam") || "study";

  const [mode, setMode] = React.useState<"study" | "exam">(initialMode);
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [lessonTitle, setLessonTitle] = React.useState<string>(`Lesson ${lessonNumber}`);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [userAnswers, setUserAnswers] = React.useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [tutorOpen, setTutorOpen] = React.useState(false);
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
    const fetchQuiz = async () => {
      const res = await getQuizAction(subject.slug, lessonNumber, false);
      if (isMounted) {
        if (res.success && res.questions.length > 0) {
          setQuestions(res.questions);
          setLessonTitle(res.lessonTitle);
        }
        setLoading(false);
      }
    };

    fetchQuiz();

    return () => {
      isMounted = false;
    };
  }, [subject.slug, lessonNumber]);

  const loadQuiz = async (refresh: boolean = false) => {
    setLoading(true);
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setTranslatedContent({});

    const res = await getQuizAction(subject.slug, lessonNumber, refresh);
    if (res.success && res.questions.length > 0) {
      setQuestions(res.questions);
      setLessonTitle(res.lessonTitle);
    }
    setLoading(false);
  };

  const currentQ = questions[currentIndex];

  // Handle translation when language or question changes
  React.useEffect(() => {
    if (!currentQ || language === "English") {
      return;
    }

    let isMounted = true;
    const doTranslate = async () => {
      setIsTranslating(true);
      const [transQ, transA, transB, transC, transD, transExp] = await Promise.all([
        translateAction({ text: currentQ.question, language }),
        translateAction({ text: currentQ.options.A, language }),
        translateAction({ text: currentQ.options.B, language }),
        translateAction({ text: currentQ.options.C, language }),
        translateAction({ text: currentQ.options.D, language }),
        translateAction({ text: currentQ.explanation, language }),
      ]);

      if (isMounted) {
        setTranslatedContent({
          question: transQ.text || currentQ.question,
          options: {
            A: transA.text || currentQ.options.A,
            B: transB.text || currentQ.options.B,
            C: transC.text || currentQ.options.C,
            D: transD.text || currentQ.options.D,
          },
          explanation: transExp.text || currentQ.explanation,
        });
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
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) score++;
    });
    return score;
  };

  const handleSubmitExam = async () => {
    setIsSubmitted(true);
    const score = calculateScore();
    setSavingAttempt(true);
    await recordQuizAttemptAction({
      subjectSlug: subject.slug,
      subjectCode: subject.code,
      lessonNumber,
      lessonTitle,
      score,
      total: questions.length,
      mode,
    });
    // Invalidate queries so that returning to LessonList or Dashboard updates immediately in real-time
    await queryClient.invalidateQueries({ queryKey: ["subject-progress", subject.slug] });
    await queryClient.invalidateQueries({ queryKey: ["user-quiz-attempts"] });
    await queryClient.invalidateQueries({ queryKey: ["lessons", subject.slug] });
    router.refresh();
    setSavingAttempt(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">No questions generated</h2>
        <p className="text-sm text-muted-foreground">Unable to generate quiz questions for this lesson.</p>
        <Button onClick={() => loadQuiz(true)} className="gap-2">
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

    // DepEd DO 015 s. 2026 Transmutation
    let transmuted = 60;
    if (percent >= 100) transmuted = 100;
    else if (percent >= 60) transmuted = Math.round(75 + ((percent - 60) * 25) / 40);
    else transmuted = Math.round(60 + (percent / 60) * 14);

    const isMastered = transmuted >= 75;

    return (
      <div className="mx-auto max-w-2xl py-10 space-y-8">
        <Card className="overflow-hidden border-indigo-500/30 text-center shadow-lg">
          <div className="bg-gradient-to-b from-indigo-500/15 to-background p-8 space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Trophy className="size-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {isMastered ? "🎉 Mastery Achieved!" : "Keep Practicing!"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {subject.name} • Lesson {lessonNumber}: {lessonTitle}
              </p>
            </div>

            <div className="inline-flex items-baseline gap-2 rounded-2xl bg-card px-6 py-3 border border-border shadow-sm">
              <span className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {finalScore}
              </span>
              <span className="text-base font-semibold text-muted-foreground">
                / {questions.length} (Raw: {percent}% • Transmuted: {transmuted}%)
              </span>
            </div>

            <div className="pt-2">
              <Badge variant={isMastered ? "success" : "warning"} className="text-sm px-3 py-1 font-bold">
                {isMastered ? `Mastered Competency (${transmuted}%)` : `Needs Review (${transmuted}% < 75%)`}
              </Badge>
            </div>
          </div>

          <CardFooter className="flex flex-col gap-3 p-6 sm:flex-row sm:justify-center bg-muted/20 border-t border-border/40">
            <Button variant="outline" onClick={() => loadQuiz(false)} className="w-full sm:w-auto gap-2">
              <RotateCcw className="size-4" />
              <span>Retake Quiz</span>
            </Button>
            <Button
              onClick={async () => {
                await queryClient.invalidateQueries({ queryKey: ["subject-progress", subject.slug] });
                await queryClient.invalidateQueries({ queryKey: ["user-quiz-attempts"] });
                router.push(`/curriculum/${subject.slug}`);
              }}
              className="w-full sm:w-auto gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <BookOpen className="size-4" />
              <span>Back to Lessons</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
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

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" asChild className="w-fit -ml-2 text-muted-foreground hover:text-foreground">
          <Link href={`/curriculum/${subject.slug}`} className="flex items-center gap-1.5">
            <ArrowLeft className="size-4" />
            <span>Lessons</span>
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-3">
          <TranslationControls
            currentLanguage={language}
            onLanguageChange={setLanguage}
            isTranslating={isTranslating}
          />

          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
            <button
              onClick={() => setMode("study")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                mode === "study" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Study
            </button>
            <button
              onClick={() => setMode("exam")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                mode === "exam" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Exam
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar & Question Counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="border-border/60 shadow-md">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs font-mono">
              {subject.code} • Lesson {lessonNumber}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTutorOpen(true)}
              className="gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10"
            >
              <Bot className="size-3.5" />
              <span>Ask AI Tutor</span>
            </Button>
          </div>
          <CardTitle className="text-lg sm:text-xl font-bold leading-relaxed text-foreground pt-2">
            {displayQuestion}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          {(["A", "B", "C", "D"] as const).map((key) => {
            const isSelected = selectedAnswer === key;
            const isCorrectAnswer = currentQ.answer === key;
            const showStudyFeedback = mode === "study" && isAnswered;

            let buttonStyle = "border-border bg-card hover:bg-accent hover:border-indigo-500/40 text-foreground";
            if (isSelected) {
              buttonStyle = "border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold ring-1 ring-indigo-600";
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
                onClick={() => handleSelectOption(key)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm transition-all duration-150 cursor-pointer ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-foreground">
                    {key}
                  </span>
                  <span className="leading-snug">{displayOptions[key]}</span>
                </div>

                {showStudyFeedback && (
                  <div>
                    {isCorrectAnswer && <CheckCircle2 className="size-5 text-emerald-600" />}
                    {isSelected && !isCorrectAnswer && <XCircle className="size-5 text-destructive" />}
                  </div>
                )}
              </button>
            );
          })}

          {/* Study Mode Instant Feedback Box */}
          {mode === "study" && isAnswered && (
            <div className="mt-4 space-y-3 pt-2">
              <Alert variant={selectedAnswer === currentQ.answer ? "success" : "warning"}>
                <div className="flex items-center gap-2">
                  {selectedAnswer === currentQ.answer ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : (
                    <HelpCircle className="size-4 text-amber-600" />
                  )}
                  <AlertTitle className="text-sm font-bold">
                    {selectedAnswer === currentQ.answer ? "Correct!" : "Not quite right"}
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-1 text-xs leading-relaxed">
                  {displayExplanation}
                </AlertDescription>
              </Alert>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setTutorOpen(true)}
                className="w-full gap-2 text-xs border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10"
              >
                <Sparkles className="size-3.5" />
                <span>Ask AI Tutor to explain why with analogies</span>
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/40 p-4 bg-muted/20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="gap-1 text-xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Previous</span>
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button
              size="sm"
              onClick={handleSubmitExam}
              disabled={Object.keys(userAnswers).length === 0}
              className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <span>{savingAttempt ? "Saving..." : "Finish & Submit"}</span>
              <Trophy className="size-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={!isAnswered && mode === "study"}
              className="gap-1 text-xs"
            >
              <span>Next</span>
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Socratic AI Tutor Sliding Sheet */}
      <AITutorDrawer
        isOpen={tutorOpen}
        onOpenChange={setTutorOpen}
        subjectName={subject.name}
        subjectSlug={subject.slug}
        lessonTitle={lessonTitle}
        currentQuestion={currentQ}
        language={language}
      />

      {/* Socratic Tutor FAB */}
      <button
        onClick={() => setTutorOpen(true)}
        className="fixed bottom-6 right-6 flex size-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 z-40"
        aria-label="Open AI Tutor"
      >
        <Bot className="size-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white border border-background">
          <Sparkles className="size-2.5" />
        </span>
      </button>
    </div>
  );
}
