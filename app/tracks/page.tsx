import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { TRACKS_DATA } from "@/features/landing/components";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  BookOpenCheck,
  GraduationCap,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "DepEd K-12 Academic Tracks & Strands • HighSchool Tutor",
  description:
    "Explore DepEd MATATAG-aligned Junior High School and Senior High School academic tracks, strands, and specialized subjects.",
};

export default function TracksIndexPage() {
  const tracks = Object.values(TRACKS_DATA);

  return (
    <div className="min-h-screen pb-24 pt-8 sm:pt-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="font-semibold text-foreground">Academic Tracks &amp; Strands</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DepEd DO 015 s. 2026 MATATAG Curriculum</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Academic Tracks &amp; Strands
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Discover tailored study modules, DepEd-aligned competencies, and Socratic AI tutoring
            designed for every step of your Junior and Senior High School journey.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.id}
                className="rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-200 group hover:border-primary/40"
              >
                <div className="space-y-4">
                  {/* Top: Icon and Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${track.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="font-bold text-[11px] px-2.5 py-0.5">
                      {track.badge}
                    </Badge>
                  </div>

                  {/* Track Title and Headline */}
                  <div>
                    <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {track.name}
                    </h2>
                    <p className="text-xs font-semibold text-muted-foreground mt-1">
                      {track.grades} • {track.subjectsCount}
                    </p>
                  </div>

                  {/* Overview snippet */}
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {track.overview}
                  </p>

                  {/* Featured subjects preview */}
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-[11px] font-bold text-foreground uppercase tracking-wider mb-2">
                      Core Subjects Included:
                    </p>
                    <ul className="space-y-1">
                      {track.featuredSubjects.slice(0, 3).map((sub) => (
                        <li
                          key={sub.code}
                          className="text-xs text-muted-foreground flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          <span className="font-medium text-foreground/90 truncate">{sub.title}</span>
                        </li>
                      ))}
                      {track.featuredSubjects.length > 3 && (
                        <li className="text-[11px] text-muted-foreground font-semibold pl-3">
                          +{track.featuredSubjects.length - 3} more subjects
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary group-hover:underline">
                    View Track Curriculum
                  </span>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-xl font-bold text-xs gap-1.5 shadow-sm"
                  >
                    <Link href={`/tracks/${track.id}`}>
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global CTA */}
        <div className="rounded-3xl bg-primary/5 border border-primary/20 p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Looking for all DepEd Curriculum Subjects?
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Browse our full catalog categorized by grade level, trimester, and semester with real-time
            competencies and quiz modules.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-xl font-bold text-xs px-6 py-5 gap-2 shadow-md">
              <Link href="/curriculum">
                <BookOpenCheck className="w-4 h-4" />
                <span>Browse Full Subject Catalog</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
