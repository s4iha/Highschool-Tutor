"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Award,
  AlertTriangle,
  Scale,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Globe,
} from "lucide-react";

export function TermsOfService() {
  const [activeSection, setActiveSection] = useState("acceptance");

  const sections = [
    { id: "acceptance", title: "1. Acceptance & Educational Scope", icon: BookOpen },
    { id: "eligibility", title: "2. Student Accounts & Eligibility", icon: ShieldCheck },
    { id: "integrity", title: "3. Academic Integrity & AI Ethics", icon: Award },
    { id: "grading", title: "4. DepEd DO 015 s. 2026 Transmutation", icon: Scale },
    { id: "tiers", title: "5. Free Tier & Premium Subscriptions", icon: Sparkles },
    { id: "liability", title: "6. Disclaimers & AI Fallibility", icon: AlertTriangle },
    { id: "governing", title: "7. Governing Law & Contact", icon: FileText },
  ];

  return (
    <div className="w-full bg-background text-foreground transition-colors duration-200">
      {/* Header Hero Section */}
      <section className="relative pt-12 pb-14 lg:pt-16 lg:pb-18 bg-gradient-to-b from-primary/10 via-background to-muted/30 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold tracking-wide shadow-xs mb-4">
            <Scale className="w-4 h-4 text-primary" />
            <span>TERMS OF SERVICE &amp; ACADEMIC USAGE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground font-heading tracking-tight">
            Terms of Service
          </h1>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
            Welcome to HighSchool Tutor. Please read these terms carefully before accessing our DepEd K-12 MATATAG aligned learning platform, AI Socratic tutors, and practice quiz engines.
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
                  Terms Sections
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
                    Learn about how we protect your information:
                  </p>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Read Privacy Policy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Terms Content Body */}
            <div className="lg:col-span-8 space-y-10">
              {/* 1. Acceptance */}
              <article
                id="acceptance"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    1. Acceptance &amp; Educational Scope
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <p>
                    By registering for, downloading, or accessing HighSchool Tutor, you agree to be bound by these Terms of Service.
                  </p>
                  <p>
                    HighSchool Tutor is an educational software platform designed strictly as a supplementary learning tool aligned with the Philippine Department of Education (DepEd) K-12 and MATATAG curriculum guidelines for Junior High School (Grades 7–10) and Senior High School (Grades 11–12, covering STEM, ABM, HUMSS, GAS, and TVL tracks).
                  </p>
                  <p>
                    HighSchool Tutor is not an accredited degree-granting secondary institution and does not replace official DepEd classroom instruction, official DepEd Self-Learning Modules (SLMs), or certified teacher assessments.
                  </p>
                </div>
              </article>

              {/* 2. Eligibility */}
              <article
                id="eligibility"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    2. Student Accounts &amp; Eligibility
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li><strong>Account Security:</strong> You are responsible for safeguarding your login credentials and for all activities conducted under your HighSchool Tutor student account.</li>
                    <li><strong>Accurate Information:</strong> You agree to provide accurate registration details (e.g. current grade level and Senior High track) to ensure curriculum lessons and quiz transmutations are correctly tailored.</li>
                    <li><strong>Guardian Supervision:</strong> Learners under the age of 18 are encouraged to review these Terms with a parent, legal guardian, or educator.</li>
                  </ul>
                </div>
              </article>

              {/* 3. Academic Integrity */}
              <article
                id="integrity"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    3. Academic Integrity &amp; Socratic AI Ethics
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <p>
                    HighSchool Tutor features an interactive Google Gemini Socratic AI assistant designed to promote critical thinking through guided hints, conceptual breakdowns, and dialect translations.
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li><strong>Honest Study Practices:</strong> Practice quizzes and self-evaluations are intended for personal mastery and exam preparation.</li>
                    <li><strong>No Plagiarism or Cheating:</strong> You agree not to copy or submit AI-generated explanations as your own original work in graded school assignments, DepEd quarterly assessments, or national examinations.</li>
                    <li><strong>Ethical Inquiries:</strong> Students must maintain respect when interacting with AI tutors and adhere to standard anti-cyberbullying and student conduct policies.</li>
                  </ul>
                </div>
              </article>

              {/* 4. DepEd DO 015 s. 2026 */}
              <article
                id="grading"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    4. DepEd DO 015 s. 2026 Transmutation System
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Our platform incorporates transmutation calculations based on <strong>DepEd Order No. 015, series of 2026</strong> (MATATAG Classroom Assessment and Grading Guidelines).
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li>Transmuted percentage scores and performance descriptor calculations generated on practice exams are for illustrative self-assessment purposes.</li>
                    <li>Official DepEd quarter grades are determined solely by your registered school teachers in accordance with your school division’s official grading policies.</li>
                  </ul>
                </div>
              </article>

              {/* 5. Tiers */}
              <article
                id="tiers"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    5. Free Tier &amp; Premium Subscriptions
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <ul className="list-disc list-inside space-y-1.5 pl-2">
                    <li><strong>Free Tier Guardrails:</strong> Free student accounts may enroll in up to three (3) trial subjects with access to the first three (3) lessons per subject and standard AI inquiries.</li>
                    <li><strong>Premium Tier:</strong> Upgrading unlocks all 130+ DepEd Junior &amp; Senior High subjects, all 12 lesson modules, 24 verified quizzes per subject, unlimited Socratic AI hints, and offline PWA caching.</li>
                    <li><strong>Subscription Billing:</strong> Premium subscriptions are billed on a recurring or one-time basis as specified at checkout. Subscriptions may be cancelled at any time through your dashboard settings.</li>
                  </ul>
                </div>
              </article>

              {/* 6. Disclaimers */}
              <article
                id="liability"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    6. Disclaimers &amp; AI Fallibility
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <p>
                    While we strive for 100% curriculum alignment, AI-generated explanations and hints are provided &quot;as is&quot;. AI models may occasionally produce errors or imperfect interpretations.
                  </p>
                  <p>
                    Learners are advised to exercise critical thinking and cross-reference complex mathematical or scientific principles with their official textbooks and teachers.
                  </p>
                </div>
              </article>

              {/* 7. Governing Law */}
              <article
                id="governing"
                className="bg-card rounded-3xl p-7 sm:p-9 border border-border shadow-md shadow-black/5 scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading tracking-tight">
                    7. Governing Law &amp; Contact
                  </h2>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <p>
                    These Terms are governed by and construed in accordance with the laws of the Republic of the Philippines.
                  </p>
                  <p>
                    If you have any questions or feedback regarding these Terms, please contact our support team at{" "}
                    <a href="mailto:support@highschooltutor.app" className="text-primary font-semibold hover:underline">
                      support@highschooltutor.app
                    </a>.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TermsOfService;
