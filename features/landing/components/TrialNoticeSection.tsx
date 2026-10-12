"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Gift,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export function TrialNoticeSection() {
  const trialPerks = [
    {
      title: "Full Access to All 130+ Subjects",
      description: "No locked curriculum tracks. Explore Junior High (Grades 7–10) and Senior High (STEM, ABM, HUMSS, GAS, TVL) freely.",
    },
    {
      title: "All 8 Lesson Modules Unlocked",
      description: "Read complete concept breakdowns, formula lists, and DepEd DO 015 s. 2026 competencies without restrictions.",
    },
    {
      title: "Unlimited Socratic AI Tutor Drills",
      description: "Engage with 24 practice quizzes per subject with instant 'Bakit Mali Ito?' guidance in Taglish, Cebuano, and Ilocano.",
    },
    {
      title: "Transparent 30-Day Countdown",
      description: "Track your active trial days right inside your student dashboard with a real-time progress indicator.",
    },
  ];

  return (
    <section id="free-trial" className="relative py-16 sm:py-20 lg:py-24 bg-muted/40 dark:bg-card/20 border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Decorative Background Accents */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Heading and Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                <Gift className="size-3.5" />
                <span>30-Day Full Access Trial</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight font-heading leading-[1.15]">
                Experience Everything Free for <span className="text-primary">30 Full Days</span>
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We believe every Filipino learner deserves world-class DepEd academic support.
                That’s why all new students receive a complete <strong className="text-foreground">30-day all-access trial</strong> covering
                every subject and lesson module from day one — <span className="text-foreground font-semibold">no credit card or upfront payment required</span>.
              </p>

              {/* Perk Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {trialPerks.map((perk, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-1 rounded-2xl border border-border/70 bg-background/80 p-4 shadow-xs"
                  >
                    <div className="flex items-center gap-2 font-heading font-bold text-xs sm:text-sm text-foreground">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span>{perk.title}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted-foreground pl-6 leading-relaxed">
                      {perk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Pricing & Trial Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-border/80 bg-background p-6 sm:p-8 shadow-xl flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 border-primary/30 text-primary bg-primary/5">
                    <Clock className="size-3 mr-1 text-primary" />
                    30 Days Active Pass
                  </Badge>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" />
                    Zero Risk
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-foreground font-heading">
                      ₱0
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      for first 30 days
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Continue after 30 days for only <strong className="text-foreground">₱299 / month</strong> via GCash or Maya. Cancel anytime.
                  </p>
                </div>

                {/* What happens during trial list */}
                <div className="space-y-2.5 text-xs text-muted-foreground py-2 border-y border-border/60">
                  <div className="flex items-center justify-between">
                    <span>Curriculum Access:</span>
                    <strong className="text-foreground">100% Unlocked (All Lessons)</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>DepEd DO 015 s. 2026 Engine:</span>
                    <strong className="text-foreground">Full Transmutation</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Socratic AI Assistant:</span>
                    <strong className="text-foreground">Multi-dialect Drills</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Card Required:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">None (Sign Up & Study)</strong>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Button asChild size="lg" className="w-full rounded-xl text-xs sm:text-sm font-bold shadow-md gap-2">
                    <Link href="/login">
                      <Sparkles className="size-4" />
                      <span>Start 30-Day Free Trial</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <p className="text-[11px] text-center text-muted-foreground">
                    Students can track remaining trial days in real-time on their dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
