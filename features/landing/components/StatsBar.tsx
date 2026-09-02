"use client";

import React from "react";
import { BookOpen, Award, Users, CheckCircle } from "lucide-react";

export function StatsBar() {
  const stats = [
    {
      icon: BookOpen,
      value: "130+",
      label: "DepEd Subjects",
      sub: "Junior & Senior High School",
      color: "text-primary bg-primary/10",
    },
    {
      icon: Award,
      value: "12 / 24",
      label: "Lessons & Quizzes",
      sub: "Standardized per subject",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/80",
    },
    {
      icon: Users,
      value: "15,000+",
      label: "Enrolled Students",
      sub: "Active high school learners",
      color: "text-amber-600 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/80",
    },
    {
      icon: CheckCircle,
      value: "98.2%",
      label: "Pass Rate",
      sub: "In quarterly & periodical exams",
      color: "text-teal-600 dark:text-teal-400 bg-teal-100/80 dark:bg-teal-950/80",
    },
  ];

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-card/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-border/50 border border-border transition-all duration-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left ${
                  index > 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center shrink-0 shadow-xs`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-card-foreground tracking-tight">
                    {stat.value}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-card-foreground/90">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {stat.sub}
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
