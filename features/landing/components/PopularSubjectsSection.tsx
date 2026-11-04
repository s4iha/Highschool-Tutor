"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookMarked, ArrowRight } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { FEATURED_POPULAR_SUBJECTS } from "../constants/popular-subjects";
import { cn } from "@/lib/utils";

export function PopularSubjectsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const subjects = FEATURED_POPULAR_SUBJECTS;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <section id="subjects" className="py-12 sm:py-16 lg:py-20 bg-muted/40 relative transition-colors duration-200">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-10 text-center sm:text-left">
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

        {/* Swipable Carousel Track Container */}
        <div className="relative">
          {/* Subject Cards Scroll Track / Grid */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onClickCapture={handleClickCapture}
            className={cn(
              "flex gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar select-none",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            style={{
              scrollSnapType: isDragging ? "none" : "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {subjects.map((subject) => (
              <div
                key={subject.id}
                style={{ scrollSnapAlign: "start" }}
                className="w-[280px] sm:w-[300px] lg:w-[280px] shrink-0 bg-card rounded-3xl overflow-hidden border border-border shadow-md hover:shadow-xl hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Subject Image */}
                <div>
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted pointer-events-none">
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
