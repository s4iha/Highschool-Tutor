"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { parseJhsSlug, buildJhsSlug, JHS_GRADES, JHS_TERMS } from "../utils/curriculum-data";
import type { Subject } from "../types/curriculum.types";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { Layers, Calendar } from "lucide-react";

interface GradeTermPickerProps {
  subject: Subject;
}

export function GradeTermPicker({ subject }: GradeTermPickerProps) {
  const router = useRouter();
  const parsed = React.useMemo(() => parseJhsSlug(subject.slug), [subject.slug]);

  if (!parsed.isJhs) {
    return null;
  }

  const currentGrade = subject.grade;
  const currentTerm = subject.term;

  const handleSelection = (targetGrade: string, targetTerm: string) => {
    if (targetGrade === currentGrade && targetTerm === currentTerm) return;
    const newSlug = buildJhsSlug(parsed.abbr, targetGrade, targetTerm);
    router.push(`/curriculum/${newSlug}`);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Grade Level &amp; Trimester Selector
            </h3>
            <p className="text-xs text-muted-foreground">
              Switch competencies for {subject.name} across Junior High School
            </p>
          </div>
        </div>
        <Badge variant="outline" className="w-fit text-xs font-medium border-primary/30 text-primary">
          Active: {currentGrade} • {currentTerm}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grade Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <span>Grade Level</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {JHS_GRADES.map((g) => {
              const isSelected = g === currentGrade;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleSelection(g, currentTerm)}
                  className={cn(
                    "py-1.5 px-2 rounded-xl text-xs font-medium text-center transition-all cursor-pointer border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                      : "bg-background/80 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {g.replace("Grade ", "G")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trimester Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            <span>Grading Period</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {JHS_TERMS.map((t) => {
              const isSelected = t === currentTerm;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleSelection(currentGrade, t)}
                  className={cn(
                    "py-1.5 px-2 rounded-xl text-xs font-medium text-center transition-all cursor-pointer border",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                      : "bg-background/80 text-muted-foreground border-border/60 hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {t.replace("Trimester ", "Tri ")}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
