"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  Globe,
  Clock,
  ArrowRight,
  DownloadCloud,
} from "lucide-react";

export function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("collection");

  const sections = [
    { id: "collection", title: "1. Information We Collect", icon: Database },
    { id: "usage", title: "2. How We Use Your Data", icon: UserCheck },
    { id: "ai-privacy", title: "3. AI Processing & Privacy Safeguards", icon: Lock },
    { id: "storage", title: "4. Local Storage & Offline Cache", icon: DownloadCloud },
    { id: "rights", title: "5. Your Data Rights & RA 10173", icon: Eye },
  ];

  return (
    <div className="w-full bg-background text-foreground transition-colors duration-200">
      {/* Header Hero Section */}
      <section className="relative pt-12 pb-14 lg:pt-16 lg:pb-18 bg-gradient-to-b from-primary/10 via-background to-muted/30 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide shadow-xs mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>DATA PRIVACY &amp; SECURITY NOTICE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground font-heading tracking-tight">
            Privacy Policy &amp; Data Protection
          </h1>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
            We are committed to protecting your academic data, learning analytics, and personal information across the HighSchool Tutor platform in compliance with the Philippine Data Privacy Act of 2012 (RA 10173).
          </p>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Effective Date: September 1, 2026</span>
            </div>
            <div className="hidden sm:block text-muted-foreground/40">•</div>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span>App: HighSchool Tutor (DepEd K-12 MATATAG PWA)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Sticky Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 bg-card rounded-3xl p-5 sm:p-6 border border-border shadow-md shadow-black/5">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-4 px-2 font-heading">
                  Privacy Sections
                </h3>
                <nav className="space-y-1">
                  {sections.map((sec) => {
                    const IconComp = sec.icon;
                    const isActive = activeSection === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={() => setActiveSection(sec.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-xs"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <IconComp className="w-4 h-4 shrink-0" />
                        <span className="truncate">{sec.title}</span>
                      </a>
                    );
                  })}
                </nav>

                <div className="mt-6 pt-5 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-3">
                    Also review our academic terms:
                  </p>
                  <Link
                    href="/terms"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Read Terms of Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Privacy Content Body */}
            <div className="lg:col-span-8 space-y-10">
              {/* 1. Collection */}
              <article
                id="collection"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    1. Information We Collect
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <p>We collect only the minimal personal data necessary to provide and personalize your high school learning experience:</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li><strong>Account Information:</strong> Full name, school email address, grade level (Grades 7 to 12), and Senior High strand (STEM, ABM, HUMSS, GAS, TVL).</li>
                    <li><strong>Usage &amp; Study Progress:</strong> Completed lesson modules, DepEd DO 015 s. 2026 quiz transmutation records, practice quiz scores, and saved explanation bookmarks.</li>
                    <li><strong>Socratic AI Interaction Logs:</strong> Prompt inquiries, clarification requests, and language preference choices (English, Filipino, Taglish, Cebuano, Ilocano) during tutoring sessions.</li>
                    <li><strong>Technical &amp; Device Storage:</strong> Browser local storage and IndexedDB caches required for offline Progressive Web App (PWA) functionality.</li>
                  </ul>
                </div>
              </article>

              {/* 2. Usage */}
              <article
                id="usage"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    2. How We Use Your Data
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li><strong>Personalized DepEd Learning:</strong> Tailoring lesson recommendations and Socratic AI explanations to your exact grade level and subject curriculum.</li>
                    <li><strong>DepEd MATATAG Transmutation:</strong> Calculating accurate transmuted grades and performance metrics in accordance with DepEd Order No. 015, s. 2026 guidelines.</li>
                    <li><strong>Platform Reliability &amp; Quality Control:</strong> Reviewing anonymized quiz feedback to ensure all lesson keys, formulas, and MATATAG curriculum topics remain 100% accurate.</li>
                    <li><strong>Offline Optimization:</strong> Caching lesson materials locally so high school learners in areas with intermittent connectivity can study uninterrupted.</li>
                  </ul>
                </div>
              </article>

              {/* 3. AI Privacy */}
              <article
                id="ai-privacy"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    3. AI Processing &amp; Privacy Safeguards
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li><strong>Zero Sale of Student Data:</strong> We never sell, rent, or monetize personal student data, academic records, or email addresses to advertisers or third parties.</li>
                    <li><strong>Secure AI Inference:</strong> Prompts sent to our Google Gemini Socratic AI tutor are encrypted in transit and stripped of personal identifiable information (PII) before processing.</li>
                    <li><strong>Academic Confidentiality:</strong> Your self-assessment scores and practice attempts are confidential and protected under strict Row Level Security (RLS) isolation.</li>
                  </ul>
                </div>
              </article>

              {/* 4. Storage */}
              <article
                id="storage"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <DownloadCloud className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    4. Local Storage &amp; Offline Cache
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li><strong>Browser Storage:</strong> HighSchool Tutor leverages browser IndexedDB and Cache Storage to allow offline review of downloaded DepEd lesson modules and quiz keys.</li>
                    <li><strong>User Control:</strong> You can clear your offline cache at any time via your browser settings or from your student profile settings within HighSchool Tutor.</li>
                  </ul>
                </div>
              </article>

              {/* 5. Rights */}
              <article
                id="rights"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    5. Your Data Rights &amp; RA 10173
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <p>In accordance with Republic Act No. 10173 (Data Privacy Act of 2012), you have full control over your academic information:</p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li><strong>Right to Access &amp; Portability:</strong> View and export your complete quiz attempts, transmutation certificates, and study logs.</li>
                    <li><strong>Right to Rectification:</strong> Update your grade level, track, name, and study preferences at any time.</li>
                    <li><strong>Right to Erasure:</strong> Request permanent deletion of your account and all associated learning history by contacting our support team at <a href="mailto:support@highschooltutor.app" className="text-primary font-semibold hover:underline">support@highschooltutor.app</a>.</li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
