"use client";

import * as React from "react";
import { Search, ChevronDown, Check, BookOpen, X, Sparkles } from "lucide-react";
import { SUBJECTS } from "@/features/curriculum/utils/curriculum-data";
import type { Subject } from "@/features/curriculum/types/curriculum.types";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";

interface SubjectComboboxProps {
  selectedSubjectSlug: string;
  onSelectSubject: (slug: string) => void;
}

const GRADE_FILTERS = [
  "All",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
] as const;

export function SubjectCombobox({
  selectedSubjectSlug,
  onSelectSubject,
}: SubjectComboboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [activeGrade, setActiveGrade] = React.useState<string>("All");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedSubject = React.useMemo(() => {
    return SUBJECTS.find((s) => s.slug === selectedSubjectSlug) || SUBJECTS[0];
  }, [selectedSubjectSlug]);

  // Handle outside click to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filter subjects based on search query and active grade filter
  const filteredSubjects = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return SUBJECTS.filter((s) => {
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.grade.toLowerCase().includes(q) ||
        s.term.toLowerCase().includes(q);

      const matchesGrade =
        activeGrade === "All" || s.grade.toLowerCase() === activeGrade.toLowerCase();

      return matchesSearch && matchesGrade;
    });
  }, [search, activeGrade]);

  // Group filtered subjects by Grade Level
  const groupedSubjects = React.useMemo(() => {
    const groups: { [grade: string]: Subject[] } = {};
    for (const s of filteredSubjects) {
      if (!groups[s.grade]) {
        groups[s.grade] = [];
      }
      groups[s.grade].push(s);
    }
    return groups;
  }, [filteredSubjects]);

  const gradesInOrder = [
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ].filter((g) => groupedSubjects[g]?.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Combobox Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          "w-full flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all text-left bg-card cursor-pointer",
          isOpen
            ? "border-primary ring-2 ring-primary/20 shadow-md"
            : "border-border/60 hover:border-border hover:bg-muted/30"
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <BookOpen className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-primary">
                [{selectedSubject.code}]
              </span>
              <span className="text-xs font-bold text-foreground truncate">
                {selectedSubject.name}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {selectedSubject.grade} • {selectedSubject.level} • {selectedSubject.term}
            </p>
          </div>
        </div>

        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground shrink-0 transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-2xl border border-border bg-popover shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-border/40 space-y-2.5 bg-card/80 backdrop-blur-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by subject code, name, or grade..."
                autoFocus
                className="pl-8 pr-8 h-8 text-xs rounded-xl bg-background border-border/60"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Quick Grade Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {GRADE_FILTERS.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setActiveGrade(grade)}
                  className={cn(
                    "px-2.5 py-0.5 rounded-lg text-[10px] font-semibold transition-all shrink-0 cursor-pointer",
                    activeGrade === grade
                      ? "bg-primary text-primary-foreground shadow-xs font-bold"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                  )}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Grouped Subject List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-3">
            {filteredSubjects.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  No DepEd subjects match &quot;{search}&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveGrade("All");
                  }}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              gradesInOrder.map((grade) => {
                const subjectsInGrade = groupedSubjects[grade];
                const isSHS = grade === "Grade 11" || grade === "Grade 12";

                return (
                  <div key={grade} className="space-y-1">
                    {/* Grade Group Header */}
                    <div className="flex items-center justify-between px-2 py-1 sticky top-0 bg-popover/90 backdrop-blur-xs z-10 border-b border-border/30">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Sparkles className="size-3 text-primary" />
                        <span>
                          {grade} • {isSHS ? "Senior High School" : "Junior High School"}
                        </span>
                      </span>
                      <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0">
                        {subjectsInGrade.length}
                      </Badge>
                    </div>

                    {/* Subject Cards */}
                    <div className="space-y-0.5 pt-0.5">
                      {subjectsInGrade.map((s) => {
                        const isSelected = s.slug === selectedSubjectSlug;
                        return (
                          <button
                            key={s.slug}
                            type="button"
                            onClick={() => {
                              onSelectSubject(s.slug);
                              setIsOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer",
                              isSelected
                                ? "bg-primary/10 text-primary font-bold border border-primary/30"
                                : "hover:bg-muted/50 text-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={cn(
                                  "font-mono text-[10px] px-1.5 py-0.5 rounded-md shrink-0 font-bold",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground border border-border/50"
                                )}
                              >
                                {s.code}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs truncate">{s.name}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {s.term}
                                </p>
                              </div>
                            </div>

                            {isSelected && (
                              <Check className="size-3.5 text-primary shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
