"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  ChevronRight,
  BookMarked,
  BrainCircuit,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  TRACKS_DATA,
  type TrackData,
} from "@/features/landing/constants/tracks-data";

export { TRACKS_DATA, type TrackData };

export function TrackDetail({ trackId }: { trackId: string }) {
  const track = TRACKS_DATA[trackId];

  if (!track) {
    return notFound();
  }

  const IconComponent = track.icon;

  return (
    <div className="min-h-screen pb-20 pt-8 sm:pt-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/#categories"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Academic Strands</span>
          </Link>

          <Badge variant="outline" className={`${track.pill} border-0 text-xs font-bold px-3 py-1`}>
            {track.badge}
          </Badge>
        </div>

        {/* Hero Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <div
                  className={`size-14 rounded-2xl ${track.color} border flex items-center justify-center shadow-xs shrink-0`}
                >
                  <IconComponent className="size-7" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-foreground font-heading tracking-tight">
                    {track.name}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-muted-foreground">
                    DepEd MATATAG Curriculum • {track.grades}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {track.overview}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <Link href="/subjects" className="w-full">
                <Button className="w-full rounded-2xl h-12 font-bold text-sm shadow-md gap-2">
                  <ArrowRight className="size-4" />
                  <span>Browse Subject Scopes</span>
                </Button>
              </Link>
              <Link href="/#categories" className="w-full">
                <Button variant="outline" className="w-full rounded-2xl h-12 font-semibold text-sm">
                  View Other Tracks
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Featured Subjects & Key Competencies */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Featured Subjects */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                  Curriculum Subjects & Modules
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Official DepEd MATATAG competencies, lesson modules, and practice drills.
                </p>
              </div>
              <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10">
                {track.subjectsCount}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {track.featuredSubjects.map((subject) => (
                <div
                  key={subject.code}
                  className="bg-card rounded-2xl p-5 border border-border shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {subject.code}
                      </span>
                      <span className="text-[11px] font-semibold text-primary">
                        {subject.modules} Lessons
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {subject.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {subject.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                      <BookMarked className="size-3 text-primary" />
                      DepEd Aligned
                    </span>
                    <Link
                      href={subject.slug ? `/subjects/${subject.slug}` : "/subjects"}
                      className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View Subject Scope <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Socratic Tutoring Capabilities */}
            <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-card to-card border border-primary/20 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <BrainCircuit className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-foreground">
                    Socratic AI Tutor for {track.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Powered by Google Gemini 3.5 with multi-dialect support (Taglish, English, Cebuano, Ilocano)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {track.aiTutorCapabilities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-background/60 border border-border/40 text-xs text-muted-foreground leading-relaxed"
                  >
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Learning Goals & Career Pathways */}
          <div className="space-y-6">
            {/* Learning Goals */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-success" />
                <h3 className="text-base font-bold font-heading text-foreground">
                  Core Learning Goals
                </h3>
              </div>
              <ul className="space-y-3">
                {track.learningGoals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                    <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* University & Career Readiness */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-5 text-primary" />
                <h3 className="text-base font-bold font-heading text-foreground">
                  College & Career Readiness
                </h3>
              </div>
              <ul className="space-y-3">
                {track.careerPathways.map((pathway, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                    <ChevronRight className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{pathway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Box */}
            <div className="bg-primary/10 rounded-3xl p-6 border border-primary/20 text-center space-y-3">
              <h4 className="text-sm font-bold text-foreground">
                Ready to excel in {track.name}?
              </h4>
              <p className="text-xs text-muted-foreground">
                Access interactive lesson modules, AI hints, and DepEd DO 015 s. 2026 grade simulations.
              </p>
              <Link href="/subjects" className="block pt-1">
                <Button className="w-full rounded-xl text-xs font-bold h-10 shadow-sm">
                  Explore Full Curriculum
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
