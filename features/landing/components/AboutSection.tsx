"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function AboutSection() {
  const benefits = [
    "12 well-structured lessons per subject aligned with DepEd K-12 MATATAG competencies",
    "24 practice quizzes with instant grading, feedback, and verified answer keys",
    "Interactive Socratic AI Tutor providing step-by-step guidance in English and Taglish",
    "DepEd DO 015 s. 2026 transmutation engine with automated gradebook and parent reporting",
  ];

  return (
    <section id="about" className="relative py-16 lg:py-24 bg-muted/30 dark:bg-card/30 overflow-hidden transition-colors duration-200">
      {/* Subtle Background Graduation Cap Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.035] dark:opacity-[0.02] pointer-events-none -z-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-primary">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image Collage & Stamp */}
          <div className="lg:col-span-6 relative">
            {/* Background Decorative Dot Grid */}
            <div className="absolute -top-6 -right-6 hidden sm:grid grid-cols-6 gap-2 opacity-25 dark:opacity-10 -z-10">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
              ))}
            </div>

            <div className="relative">
              {/* Primary Image: Group Study in Library */}
              <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-card bg-muted">
                <Image
                  src="/images/library-group.jpg"
                  alt="High school students studying together"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Overlapping Secondary Image: Student Writing */}
              <div className="absolute -bottom-10 -right-4 sm:-right-8 w-44 sm:w-56 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-card bg-card z-20">
                <Image
                  src="/images/student-writing.jpg"
                  alt="High school student taking notes"
                  fill
                  sizes="(max-width: 640px) 176px, 224px"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Circular Badge: "QUALITY EDUCATION • BETTER FUTURE •" */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-card shadow-xl border-4 border-primary/20 flex items-center justify-center z-30 group hover:scale-105 transition-transform duration-300">
                {/* Circular Rotating Text SVG */}
                <svg className="w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[8px] font-black uppercase tracking-[0.2em] fill-primary">
                    <textPath href="#circlePath" startOffset="0%">
                      QUALITY EDUCATION • DEPED MATATAG •
                    </textPath>
                  </text>
                </svg>
                {/* Center Badge Icon */}
                <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Checklist */}
          <div className="lg:col-span-6 space-y-6 pt-8 lg:pt-0">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase border border-primary/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>PHILIPPINE K-12 EXCELLENCE</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.18]">
              Empowering Filipino Students <br />
              <span className="text-primary">to Master Every DepEd Subject</span>
            </h2>

            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed font-normal">
              HighSchool Tutor structures Junior & Senior High School subjects into standardized 12-lesson modules and 24 assessments, backed by 24/7 AI Socratic explanation support in Taglish so students master complex concepts with confidence.
            </p>

            {/* Checklist items */}
            <div className="space-y-3 pt-2">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-card border border-border shadow-xs hover:shadow-sm transition-all group"
                >
                  <div className="mt-0.5 rounded-lg bg-primary/10 p-1 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-card-foreground">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button asChild size="lg" className="rounded-xl px-7 py-6 text-sm font-bold gap-2 shadow-lg shadow-primary/20">
                <Link href="/#subjects">
                  <span>Explore All DepEd Subjects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
