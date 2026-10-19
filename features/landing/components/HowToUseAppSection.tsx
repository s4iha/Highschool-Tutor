"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  BookOpen,
  Bot,
  Award,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function HowToUseAppSection() {
  const steps = [
    {
      step: "01",
      title: "Set Your Grade & Track",
      subtitle: "Personalized DepEd Curriculum",
      description:
        "Select Junior High (Grades 7–10 across 4 Quarters) or Senior High (Grades 11–12 across 2 Semesters in STEM, ABM, HUMSS, GAS, or TVL). Your curriculum automatically adapts to official DepEd competencies.",
      icon: Compass,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      accent: "bg-blue-600 text-white",
      highlights: [
        "JHS follows 4 official Quarters (Q1–Q4)",
        "SHS maps subjects strictly to Semesters 1 & 2",
        "Instant catalog matching your track & strand",
      ],
    },
    {
      step: "02",
      title: "Study Structured Modules",
      subtitle: "DepEd DO 015 Aligned Lessons",
      description:
        "Each subject features 8 focused lesson modules containing clear concept breakdowns, formulas, historical context, and official DepEd competencies without cognitive overload.",
      icon: BookOpen,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      accent: "bg-emerald-600 text-white",
      highlights: [
        "8 comprehensive lessons per subject",
        "Concise concept summaries & key formulas",
        "Curated for quarterly mastery & review",
      ],
    },
    {
      step: "03",
      title: "Socratic AI Practice Drills",
      subtitle: "'Bakit Mali Ito?' Multi-Dialect Hints",
      description:
        "Test your knowledge with 24 practice drills per subject. When you make a mistake, our Socratic AI gives guided hints in English, Filipino, Taglish, Cebuano, or Ilocano to help you discover the correct answer.",
      icon: Bot,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      accent: "bg-purple-600 text-white",
      highlights: [
        "Guided reasoning without spoiling solutions",
        "Taglish, Cebuano, & Ilocano regional support",
        "Real-time instant feedback on each option",
      ],
    },
    {
      step: "04",
      title: "Track DO 015 Transmuted Grades",
      subtitle: "DepEd Order No. 015, s. 2026 Mastery Scale",
      description:
        "Watch your raw scores automatically convert to official DepEd DO 015 s. 2026 transmuted grades (60 to 100 scale). Pinpoint specific learning competencies to review before your quarterly exams.",
      icon: Award,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      accent: "bg-amber-600 text-white",
      highlights: [
        "Official DO 015 s. 2026 transmutation scale",
        "Instant mastery evaluation (Passing grade ≥ 75%)",
        "Comprehensive gradebook review across all subjects",
      ],
    },
  ];

  return (
    <section id="how-to-use" className="relative py-16 sm:py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
            <Sparkles className="size-3.5" />
            <span>Student Onboarding Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight font-heading">
            How to Master HighSchool Tutor in 4 Easy Steps
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Designed specifically for Filipino high school students navigating the DepEd K-12 MATATAG
            curriculum. Here is how you can ace your quarterly exams with confidence.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300"
              >
                {/* Step badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center border ${item.color} transition-transform group-hover:scale-110 duration-300`}
                  >
                    <Icon className="size-6" />
                  </div>
                  <span className="font-heading font-black text-2xl text-muted-foreground/30 group-hover:text-primary/40 transition-colors">
                    {item.step}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="mb-3">
                  <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed mb-6 flex-1">
                  {item.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2 pt-4 border-t border-border/50 text-[11px] sm:text-xs">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-muted-foreground">
                      <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Practical Student Tips Box */}
        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md">
              <Smartphone className="size-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-foreground text-sm sm:text-base">
                Study Anywhere on Any Device
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                HighSchool Tutor is built for smooth performance across mobile phones, tablets, and laptops. 
                Access structured lessons, interactive practice tests, and Socratic AI guidance anytime in your browser.
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="rounded-xl px-5 text-xs font-semibold shrink-0 gap-1.5">
            <Link href="/login">
              <span>Get Started Now</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
