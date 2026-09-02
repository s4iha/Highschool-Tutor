"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Bot,
  Calendar,
  Layers,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export function HeroSection() {
  return (
    <section id="hero" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-gradient-to-b from-primary/10 via-background to-muted/30 dark:from-primary/5 dark:via-background dark:to-background transition-colors duration-200">
      {/* Decorative background grid & radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-info/20 dark:bg-info/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle background dots pattern top-right */}
      <div className="absolute top-6 right-8 hidden lg:grid grid-cols-6 gap-2.5 opacity-30 dark:opacity-10 pointer-events-none -z-10">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Badge, Copy, CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 dark:bg-primary/20 text-primary dark:text-primary-foreground border border-primary/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: "4s" }} />
              <span className="text-xs font-bold tracking-wide uppercase">
                DepEd K-12 MATATAG Aligned Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.12]">
              Master High School <br />
              <span className="text-primary bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Lessons & Quizzes
              </span>{" "}
              with AI
            </h1>

            {/* Subtitle / Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Complete DepEd-aligned curriculum for Grades 7 to 12. Practice with 12 structured lessons, 24 verified quizzes per subject, and get step-by-step Socratic AI explanations in English and Taglish.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20 rounded-xl px-7 py-6 text-sm font-bold gap-2">
                <Link href="/#subjects">
                  <span>Explore Subjects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-xl px-7 py-6 text-sm font-semibold border-border hover:bg-muted">
                <Link href="/login">
                  <span>Student Sign In</span>
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="font-semibold text-foreground">DepEd DO 015 s. 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-semibold text-foreground">Google Gemini 2.5 AI</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <span className="font-semibold text-foreground">Junior & Senior High</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Interactive Floating Cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Soft Radial Backlight */}
            <div className="absolute inset-0 max-w-[480px] max-h-[480px] m-auto bg-gradient-to-tr from-primary/30 via-teal-500/20 to-transparent rounded-full filter blur-2xl -z-10" />

            {/* Central Student Portrait Container */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-visible mx-auto">
              <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border-4 border-card bg-gradient-to-b from-primary/10 to-muted relative">
                <Image
                  src="/images/hero-student.jpg"
                  alt="High School Student Studying with HighSchool Tutor"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                  className="object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Card 1: Top-Left "Continue Learning" */}
              <div className="absolute -top-4 -left-4 sm:-left-10 bg-card/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-border w-52 sm:w-56 z-20 animate-float-slow">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Continue Learning
                </span>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-1.5 bg-primary/15 text-primary rounded-lg">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-card-foreground truncate">
                    General Mathematics
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full w-[75%]" />
                </div>
                <span className="text-[10px] font-bold text-primary mt-1 block text-right">
                  75% Complete
                </span>
              </div>

              {/* Floating Card 2: Top-Right "AI Tutor" */}
              <div className="absolute top-6 -right-3 sm:-right-8 bg-card/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-border w-44 sm:w-52 z-20 animate-float-delayed flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-card-foreground leading-tight">
                    AI Socratic Tutor
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                    Ask questions & get instant help in Taglish
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-xs shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              </div>

              {/* Floating Card 3: Middle-Left "Upcoming Quiz" */}
              <div className="absolute bottom-20 -left-4 sm:-left-12 bg-card/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-border w-48 sm:w-56 z-20 animate-float-delayed">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Upcoming Assessment
                </span>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-1.5 bg-info/15 text-info-foreground rounded-lg">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-card-foreground truncate">
                    Earth & Life Science
                  </span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-bold">
                  Quarterly Exam in 3 days
                </Badge>
              </div>

              {/* Floating Card 4: Bottom-Right "My Progress" */}
              <div className="absolute -bottom-6 -right-4 sm:-right-10 bg-card/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-xl border border-border w-48 sm:w-54 z-20 animate-float-slow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-card-foreground">
                    Quarter Mastery
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex items-center gap-3">
                  {/* Circular progress meter */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-muted"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-primary"
                        strokeDasharray="88, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-black text-card-foreground">
                      88%
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-card-foreground block leading-tight">
                      DepEd MATATAG
                    </span>
                    {/* Tiny decorative sparkline */}
                    <div className="flex items-center gap-0.5 mt-1">
                      <span className="w-1 h-2 bg-primary/40 rounded-full" />
                      <span className="w-1 h-3 bg-primary/60 rounded-full" />
                      <span className="w-1 h-2.5 bg-primary/70 rounded-full" />
                      <span className="w-1 h-4 bg-primary/90 rounded-full" />
                      <span className="w-1 h-5 bg-primary rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
