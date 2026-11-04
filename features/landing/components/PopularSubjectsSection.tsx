"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookMarked,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { FEATURED_POPULAR_SUBJECTS } from "../constants/popular-subjects";

export function PopularSubjectsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const subjects = FEATURED_POPULAR_SUBJECTS;

  return (
    <section id="subjects" className="py-16 lg:py-24 bg-muted/40 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow Header */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-primary/40" />
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
            <BookMarked className="w-3.5 h-3.5" />
            <span>POPULAR HIGH SCHOOL SUBJECTS</span>
          </div>
          <div className="h-px w-8 bg-primary/40" />
        </div>

        {/* Section Header & View All */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Our Most Popular DepEd Subjects
          </h2>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline transition-colors group"
          >
            <span>View All 75+ DepEd Subjects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Carousel Container with Prev/Next buttons */}
        <div className="relative group/carousel">
          {/* Prev Button */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous subjects"
            className="absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-foreground hover:text-primary hover:scale-110 transition-all z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next subjects"
            className="absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-foreground hover:text-primary hover:scale-110 transition-all z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Subject Cards Scroll Track / Grid */}
          <div
            ref={scrollContainerRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth no-scrollbar"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {subjects.map((subject) => (
              <div
                key={subject.id}
                style={{ scrollSnapAlign: "start" }}
                className="w-[280px] sm:w-[300px] lg:w-[280px] shrink-0 bg-card rounded-3xl overflow-hidden border border-border shadow-md hover:shadow-xl hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Subject Image */}
                <div>
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                      src={subject.image}
                      alt={subject.title}
                      fill
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 300px, 280px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    {/* Category */}
                    <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase block mb-1.5">
                      {subject.category}
                    </span>

                    {/* Subject Title */}
                    <h3 className="text-base font-bold text-card-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-3">
                      {subject.title}
                    </h3>

                    {/* Genuine Curriculum Metadata */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                        DepEd DO 015 s. 2026
                      </Badge>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {subject.quarter}
                      </span>
                    </div>

                    {/* Metadata */}
                    <p className="text-xs text-muted-foreground font-medium">
                      {subject.lessons} • {subject.level}
                    </p>
                  </div>
                </div>

                {/* Card Footer with Price & Link */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-border">
                  <Badge variant="secondary" className="text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20">
                    {subject.price}
                  </Badge>
                  <Link
                    href={`/curriculum/${subject.slug}`}
                    className="text-xs font-bold text-card-foreground hover:text-primary flex items-center gap-1 group/btn"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
