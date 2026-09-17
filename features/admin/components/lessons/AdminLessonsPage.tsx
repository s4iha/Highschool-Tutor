"use client";

import * as React from "react";
import {
  BookOpen,
  Sparkles,
  Edit3,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SUBJECTS } from "@/features/curriculum/utils/curriculum-data";
import { getLessonsAction } from "@/features/curriculum/actions/curriculum.actions";
import {
  useAdminSubjectLessonMaterialsQuery,
  useGenerateLessonMaterialMutation,
} from "../../hooks/useAdminPortal";
import { SubjectCombobox } from "../quiz-config/SubjectCombobox";
import { LessonEditorModal } from "./LessonEditorModal";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function AdminLessonsPage() {
  const [selectedSubjectSlug, setSelectedSubjectSlug] = React.useState<string>(
    SUBJECTS[0].slug
  );
  const [lessonSearch, setLessonSearch] = React.useState("");
  const [editingLesson, setEditingLesson] = React.useState<{
    number: number;
    title: string;
  } | null>(null);

  const selectedSubject = React.useMemo(() => {
    return (
      SUBJECTS.find((s) => s.slug === selectedSubjectSlug) || SUBJECTS[0]
    );
  }, [selectedSubjectSlug]);

  // Load curriculum outline lessons
  const { data: lessonsData, isLoading: lessonsLoading } = useQuery({
    queryKey: ["curriculum", "lessons", selectedSubjectSlug],
    queryFn: () => getLessonsAction(selectedSubjectSlug),
    staleTime: 60 * 1000,
  });

  // Load custom/saved lesson materials from DB
  const {
    data: savedMaterials = [],
    isLoading: materialsLoading,
    refetch: refetchMaterials,
  } = useAdminSubjectLessonMaterialsQuery(selectedSubjectSlug);

  const generateMutation = useGenerateLessonMaterialMutation();
  const [generatingLessonNum, setGeneratingLessonNum] = React.useState<number | null>(null);

  const lessonsToDisplay = React.useMemo(() => {
    if (lessonsData?.lessons && lessonsData.lessons.length > 0) {
      return lessonsData.lessons;
    }
    // Fallback standard 12 DepEd lessons
    return Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      title: `Lesson ${i + 1}`,
      summary: `DepEd MATATAG curriculum competencies for Lesson ${i + 1}.`,
      keyConcepts: [],
    }));
  }, [lessonsData]);

  const filteredLessons = React.useMemo(() => {
    const q = lessonSearch.trim().toLowerCase();
    if (!q) return lessonsToDisplay;
    return lessonsToDisplay.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.number.toString().includes(q) ||
        l.summary?.toLowerCase().includes(q)
    );
  }, [lessonsToDisplay, lessonSearch]);

  // Map of saved materials by lessonNumber
  const savedMaterialMap = React.useMemo(() => {
    const map = new Map<number, typeof savedMaterials[0]>();
    for (const mat of savedMaterials) {
      map.set(mat.lessonNumber, mat);
    }
    return map;
  }, [savedMaterials]);

  const handleAutoGenerate = (lessonNumber: number, title: string) => {
    setGeneratingLessonNum(lessonNumber);
    generateMutation.mutate(
      {
        slug: selectedSubjectSlug,
        lessonNumber,
        lessonTitleOverride: title,
      },
      {
        onSettled: () => {
          setGeneratingLessonNum(null);
        },
      }
    );
  };

  const curatedCount = savedMaterials.length;
  const totalLessons = lessonsToDisplay.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading flex items-center gap-2.5">
            <BookOpen className="size-7 text-primary" />
            <span>Lesson Material Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage, curate, and AI-generate student study lesson notes before quizzes across all DepEd MATATAG subjects.
          </p>
        </div>
      </div>

      {/* Subject Filter & Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Combobox Subject Selector */}
        <div className="md:col-span-2 space-y-2 p-4 rounded-2xl bg-card border border-border/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-primary" />
              <span>Select DepEd Subject</span>
            </label>
            <span className="text-[11px] text-muted-foreground">
              {SUBJECTS.length} Subjects
            </span>
          </div>

          <SubjectCombobox
            selectedSubjectSlug={selectedSubjectSlug}
            onSelectSubject={(slug) => {
              setSelectedSubjectSlug(slug);
              setLessonSearch("");
            }}
          />
        </div>

        {/* Selected Subject Overview Card */}
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
            <span className="text-muted-foreground">Curated in Database:</span>
            <Badge
              variant={curatedCount > 0 ? "default" : "secondary"}
              className={`text-[10px] ${
                curatedCount === totalLessons
                  ? "bg-success text-success-foreground"
                  : curatedCount > 0
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              {materialsLoading
                ? "Checking..."
                : `${curatedCount} / ${totalLessons} Lessons`}
            </Badge>
          </div>
        </div>
      </div>

      {/* Lesson Search Bar & Refresh */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={lessonSearch}
            onChange={(e) => setLessonSearch(e.target.value)}
            placeholder="Search lessons by title or number..."
            className="pl-8 h-9 text-xs rounded-xl bg-card border-border/60"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchMaterials()}
          className="h-9 text-xs rounded-xl gap-1.5 shrink-0 self-end sm:self-auto"
        >
          <RefreshCw className={cn("size-3", materialsLoading && "animate-spin")} />
          <span>Refresh Database Status</span>
        </Button>
      </div>

      {/* Lessons List Grid */}
      {lessonsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-card border border-border/60 space-y-3"
            >
              <Skeleton className="h-6 w-1/3 rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-8 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((lesson) => {
            const saved = savedMaterialMap.get(lesson.number);
            const isCurated = Boolean(saved);
            const isGeneratingThis = generatingLessonNum === lesson.number;

            return (
              <div
                key={lesson.number}
                className={cn(
                  "p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 bg-card",
                  isCurated
                    ? "border-border/60 hover:border-primary/40 shadow-xs"
                    : "border-dashed border-border/80 bg-muted/10 hover:border-border"
                )}
              >
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                        L{lesson.number}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Lesson {lesson.number}
                      </span>
                    </div>

                    {isCurated ? (
                      <Badge className="bg-success/15 text-success border-success/30 text-[10px] font-semibold gap-1">
                        <CheckCircle2 className="size-3" />
                        <span>Curated</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/60">
                        Starter Template
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-foreground line-clamp-1">
                    {saved?.lessonTitle || lesson.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {saved?.summary || lesson.summary || "DepEd MATATAG learning guide."}
                  </p>
                </div>

                {/* Footer and Actions */}
                <div className="space-y-3 pt-3 border-t border-border/40">
                  {saved?.updatedAt && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Clock className="size-3 shrink-0" />
                      <span>Updated {new Date(saved.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        setEditingLesson({
                          number: lesson.number,
                          title: saved?.lessonTitle || lesson.title,
                        })
                      }
                      className="flex-1 h-8 rounded-xl text-xs font-semibold gap-1.5"
                    >
                      <Edit3 className="size-3" />
                      <span>{isCurated ? "Edit Material" : "Curate / Author"}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isGeneratingThis}
                      onClick={() =>
                        handleAutoGenerate(
                          lesson.number,
                          saved?.lessonTitle || lesson.title
                        )
                      }
                      className="h-8 px-2.5 rounded-xl text-xs text-primary border-primary/30 hover:bg-primary/10 gap-1"
                      title="Auto-Generate with Google Gemini"
                    >
                      {isGeneratingThis ? (
                        <Loader2 className="size-3 animate-spin text-primary" />
                      ) : (
                        <Sparkles className="size-3 text-amber-500" />
                      )}
                      <span className="hidden sm:inline">AI Gen</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lesson Editor Modal */}
      {editingLesson && (
        <LessonEditorModal
          open={Boolean(editingLesson)}
          onOpenChange={(open) => {
            if (!open) setEditingLesson(null);
          }}
          subjectSlug={selectedSubjectSlug}
          subjectName={selectedSubject.name}
          lessonNumber={editingLesson.number}
          defaultLessonTitle={editingLesson.title}
        />
      )}
    </div>
  );
}
