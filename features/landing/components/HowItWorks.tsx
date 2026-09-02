"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Bot,
  ArrowRight,
  Layers,
  Check,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Download,
  HelpCircle,
} from "lucide-react";
import { CtaBanner } from "./CtaBanner";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Select Your Grade Level & Strand",
      badge: "Step 1: Curriculum Setup",
      description:
        "Choose your Junior High (Grades 7–10) or Senior High (Grades 11–12 STEM, ABM, HUMSS, GAS, TVL) grade level and target subjects from our comprehensive 130+ DepEd curriculum catalog.",
      icon: BookOpen,
      color: "bg-primary text-primary-foreground",
      accent: "text-primary",
      points: [
        "Select from official DepEd K-12 and MATATAG curriculum subjects",
        "Grade Level & Academic Strand hierarchical curriculum structure",
        "Instant student enrollment with automatic onboarding matching",
      ],
    },
    {
      step: "02",
      title: "Master the 12-Lesson Modules",
      badge: "Step 2: Structured Learning",
      description:
        "Each high school subject is structured into 12 core lesson modules, supported by 24 interactive practice quizzes per lesson to reinforce concept mastery.",
      icon: Layers,
      color: "bg-indigo-600 text-white",
      accent: "text-indigo-600 dark:text-indigo-400",
      points: [
        "12 structured lessons covering all competencies, formulas, and key summaries",
        "24 practice quizzes with verified DepEd-aligned answer keys",
        "PostgreSQL cache-first persistence for blazing-fast instant loading",
      ],
    },
    {
      step: "03",
      title: "Real-Time Socratic AI & Transmutation",
      badge: "Step 3: Interactive Tutoring",
      description:
        "Receive instant grading, step-by-step Socratic hints with 'Bakit Mali Ito?', dialect translations (English, Filipino, Taglish, Cebuano, Ilocano), and DepEd DO 015 s. 2026 transmuted scores.",
      icon: Bot,
      color: "bg-purple-600 text-white",
      accent: "text-purple-600 dark:text-purple-400",
      points: [
        "Instant score evaluation with DepEd DO 015 s. 2026 grade transmutation",
        "'Bakit Mali Ito?' Socratic AI hints that guide without spoiling answers",
        "Multi-dialect explanations in English, Filipino, Taglish, Cebuano, and Ilocano",
      ],
    },
    {
      step: "04",
      title: "Study Anywhere with Offline PWA",
      badge: "Step 4: Flexibility",
      description:
        "Download lessons, quizzes, and AI response summaries to your device so you can keep studying without consuming heavy mobile data or needing a constant internet connection.",
      icon: Download,
      color: "bg-emerald-600 text-white",
      accent: "text-emerald-600 dark:text-emerald-400",
      points: [
        "Progressive Web App (PWA) with fast offline local caching",
        "Save lesson notes and quiz feedback for exam review",
        "Study continuously anywhere across the Philippines",
      ],
    },
  ];

  const faqs = [
    {
      category: "General Curriculum & Setup",
      questions: [
        {
          q: "What is HighSchool Tutor?",
          a: "HighSchool Tutor is an AI-powered classroom study companion and Progressive Web App (PWA) designed for Philippine Junior and Senior High School students (Grades 7 to 12). It provides 130+ DepEd K-12 MATATAG aligned subjects with 12 structured lessons, 24 verified quizzes per subject, and real-time Socratic AI guidance.",
        },
        {
          q: "Is HighSchool Tutor aligned with the new DepEd MATATAG curriculum?",
          a: "Yes. All curriculum codes, learning competencies, and grading calculations strictly follow the Philippine Department of Education (DepEd) K-12 MATATAG guidelines and DepEd Order No. 015, s. 2026.",
        },
        {
          q: "Can I use HighSchool Tutor offline?",
          a: "Yes. As a Progressive Web App (PWA), you can install HighSchool Tutor on your smartphone or PC and download lessons and quizzes for offline study with low data requirements.",
        },
      ],
    },
    {
      category: "Socratic AI & Academic Integrity",
      questions: [
        {
          q: "How does the Socratic AI tutor help me learn?",
          a: "Instead of giving away answers directly, our Google Gemini AI tutor uses the Socratic method. It asks guiding questions, highlights foundational concepts, explains 'Bakit Mali Ito?' (Why is this wrong?), and translates explanations into your preferred dialect (English, Filipino, Taglish, Cebuano, Ilocano).",
        },
        {
          q: "Does using HighSchool Tutor violate school academic integrity rules?",
          a: "HighSchool Tutor is designed strictly for study, concept mastery, and exam preparation. Using it to practice and test your understanding is encouraged. However, students should never copy AI-generated text for submission in graded classroom assignments.",
        },
        {
          q: "How are grades transmuted on the platform?",
          a: "Quiz scores are automatically processed through the official DepEd Order No. 015, s. 2026 transmutation scale, showing both the raw percentage and the official transmuted grade descriptor.",
        },
      ],
    },
  ];

  return (
    <div className="w-full bg-background text-foreground transition-colors duration-200">
      {/* Header Hero */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-primary/10 via-background to-muted/30 overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold tracking-wide shadow-xs mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>DEPED K-12 MATATAG WORKFLOW</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground font-heading tracking-tight leading-[1.15] max-w-4xl mx-auto">
            How HighSchool Tutor Works
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto font-normal leading-relaxed">
            From selecting your Junior or Senior High track to mastering competencies with Socratic AI guidance, DepEd DO 015 transmutation, and offline study tools.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#subjects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all duration-200"
            >
              <span>Explore Subjects Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-card hover:bg-muted text-foreground font-semibold rounded-xl border border-border shadow-xs transition-all duration-200"
            >
              <span>Get Started Free</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16 lg:space-y-24">
            {steps.map((item, index) => {
              const IconComponent = item.icon;
              const isEven = index % 2 === 1;
              return (
                <div
                  key={index}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Visual Card */}
                  <div
                    className={`lg:col-span-6 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="relative bg-card rounded-3xl p-8 sm:p-10 shadow-xl shadow-black/5 border border-border overflow-hidden group">
                      {/* Decorative background blob */}
                      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />

                      {/* Step Number Watermark */}
                      <span className="absolute top-6 right-8 text-6xl sm:text-7xl font-black text-muted-foreground/15 font-heading select-none">
                        {item.step}
                      </span>

                      <div className="relative z-10 space-y-6">
                        <div
                          className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-lg shadow-black/5`}
                        >
                          <IconComponent className="w-7 h-7" />
                        </div>

                        <div className="inline-block px-3 py-1 rounded-full bg-muted text-xs font-bold text-muted-foreground">
                          {item.badge}
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black text-foreground font-heading leading-tight">
                          {item.title}
                        </h3>

                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step Details & Points */}
                  <div
                    className={`lg:col-span-6 space-y-6 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-primary font-heading">
                      PHASE {item.step} OF LEARNING JOURNEY
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-black text-foreground font-heading leading-tight">
                      How It Empowers High School Students
                    </h4>

                    <div className="space-y-3.5 pt-2">
                      {item.points.map((point, pIndex) => (
                        <div key={pIndex} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span className="text-sm sm:text-base font-medium text-foreground/90">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Educational Disclaimer Section */}
      <section className="py-16 lg:py-24 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-primary uppercase font-heading">
              Platform Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground font-heading tracking-tight mt-2">
              DepEd Alignment &amp; Socratic AI Ethics
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
              <strong className="text-foreground">Notice to Students &amp; Educators:</strong> HighSchool Tutor is built on verified Philippine K-12 MATATAG curriculum standards and Google Gemini AI. Please review the operational principles below.
            </p>
          </div>

          <div className="space-y-8">
            {/* Scope */}
            <div className="p-6 sm:p-8 rounded-3xl bg-background border border-border shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-heading">
                  1. DepEd Curriculum Alignment
                </h3>
              </div>
              <div className="space-y-4 pl-13">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Supplementary Learning Resource:</strong> HighSchool Tutor serves as an on-demand practice and tutoring companion. It supplements DepEd classroom lectures, official Self-Learning Modules (SLMs), and textbook study.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Socratic Mastery:</strong> We encourage students to engage with our AI tutor to master challenging STEM problems, analyze literature, and clarify complex scientific concepts through guided questioning.
                </p>
              </div>
            </div>

            {/* Ethical Caveat */}
            <div className="p-6 sm:p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-heading">
                  2. Academic Integrity &amp; AI Guidance
                </h3>
              </div>
              <div className="space-y-4 pl-13">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Critical Thinking First:</strong> While our AI models are calibrated on verified DepEd competencies, students must maintain discernment and cross-reference answers with standard textbooks.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Community Review:</strong> If you spot a typographical error or want to suggest an improvement to any quiz or lesson module, you can submit feedback directly from the lesson viewer.
                </p>
              </div>
            </div>

            {/* Rights */}
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-heading">
                  3. Offline Learning &amp; Privacy Protection
                </h3>
              </div>
              <div className="space-y-4 pl-13">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Study Offline:</strong> Download lesson modules and practice quizzes to your device for offline study without worrying about intermittent Wi-Fi or high data costs.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Data Privacy:</strong> Your student scores and AI chat queries are protected under Republic Act No. 10173 (Data Privacy Act of 2012) and PostgreSQL Row Level Security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-muted/20 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 shadow-xs">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground font-heading tracking-tight mt-2">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <div className="space-y-12">
            {faqs.map((faqGroup, index) => (
              <div key={index}>
                <h3 className="text-xl font-black text-foreground font-heading mb-6 border-b border-border pb-2">
                  {faqGroup.category}
                </h3>
                <div className="space-y-6">
                  {faqGroup.questions.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-card p-6 rounded-2xl border border-border shadow-xs"
                    >
                      <h4 className="text-lg font-bold text-foreground font-heading flex items-start gap-3">
                        <span className="text-primary mt-0.5">Q:</span>
                        {item.q}
                      </h4>
                      <div className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed flex items-start gap-3">
                        <span className="text-muted-foreground/60 font-bold mt-0.5">A:</span>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}

export default HowItWorks;
