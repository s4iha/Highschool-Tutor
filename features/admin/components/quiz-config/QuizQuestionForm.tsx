"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { QuizQuestionItem } from "../../schemas/adminSchemas";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";

interface QuizQuestionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuizQuestionItem | null;
  onSave: (question: QuizQuestionItem) => void;
}

function QuizQuestionInnerForm({
  question,
  onSave,
  onClose,
}: {
  question: QuizQuestionItem | null;
  onSave: (question: QuizQuestionItem) => void;
  onClose: () => void;
}) {
  const [questionText, setQuestionText] = React.useState(question?.question || "");
  const [optionA, setOptionA] = React.useState(question?.options?.A || "");
  const [optionB, setOptionB] = React.useState(question?.options?.B || "");
  const [optionC, setOptionC] = React.useState(question?.options?.C || "");
  const [optionD, setOptionD] = React.useState(question?.options?.D || "");
  const [answer, setAnswer] = React.useState<"A" | "B" | "C" | "D">(
    question?.answer || "A"
  );
  const [explanation, setExplanation] = React.useState(question?.explanation || "");
  const [error, setError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setError("Please enter the question text.");
      return;
    }
    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setError("All 4 options (A, B, C, D) are required.");
      return;
    }

    onSave({
      question: questionText.trim(),
      options: {
        A: optionA.trim(),
        B: optionB.trim(),
        C: optionC.trim(),
        D: optionD.trim(),
      },
      answer,
      explanation: explanation.trim(),
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="text-base font-bold font-heading">
          {question ? "Edit Quiz Question" : "Add New Quiz Question"}
        </DialogTitle>
        <DialogDescription className="text-xs">
          Configure question statement, choices A through D, and the Socratic explanation.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-4">
        {error && (
          <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            {error}
          </div>
        )}

        {/* Question Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Question Statement
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="e.g. Which of the following defines a one-to-one function?"
            rows={3}
            className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Options A to D */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Answer Choices</span>
            <span className="text-[11px] text-muted-foreground font-normal">
              Select the radio button next to the correct answer.
            </span>
          </label>

          {(["A", "B", "C", "D"] as const).map((optKey) => {
            const val =
              optKey === "A"
                ? optionA
                : optKey === "B"
                ? optionB
                : optKey === "C"
                ? optionC
                : optionD;
            const setter =
              optKey === "A"
                ? setOptionA
                : optKey === "B"
                ? setOptionB
                : optKey === "C"
                ? setOptionC
                : setOptionD;

            return (
              <div
                key={optKey}
                className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${
                  answer === optKey
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/60 bg-card"
                }`}
              >
                <input
                  type="radio"
                  id={`opt-${optKey}`}
                  name="correctAnswer"
                  checked={answer === optKey}
                  onChange={() => setAnswer(optKey)}
                  className="size-4 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`opt-${optKey}`}
                  className="font-bold text-xs font-mono w-6 shrink-0"
                >
                  {optKey}:
                </label>
                <Input
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={`Option ${optKey} text...`}
                  className="h-8 text-xs rounded-lg"
                />
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <HelpCircle className="size-3.5 text-primary" />
            <span>Socratic Explanation (DepEd Rationale)</span>
          </label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain why the correct option is right and how it adheres to DepEd learning competencies..."
            rows={2}
            className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="rounded-xl text-xs"
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" className="rounded-xl text-xs">
          {question ? "Update Question" : "Add to Bank"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function QuizQuestionForm({
  open,
  onOpenChange,
  question,
  onSave,
}: QuizQuestionFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {open && (
          <QuizQuestionInnerForm
            key={question ? `${question.question}-${question.answer}` : "new"}
            question={question}
            onSave={onSave}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
