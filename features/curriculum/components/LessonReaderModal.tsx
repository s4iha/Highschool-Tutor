"use client";

import * as React from "react";
import {
  BookOpen,
  Play,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  GraduationCap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { MarkdownRenderer } from "@/shared/components/ui/MarkdownRenderer";
import { getLessonMaterialAction } from "../actions/lesson-material.actions";
import { useAiPromptsModalStore } from "@/shared/hooks/useAiPromptsModalStore";

interface LessonReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectSlug: string;
  subjectName: string;
  lessonNumber: number;
  lessonTitle: string;
  onStartQuiz: () => void;
}

export function LessonReaderModal({
  isOpen,
  onClose,
  subjectSlug,
  subjectName,
  lessonNumber,
  lessonTitle,
  onStartQuiz,
}: LessonReaderModalProps) {
  const openPromptsModal = useAiPromptsModalStore((s) => s.openModal);

  const { data: result, isLoading } = useQuery({
    queryKey: ["lesson-material", subjectSlug, lessonNumber],
    queryFn: () => getLessonMaterialAction(subjectSlug, lessonNumber),
    enabled: isOpen && !!subjectSlug && lessonNumber > 0,
    staleTime: 1000 * 60 * 10,
  });

  const material = result?.material;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl rounded-3xl p-5 sm:p-7 bg-card border-border/70 shadow-2xl max-h-[92vh] flex flex-col">
        <DialogHeader className="space-y-2 text-left shrink-0 pb-3 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                {lessonNumber}
              </span>
              <Badge variant="outline" className="text-[10px] font-semibold">
                {subjectName}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openPromptsModal(material?.lessonTitle || lessonTitle)}
                className="h-7 px-2 text-[11px] font-bold text-primary hover:bg-primary/10 rounded-lg gap-1.5"
              >
                <Sparkles className="size-3 text-amber-500" />
                <span>AI Prompts for this Lesson</span>
              </Button>
            </div>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-black font-heading text-foreground">
            {material?.lessonTitle || lessonTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground line-clamp-2">
            {material?.summary || `DepEd MATATAG study notes, competencies, and review material.`}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Lesson Content Body */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 min-h-[320px]">
          {isLoading ? (
            <div className="space-y-4 py-2">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-6 w-1/2 rounded-lg" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ) : material?.content ? (
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
              <MarkdownRenderer content={material.content} />
            </div>
          ) : (
            <div className="p-8 text-center space-y-3">
              <BookOpen className="size-8 mx-auto text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground">
                No lesson text available for this topic yet.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl text-xs font-semibold cursor-pointer order-2 sm:order-1"
          >
            Back to Lessons
          </Button>

          <Button
            size="sm"
            onClick={() => {
              onClose();
              onStartQuiz();
            }}
            className="w-full sm:w-auto rounded-xl text-xs font-bold gap-2 bg-primary text-primary-foreground shadow-md shadow-primary/20 cursor-pointer order-1 sm:order-2"
          >
            <Play className="size-3.5 fill-current" />
            <span>Ready? Take Practice Quiz</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
