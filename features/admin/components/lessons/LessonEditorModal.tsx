"use client";

import * as React from "react";
import {
  Sparkles,
  Save,
  Eye,
  Edit3,
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { MarkdownRenderer } from "@/shared/components/ui/MarkdownRenderer";
import {
  useAdminLessonMaterialQuery,
  useSaveLessonMaterialMutation,
  useGenerateLessonMaterialMutation,
} from "../../hooks/useAdminPortal";

interface LessonEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectSlug: string;
  subjectName: string;
  lessonNumber: number;
  defaultLessonTitle: string;
}

export function LessonEditorModal({
  open,
  onOpenChange,
  subjectSlug,
  subjectName,
  lessonNumber,
  defaultLessonTitle,
}: LessonEditorModalProps) {
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">("edit");
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [content, setContent] = React.useState("");
  const [hasInitialized, setHasInitialized] = React.useState(false);

  const { data: material, isLoading } = useAdminLessonMaterialQuery(
    subjectSlug,
    lessonNumber
  );

  const saveMutation = useSaveLessonMaterialMutation();
  const generateMutation = useGenerateLessonMaterialMutation();

  // Initialize or reset form state when modal opens or query loads
  React.useEffect(() => {
    if (open && material && (!hasInitialized || material.lessonNumber === lessonNumber)) {
      setTitle(material.lessonTitle || defaultLessonTitle);
      setSummary(material.summary || "");
      setContent(material.content || "");
      setHasInitialized(true);
    }
  }, [open, material, lessonNumber, defaultLessonTitle, hasInitialized]);

  // Reset flag on close
  React.useEffect(() => {
    if (!open) {
      setHasInitialized(false);
      setActiveTab("edit");
    }
  }, [open]);

  const handleGenerateAi = () => {
    generateMutation.mutate(
      {
        slug: subjectSlug,
        lessonNumber,
        lessonTitleOverride: title || defaultLessonTitle,
      },
      {
        onSuccess: (generated) => {
          if (generated) {
            setTitle(generated.lessonTitle);
            setSummary(generated.summary || "");
            setContent(generated.content);
          }
        },
      }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (content.trim().length < 10) return;

    saveMutation.mutate(
      {
        subjectSlug,
        lessonNumber,
        lessonTitle: title.trim(),
        summary: summary.trim() || undefined,
        content: content.trim(),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const isGenerating = generateMutation.isPending;
  const isSaving = saveMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl rounded-3xl p-5 sm:p-7 bg-card border-border/70 shadow-2xl max-h-[92vh] flex flex-col">
        <DialogHeader className="space-y-1.5 text-left shrink-0 pb-3 border-b border-border/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                L{lessonNumber}
              </span>
              <Badge variant="outline" className="text-[10px] font-semibold">
                {subjectName}
              </Badge>
              {material?.id ? (
                <Badge className="bg-success/15 text-success border-success/30 text-[10px] font-semibold">
                  Saved in Database
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                  Draft / Unsaved
                </Badge>
              )}
            </div>

            {/* AI Auto-generate button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isGenerating || isLoading}
              onClick={handleGenerateAi}
              className="h-8 px-3 text-xs font-bold text-primary border-primary/30 hover:bg-primary/10 rounded-xl gap-1.5"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                  <span>Generating with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>Auto-Generate with AI</span>
                </>
              )}
            </Button>
          </div>

          <DialogTitle className="text-xl font-bold font-heading text-foreground">
            Curate Lesson {lessonNumber} Study Material
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Author or refine high-yield MATATAG study notes displayed to students before they take the quiz drill.
          </DialogDescription>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {/* Title & Summary Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-foreground">
                Lesson Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Algebraic Expressions and Polynomials"
                className="h-9 text-xs rounded-xl bg-background"
                disabled={isGenerating}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground">
                Target Competency / Summary
              </label>
              <Input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Key competencies covered..."
                className="h-9 text-xs rounded-xl bg-background"
                disabled={isGenerating}
              />
            </div>
          </div>

          {/* Tab Switcher: Edit vs Preview */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "edit"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit3 className="size-3.5" />
                <span>Edit Markdown</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "preview"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="size-3.5" />
                <span>Live Student Preview</span>
              </button>
            </div>

            <span className="text-[11px] text-muted-foreground hidden sm:inline-flex items-center gap-1">
              <HelpCircle className="size-3" />
              <span>Supports Markdown headings, bullet points, and KaTeX math</span>
            </span>
          </div>

          {/* Editor / Preview Area */}
          {activeTab === "edit" ? (
            <div className="space-y-1.5">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                disabled={isGenerating || isLoading}
                placeholder={`# ${title || "Lesson Title"}\n\n## 1. Learning Objectives\n- Objective 1\n\n## 2. Core Concepts\nDetailed explanation with key principles and formulas...`}
                className="w-full rounded-2xl border border-border/70 bg-muted/20 p-4 font-mono text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none scrollbar-thin"
              />
              <div className="flex justify-between items-center text-[11px] text-muted-foreground px-1">
                <span>{content.length} characters</span>
                <span>Minimum 10 characters required</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-card p-5 min-h-[380px] max-h-[460px] overflow-y-auto scrollbar-thin">
              {content ? (
                <MarkdownRenderer content={content} />
              ) : (
                <div className="text-center py-16 text-muted-foreground text-xs">
                  No lesson content authored yet. Switch back to &quot;Edit Markdown&quot; or click &quot;Auto-Generate with AI&quot;.
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0 pt-3 border-t border-border/60 flex flex-row items-center justify-between sm:justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs rounded-xl"
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || isGenerating || !title.trim() || content.length < 10}
            className="text-xs rounded-xl font-bold gap-1.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Save Lesson Material</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
