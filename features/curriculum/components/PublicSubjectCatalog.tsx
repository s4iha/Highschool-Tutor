"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Filter,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import type { SubjectScopeDefinition } from "../types/subjectScope.types";
import { cn } from "@/lib/utils";

export interface PublicSubjectCatalogProps {
  initialSubjects: SubjectScopeDefinition[];
  initialLevel?: "ALL" | "JHS" | "SHS";
  initialStrand?: string;
}

const STRAND_OPTIONS = [
  { value: "ALL", label: "All Strands & Tracks" },
  { value: "Core", label: "Core Curriculum" },
  { value: "Applied", label: "Applied Track" },
  { value: "STEM", label: "STEM Strand" },
  { value: "ABM", label: "ABM Strand" },
  { value: "HUMSS", label: "HUMSS Strand" },
  { value: "GAS", label: "General Academic (GAS)" },
  { value: "Arts & Design", label: "Arts & Design Track" },
  { value: "Sports", label: "Sports Track" },
  { value: "TVL", label: "TVL Specializations" },
];

const SHS_ONLY_STRANDS = [
  "Applied",
  "STEM",
  "ABM",
  "HUMSS",
  "GAS",
  "Arts & Design",
  "Sports",
  "TVL",
];

export function PublicSubjectCatalog({
  initialSubjects,
  initialLevel = "ALL",
  initialStrand = "ALL",
}: PublicSubjectCatalogProps) {
  // Normalize initial strand to match STRAND_OPTIONS if matched case-insensitively
  const resolvedInitialStrand = useMemo(() => {
    if (!initialStrand || initialStrand === "ALL") return "ALL";
    const found = STRAND_OPTIONS.find(
      (opt) => opt.value.toLowerCase() === initialStrand.toLowerCase()
    );
    return found ? found.value : initialStrand;
  }, [initialStrand]);

  // If initial level is JHS and strand is SHS-only, reset strand to ALL
  const startingStrand =
    initialLevel === "JHS" &&
    SHS_ONLY_STRANDS.some((s) => s.toLowerCase() === resolvedInitialStrand.toLowerCase())
      ? "ALL"
      : resolvedInitialStrand;

  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"ALL" | "JHS" | "SHS">(initialLevel);
  const [strandFilter, setStrandFilter] = useState(startingStrand);

  const handleLevelChange = (newLevel: "ALL" | "JHS" | "SHS") => {
    setLevelFilter(newLevel);
    if (
      newLevel === "JHS" &&
      SHS_ONLY_STRANDS.some((s) => s.toLowerCase() === strandFilter.toLowerCase())
    ) {
      setStrandFilter("ALL");
    }
  };

  const handleStrandChange = (newStrand: string) => {
    setStrandFilter(newStrand);
    if (
      SHS_ONLY_STRANDS.some((s) => s.toLowerCase() === newStrand.toLowerCase()) &&
      levelFilter === "JHS"
    ) {
      setLevelFilter("SHS");
    }
  };

  const filteredSubjects = useMemo(() => {
    return initialSubjects.filter((subject) => {
      // Level filter
      if (levelFilter === "JHS" && subject.level !== "Junior High School") return false;
      if (levelFilter === "SHS" && subject.level !== "Senior High School") return false;

      // Strand / Track filter
      if (strandFilter !== "ALL") {
        const sf = strandFilter.toLowerCase();
        const matchesStrand =
          subject.strand.toLowerCase() === sf || subject.strand.toLowerCase().includes(sf);
        const matchesTrack =
          subject.track.toLowerCase() === sf || subject.track.toLowerCase().includes(sf);
        if (!matchesStrand && !matchesTrack) return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesName = subject.name.toLowerCase().includes(q);
        const matchesCode = subject.code.toLowerCase().includes(q);
        const matchesDesc = subject.description.toLowerCase().includes(q);
        const matchesCompetency = subject.competencies.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesCode && !matchesDesc && !matchesCompetency) return false;
      }

      return true;
    });
  }, [initialSubjects, levelFilter, strandFilter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject name, code, or competencies (e.g. General Math, Pre-Calculus, Cookery)..."
              className="pl-10 h-11 rounded-2xl bg-muted/40 border-border/60 text-sm focus-visible:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Academic Level Pill Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 p-1 rounded-2xl bg-muted/40 border border-border/60 w-full md:w-auto">
            <button
              type="button"
              onClick={() => handleLevelChange("ALL")}
              className={cn(
                "flex-1 sm:flex-initial text-center justify-center px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                levelFilter === "ALL"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Levels
            </button>
            <button
              type="button"
              onClick={() => handleLevelChange("JHS")}
              className={cn(
                "flex-1 sm:flex-initial text-center justify-center px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                levelFilter === "JHS"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Junior High (7–10)
            </button>
            <button
              type="button"
              onClick={() => handleLevelChange("SHS")}
              className={cn(
                "flex-1 sm:flex-initial text-center justify-center px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                levelFilter === "SHS"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Senior High (11–12)
            </button>
          </div>
        </div>

        {/* Strand Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-muted-foreground font-semibold flex items-center gap-1.5 shrink-0 pr-1">
            <Filter className="size-3.5" />
            <span>Track:</span>
          </span>
          {STRAND_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleStrandChange(opt.value)}
              className={cn(
                "px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border shrink-0",
                strandFilter.toLowerCase() === opt.value.toLowerCase()
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-foreground">{filteredSubjects.length}</strong> DepEd MATATAG curriculum subjects
        </span>
        {(searchQuery || levelFilter !== "ALL" || strandFilter !== "ALL") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setLevelFilter("ALL");
              setStrandFilter("ALL");
            }}
            className="text-primary hover:underline font-medium"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/80 p-12 text-center space-y-3 bg-card/40">
          <BookOpen className="size-10 text-muted-foreground mx-auto stroke-1" />
          <h3 className="text-base font-bold text-foreground">No matching DepEd subjects found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search keywords or switching filters to browse our complete K-12 MATATAG catalog.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setLevelFilter("ALL");
              setStrandFilter("ALL");
            }}
            className="rounded-xl mt-2"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((subject) => {
            const hasPrereq = subject.prerequisites.length > 0 && !subject.prerequisites.includes("None");

            return (
              <div
                key={subject.slug}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/70 bg-card p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300"
              >
                <div>
                  {/* Badges row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="outline" className="text-[10px] font-semibold tracking-wider uppercase bg-primary/5 text-primary border-primary/20">
                      {subject.strand}
                    </Badge>
                    <span className="text-[11px] font-medium text-muted-foreground font-mono">
                      {subject.grade} • {subject.term}
                    </span>
                  </div>

                  {/* Title & Code */}
                  <h3 className="text-base font-bold text-foreground font-heading tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                    {subject.name}
                  </h3>
                  <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                    {subject.code}
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>

                  {/* Key metadata pills */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-muted/60 border border-border/40">
                      <Clock className="size-3 text-primary" />
                      <span>{subject.timeAllotment}</span>
                    </span>
                    {hasPrereq ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        <span>Prereq: {subject.prerequisites[0]}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-muted/60 border border-border/40">
                        <span>No Prerequisite</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer CTAs */}
                <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between gap-3">
                  <Link
                    href={`/subjects/${subject.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>View Curriculum Scope</span>
                    <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs font-semibold border-border/80 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                  >
                    <Link href={`/curriculum/${subject.slug}`}>
                      <span>Practice</span>
                      <ArrowRight className="size-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
