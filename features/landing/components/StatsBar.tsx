"use client";

import React from "react";
import { BookOpen, Award, FileText, CheckCircle2 } from "lucide-react";
import { useLandingStatsQuery } from "../hooks/use-landing-stats";
import { CATALOG_BASELINE_STATS } from "../constants/catalog-stats";
import type { LandingStatsData } from "../types/landing.types";

interface StatsBarProps {
  initialData?: LandingStatsData;
}

export function StatsBar({ initialData }: StatsBarProps) {
  const { data: statsData } = useLandingStatsQuery(initialData);
  const data: LandingStatsData = statsData ?? CATALOG_BASELINE_STATS;

  const cards = [
    {
      icon: BookOpen,
      value: data.liveStudents && data.liveStudents > 100
        ? `${data.liveStudents.toLocaleString()}+`
        : data.totalSubjects,
      label: data.liveStudents && data.liveStudents > 100 ? "Active Learners" : "DepEd Subjects",
      sub: data.liveStudents && data.liveStudents > 100 ? "Enrolled students" : data.subjectSubtext,
      color: "text-primary bg-primary/10",
    },
    {
      icon: Award,
      value: data.liveQuizzesTaken && data.liveQuizzesTaken > 500
        ? `${data.liveQuizzesTaken.toLocaleString()}+`
        : data.practiceDrills,
      label: data.liveQuizzesTaken && data.liveQuizzesTaken > 500 ? "Quizzes Taken" : "Practice Drills",
      sub: data.liveQuizzesTaken && data.liveQuizzesTaken > 500 ? "Assessments completed" : data.drillsSubtext,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/80",
    },
    {
      icon: FileText,
      value: data.lessonModules,
      label: "Lesson Modules",
      sub: data.modulesSubtext,
      color: "text-amber-600 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/80",
    },
    {
      icon: CheckCircle2,
      value: data.curriculumStandard,
      label: "Free All-Access Pass",
      sub: data.standardSubtext,
      color: "text-teal-600 dark:text-teal-400 bg-teal-100/80 dark:bg-teal-950/80",
    },
  ];

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-card/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-border/50 border border-border transition-all duration-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left ${
                  index > 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center shrink-0 shadow-xs`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-card-foreground tracking-tight">
                    {card.value}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-card-foreground/90">
                    {card.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {card.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
