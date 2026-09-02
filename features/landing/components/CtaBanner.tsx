"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function CtaBanner() {
  return (
    <section className="py-12 bg-background transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-emerald-600 to-teal-700 p-8 sm:p-12 shadow-2xl shadow-primary/20">
          {/* Subtle Decorative Background Pattern */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none -z-0" />
          <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-xl pointer-events-none -z-0" />

          {/* Decorative Dot Grid */}
          <div className="absolute right-8 bottom-4 hidden md:grid grid-cols-6 gap-2 opacity-15 pointer-events-none">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
            ))}
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            {/* Left/Center Info with Icon */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Circular White Badge */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center text-primary shadow-xl shrink-0">
                <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>

              {/* Text */}
              <div className="space-y-2 max-w-xl">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  Ready to Excel in High School?
                </h3>
                <p className="text-sm sm:text-base text-white/90 font-normal leading-relaxed">
                  Join thousands of Junior &amp; Senior High School learners mastering 130+ DepEd subjects with 12 structured lessons, 24 practice quizzes, and 24/7 AI tutor guidance.
                </p>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto shrink-0">
              <Button asChild size="lg" className="w-full sm:w-auto bg-white hover:bg-slate-100 text-primary font-bold rounded-xl shadow-lg transition-all duration-200">
                <Link href="/#subjects" className="gap-2">
                  <span>Explore Subjects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white font-bold rounded-xl border-2 border-white/80 hover:border-white transition-all duration-200">
                <Link href="/login">
                  <span>Student Sign In</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
