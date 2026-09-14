"use client";

import * as React from "react";
import {
  FileQuestion,
  Search,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  BookOpen,
  RefreshCw,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SUBJECTS } from "@/features/curriculum/utils/curriculum-data";
import { getLessonsAction } from "@/features/curriculum/actions/curriculum.actions";
import {
  useAdminQuizDetailQuery,
  useUpdateQuizConfigMutation,
  useDeleteQuizConfigMutation,
  QuizConfigDetail,
} from "../../hooks/useAdminPortal";
import { QuizQuestionItem } from "../../schemas/adminSchemas";
import { QuizQuestionForm } from "./QuizQuestionForm";
import { SubjectCombobox } from "./SubjectCombobox";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QuizBankEditorProps {
  quizDetail: QuizConfigDetail | undefined;
  selectedSubjectSlug: string;
  selectedLesson: number;
  defaultLessonTitle?: string;
  onSave: (lessonTitle: string, questions: QuizQuestionItem[]) => void;
  onReset: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

function QuizBankEditor({
  quizDetail,
  selectedLesson,
  defaultLessonTitle,
  onSave,
  onReset,
  isSaving,
  isDeleting,
}: QuizBankEditorProps) {
  const [localQuestions, setLocalQuestions] = React.useState<QuizQuestionItem[]>(
    quizDetail?.questions || []
  );
  const [lessonTitle, setLessonTitle] = React.useState(
    quizDetail?.lessonTitle || defaultLessonTitle || `Lesson ${selectedLesson}`
  );
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleAdd = () => {
    setEditingIndex(null);
    setIsFormOpen(true);
  };

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setIsFormOpen(true);
  };

  const handleDelete = (idx: number) => {
    setLocalQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveForm = (q: QuizQuestionItem) => {
    if (editingIndex !== null) {
      setLocalQuestions((prev) => {
        const next = [...prev];
        next[editingIndex] = q;
        return next;
      });
    } else {
      setLocalQuestions((prev) => [...prev, q]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-card border border-border/60">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            L{selectedLesson}
          </div>
          <div>
            <Input
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Lesson Title..."
              className="h-7 text-xs font-bold text-foreground border-transparent hover:border-input focus:border-primary px-1 max-w-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              {localQuestions.length} Questions Configured
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isDeleting || !quizDetail?.exists}
            className="rounded-xl text-xs text-destructive border-destructive/30 hover:bg-destructive/10 gap-1"
          >
            <RotateCcw className="size-3" />
            <span>Clear Cache</span>
          </Button>
          <Button
            size="sm"
            onClick={handleAdd}
            className="rounded-xl text-xs gap-1"
          >
            <Plus className="size-3.5" />
            <span>Add Question</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onSave(lessonTitle, localQuestions)}
            disabled={isSaving || localQuestions.length === 0}
            className="rounded-xl text-xs gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Save className="size-3.5" />
            <span>{isSaving ? "Saving..." : "Save Quiz Bank"}</span>
          </Button>
        </div>
      </div>

      {/* Questions list */}
      {localQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-border/80 bg-card/50 space-y-3">
          <div className="size-12 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
            <FileQuestion className="size-6" />
          </div>
          <h3 className="font-bold text-sm text-foreground">
            No Questions Configured for Lesson {selectedLesson}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            This quiz has not been created yet. You can author questions manually, or let Google Gemini Socratic AI generate it on the first student attempt.
          </p>
          <Button
            size="sm"
            onClick={handleAdd}
            className="rounded-xl text-xs gap-1.5 mt-2"
          >
            <Plus className="size-3.5" />
            <span>Create First Question</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
          {localQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="size-6 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-xs text-foreground">
                      {q.question}
                    </p>
                    {q.explanation && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <HelpCircle className="size-3 text-primary shrink-0" />
                        <span>{q.explanation}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(idx)}
                    className="size-7 rounded-lg"
                    title="Edit question"
                  >
                    <Edit2 className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(idx)}
                    className="size-7 rounded-lg text-destructive hover:text-destructive"
                    title="Delete question"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Choices Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border/40">
                {(["A", "B", "C", "D"] as const).map((optKey) => {
                  const isCorrect = q.answer === optKey;
                  const optText = q.options?.[optKey] || "";

                  return (
                    <div
                      key={optKey}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs border ${
                        isCorrect
                          ? "bg-success/10 border-success/30 text-success-foreground font-semibold"
                          : "bg-muted/20 border-border/40 text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`size-5 rounded-md text-[10px] font-mono flex items-center justify-center font-bold ${
                          isCorrect
                            ? "bg-success text-success-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {optKey}
                      </span>
                      <span className="truncate text-[11px]">{optText}</span>
                      {isCorrect && (
                        <CheckCircle className="size-3.5 text-success ml-auto shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question Form Modal */}
      <QuizQuestionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        question={editingIndex !== null ? localQuestions[editingIndex] : null}
        onSave={handleSaveForm}
      />
    </div>
  );
}

export function AdminQuizConfigPage() {
  const [selectedSubjectSlug, setSelectedSubjectSlug] = React.useState(
    SUBJECTS[0]?.slug || "g7-t1-math"
  );
  const [selectedLesson, setSelectedLesson] = React.useState(1);
  const [lessonSearch, setLessonSearch] = React.useState("");

  const selectedSubject = React.useMemo(() => {
    return SUBJECTS.find((s) => s.slug === selectedSubjectSlug) || SUBJECTS[0];
  }, [selectedSubjectSlug]);

  // Query real curriculum lessons for the selected subject
  const { data: curriculumLessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["admin-curriculum-lessons", selectedSubjectSlug],
    queryFn: async () => {
      const res = await getLessonsAction(selectedSubjectSlug);
      return res.success ? res.lessons : [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const lessonsToDisplay = React.useMemo(() => {
    if (curriculumLessons.length > 0) {
      return curriculumLessons;
    }
    return Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      title: `Lesson ${i + 1}`,
      summary: "Competency outline will load or generate on first request.",
      keyConcepts: [] as string[],
    }));
  }, [curriculumLessons]);

  const activeLessonObj = lessonsToDisplay.find((l) => l.number === selectedLesson);

  const filteredLessons = React.useMemo(() => {
    if (!lessonSearch.trim()) return lessonsToDisplay;
    const q = lessonSearch.toLowerCase();
    return lessonsToDisplay.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.number.toString().includes(q) ||
        l.summary?.toLowerCase().includes(q)
    );
  }, [lessonsToDisplay, lessonSearch]);

  const {
    data: quizDetail,
    isLoading: quizLoading,
    isFetching,
  } = useAdminQuizDetailQuery(selectedSubjectSlug, selectedLesson);

  const updateQuiz = useUpdateQuizConfigMutation();
  const deleteQuiz = useDeleteQuizConfigMutation();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);

  const handleSave = (lessonTitle: string, questions: QuizQuestionItem[]) => {
    updateQuiz.mutate({
      slug: selectedSubjectSlug,
      lessonNumber: selectedLesson,
      data: {
        lessonTitle,
        questions,
      },
    });
  };

  const handleReset = () => {
    setIsResetConfirmOpen(true);
  };

  const handleSubjectChange = (slug: string) => {
    setSelectedSubjectSlug(slug);
    setSelectedLesson(1);
    setLessonSearch("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Quiz &amp; Lesson Question Configuration
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Curate questions, correct answers, and Socratic hints for all 130+ DepEd subjects.
          </p>
        </div>
      </div>

      {/* Subject Filter & Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Searchable Combobox Subject Selector */}
        <div className="md:col-span-2 space-y-2 p-4 rounded-2xl bg-card border border-border/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-primary" />
              <span>Select DepEd Subject</span>
            </label>
            <span className="text-[11px] text-muted-foreground">
              {SUBJECTS.length} Available Subjects (Grouped by Grade)
            </span>
          </div>

          <SubjectCombobox
            selectedSubjectSlug={selectedSubjectSlug}
            onSelectSubject={handleSubjectChange}
          />
        </div>

        {/* Selected Subject Info Card */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] font-mono">
                {selectedSubject.code}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {selectedSubject.grade}
              </span>
            </div>
            <h4 className="font-bold text-xs text-foreground line-clamp-1">
              {selectedSubject.name}
            </h4>
            <p className="text-[11px] text-muted-foreground">
              {selectedSubject.level} • {selectedSubject.term}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border/40">
            <span className="text-muted-foreground">Quiz Cache Status:</span>
            <Badge
              variant={quizDetail?.exists ? "default" : "secondary"}
              className={`text-[10px] ${
                quizDetail?.exists ? "bg-success text-success-foreground" : ""
              }`}
            >
              {quizDetail?.exists ? "Configured in DB" : "Not Cached"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Master-Detail Layout: Lessons on Left, Quiz Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Lessons List Card Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-primary" />
              <span>Curriculum Lessons ({lessonsToDisplay.length})</span>
            </label>
            {lessonsLoading && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <RefreshCw className="size-2.5 animate-spin text-primary" />
                Loading...
              </span>
            )}
          </div>

          {/* Quick Search for Lesson Titles */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              value={lessonSearch}
              onChange={(e) => setLessonSearch(e.target.value)}
              placeholder="Search lesson name..."
              className="h-8 pl-8 text-xs rounded-xl bg-card border-border/60"
            />
          </div>

          {/* Vertical list of lesson cards */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredLessons.map((lesson) => {
              const isSelected = selectedLesson === lesson.number;
              return (
                <button
                  key={lesson.number}
                  type="button"
                  onClick={() => setSelectedLesson(lesson.number)}
                  className={cn(
                    "w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                      : "border-border/60 bg-card hover:border-border hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          "flex size-6 items-center justify-center rounded-lg font-mono text-[10px] font-bold shrink-0",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        L{lesson.number}
                      </span>
                      <h4
                        className={cn(
                          "text-xs truncate",
                          isSelected ? "font-bold text-primary" : "font-semibold text-foreground"
                        )}
                      >
                        {lesson.title}
                      </h4>
                    </div>

                    {isSelected && (
                      <Badge variant="default" className="text-[9px] px-1.5 py-0 shrink-0 font-semibold">
                        Editing
                      </Badge>
                    )}
                  </div>

                  {lesson.summary && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {lesson.summary}
                    </p>
                  )}

                  {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {lesson.keyConcepts.slice(0, 2).map((kc, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted/70 text-muted-foreground font-medium truncate max-w-[140px]"
                        >
                          {kc}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Questions Workspace Editor (8 cols) */}
        <div className="lg:col-span-8">
          {quizLoading || isFetching ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-44 w-full rounded-2xl" />
            </div>
          ) : (
            <QuizBankEditor
              key={`${selectedSubjectSlug}-${selectedLesson}-${quizDetail?.id || "draft"}`}
              quizDetail={quizDetail}
              selectedSubjectSlug={selectedSubjectSlug}
              selectedLesson={selectedLesson}
              defaultLessonTitle={activeLessonObj?.title}
              onSave={handleSave}
              onReset={handleReset}
              isSaving={updateQuiz.isPending}
              isDeleting={deleteQuiz.isPending}
            />
          )}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title="Clear Cached Quiz"
        description="Are you sure you want to clear this cached quiz? The system will generate a fresh quiz upon the next student attempt."
        confirmLabel="Clear Quiz"
        variant="destructive"
        isLoading={deleteQuiz.isPending}
        onConfirm={() => {
          deleteQuiz.mutate(
            {
              slug: selectedSubjectSlug,
              lessonNumber: selectedLesson,
            },
            {
              onSettled: () => setIsResetConfirmOpen(false),
            }
          );
        }}
      />
    </div>
  );
}
