"use client";

import React from "react";
import Link from "next/link";
import {
  Code,
  Briefcase,
  FlaskConical,
  BookOpenCheck,
  Compass,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";

export function CategorySection() {
  const categories = [
    {
      id: 1,
      name: "Junior High Core",
      count: "32+ Subjects",
      desc: "Grades 7-10: English, Math, Science, AP, Filipino, MAPEH, TLE & EsP",
      icon: BookOpenCheck,
      color: "bg-blue-100/90 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-800",
      accent: "hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-blue-500/10",
      pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    },
    {
      id: 2,
      name: "STEM Strand",
      count: "24+ Subjects",
      desc: "Pre-Calculus, Basic Calculus, General Biology, Chemistry & Physics",
      icon: FlaskConical,
      color: "bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800",
      accent: "hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-emerald-500/10",
      pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    },
    {
      id: 3,
      name: "ABM Strand",
      count: "18+ Subjects",
      desc: "Business Mathematics, Organization & Management, Principles of Marketing & Economics",
      icon: Briefcase,
      color: "bg-amber-100/90 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-800",
      accent: "hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-amber-500/10",
      pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    },
    {
      id: 4,
      name: "HUMSS Strand",
      count: "20+ Subjects",
      desc: "Philippine Politics & Governance, Creative Writing, World Religions & Trends",
      icon: Compass,
      color: "bg-purple-100/90 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-800",
      accent: "hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-purple-500/10",
      pill: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    },
    {
      id: 5,
      name: "SHS Core Subjects",
      count: "36+ Subjects",
      desc: "Oral Communication, Komunikasyon, 21st Century Lit, General Math & Earth Sci",
      icon: Code,
      color: "bg-teal-100/90 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 border-teal-200/80 dark:border-teal-800",
      accent: "hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-teal-500/10",
      pill: "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300",
    },
  ];

  return (
    <section id="categories" className="py-16 lg:py-24 bg-card/40 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow Header */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-primary/40" />
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>K-12 ACADEMIC DISCIPLINES</span>
          </div>
          <div className="h-px w-8 bg-primary/40" />
        </div>

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Explore Subjects by Academic Track &amp; Strand
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base font-normal">
            Every subject includes 12 sequential lesson modules and 24 practice quizzes with &lsquo;Ask AI&rsquo; Socratic explanation support.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className={`bg-card rounded-3xl p-6 border border-border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 ${category.accent}`}
              >
                <div>
                  {/* Top: Icon & Count Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl ${category.color} border flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${category.pill}`}
                    >
                      {category.count}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed font-normal">
                    {category.desc}
                  </p>
                </div>

                {/* Bottom Action Link */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-card-foreground group-hover:text-primary transition-colors">
                    View Curriculum
                  </span>
                  <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
