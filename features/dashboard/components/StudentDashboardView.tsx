"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  Bot,
  ArrowRight,
  Send,
  Layers,
  ChevronRight,
  Crown,
  GraduationCap,
  TrendingUp,
  Save,
} from "lucide-react";
import { useDashboardStore, DashboardTab } from "../hooks/useDashboardStore";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
import { useUser } from "@/features/auth/hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";

interface StudentDashboardViewProps {
  activeTab?: DashboardTab;
}

export default function StudentDashboardView({
  activeTab: propActiveTab,
}: StudentDashboardViewProps = {}) {
  const { user } = useUser();
  const store = useDashboardStore();
  const activeTab = propActiveTab || store.activeTab;
  const setActiveTab = store.setActiveTab;
  const { openUpgradeModal } = useUpgradeModalStore();

  // Dynamic Student Profile Data from database
  const studentName = user?.profile?.fullName || user?.name || "Student";
  const studentGrade = user?.profile?.gradeLevel || "Grade 11";
  const studentTrack = user?.profile?.track || "STEM Strand";
  const studentSchool = user?.profile?.school || "DepEd High School";

  // State for AI Tutor Interactive Box
  const [aiQuery, setAiQuery] = useState("");
  const [aiLanguage, setAiLanguage] = useState<"taglish" | "english">("taglish");
  const [aiChatLogs, setAiChatLogs] = useState<
    { sender: "user" | "ai"; text: string; time: string }[]
  >([
    {
      sender: "ai",
      text: "Magandang araw! Ako ang iyong Gemini Socratic AI Tutor para sa DepEd K-12 MATATAG. Anong subject o lesson ang nais mong talakayin ngayon?",
      time: "10:00 AM",
    },
  ]);
  const [isAiResponding, setIsAiResponding] = useState(false);



  // High School Enrolled Subjects
  const enrolledSubjects = [
    {
      code: "G11-S1-GENMATH",
      name: "General Mathematics",
      grade: "Grade 11 • Semester 1",
      slug: "g11-s1-genmath",
      progress: 75,
      currentLesson: "Lesson 5: Rational Equations and Inequalities",
      quizzesDone: "6 of 8",
      averageScore: 94,
      status: "On Track",
    },
    {
      code: "G11-S1-PRECALC",
      name: "Pre-Calculus",
      grade: "Grade 11 STEM • Semester 1",
      slug: "g11-s1-precalc",
      progress: 60,
      currentLesson: "Lesson 4: Conic Sections (Parabolas & Ellipses)",
      quizzesDone: "5 of 8",
      averageScore: 91,
      status: "On Track",
    },
    {
      code: "G11-S1-EARTHSCI",
      name: "Earth and Life Science",
      grade: "Grade 11 • Semester 1",
      slug: "g11-s1-earthsci",
      progress: 88,
      currentLesson: "Lesson 7: Geologic Processes on Earth's Surface",
      quizzesDone: "7 of 8",
      averageScore: 96,
      status: "Mastered",
    },
    {
      code: "G11-S1-ORALCOMM",
      name: "Oral Communication in Context",
      grade: "Grade 11 • Semester 1",
      slug: "g11-s1-oralcomm",
      progress: 80,
      currentLesson: "Lesson 6: Communicative Strategies in Public Speaking",
      quizzesDone: "6 of 8",
      averageScore: 92,
      status: "On Track",
    },
    {
      code: "G11-S1-KOMFIL",
      name: "Komunikasyon at Pananaliksik",
      grade: "Grade 11 • Semester 1",
      slug: "g11-s1-komfil",
      progress: 70,
      currentLesson: "Aralin 5: Gamit ng Wika sa Lipunan",
      quizzesDone: "5 of 8",
      averageScore: 90,
      status: "On Track",
    },
    {
      code: "G11-S1-EAPP",
      name: "English for Academic Purposes (EAPP)",
      grade: "Grade 11 • Semester 1",
      slug: "g11-s1-eapp",
      progress: 65,
      currentLesson: "Lesson 5: Critical Approaches in Writing a Review",
      quizzesDone: "5 of 8",
      averageScore: 93,
      status: "On Track",
    },
  ];

  // Recent Quizzes Activity
  const recentQuizzes = [
    {
      title: "Quiz 5: Solving Rational Equations",
      subject: "General Mathematics",
      rawScore: "19 / 20",
      transmutedGrade: 96,
      date: "Today, 9:30 AM",
      status: "PASSED (Outstanding)",
    },
    {
      title: "Quiz 4: Ellipses and Hyperbolas",
      subject: "Pre-Calculus",
      rawScore: "17 / 20",
      transmutedGrade: 92,
      date: "Yesterday",
      status: "PASSED (Outstanding)",
    },
    {
      title: "Quiz 6: Plate Tectonics & Earthquakes",
      subject: "Earth and Life Science",
      rawScore: "20 / 20",
      transmutedGrade: 98,
      date: "2 days ago",
      status: "PASSED (Outstanding)",
    },
  ];

  const handleSendAiMessage = (preset?: string) => {
    const query = preset || aiQuery;
    if (!query.trim()) return;

    const userMsg = { sender: "user" as const, text: query, time: "Just now" };
    setAiChatLogs((prev) => [...prev, userMsg]);
    setAiQuery("");
    setIsAiResponding(true);

    setTimeout(() => {
      let responseText = "";
      if (query.toLowerCase().includes("rational")) {
        responseText = aiLanguage === "taglish"
          ? "Para sa rational inequalities: (1) Ilipat lahat ng terms sa kaliwa para maging 0 ang kanan. (2) Hanapin ang common denominator at pagsamahin. (3) Hanapin ang critical values kung saan zero ang numerator o denominator. (4) Gumawa ng sign chart sa number line!"
          : "For rational inequalities: (1) Move all terms to one side so zero is on the other. (2) Find the common denominator to combine into a single rational expression. (3) Identify critical points where numerator or denominator equals zero. (4) Construct a sign chart on the real number line.";
      } else if (query.toLowerCase().includes("mitosis") || query.toLowerCase().includes("photosynthesis")) {
        responseText = aiLanguage === "taglish"
          ? "Ang Photosynthesis ay binubuo ng dalawang yugto: Light-Dependent Reactions (sa Thylakoid membranes) na gumagawa ng ATP at NADPH, at Light-Independent / Calvin Cycle (sa Stroma) na bumubuo ng Glucose!"
          : "Photosynthesis consists of two main stages: Light-Dependent Reactions (in thylakoids) producing ATP and NADPH, and the Light-Independent / Calvin Cycle (in stroma) synthesizing glucose.";
      } else {
        responseText = aiLanguage === "taglish"
          ? `Magandang tanong! Sa ating DepEd MATATAG curriculum para sa ${studentGrade}, mahalagang unawain ang pangunahing konsepto bago mag-memorize ng formula. Nais mo ba ng step-by-step example?`
          : `Great question! In our DepEd MATATAG curriculum for ${studentGrade}, it is vital to master foundational principles before memorizing formulas. Would you like a step-by-step example?`;
      }

      setAiChatLogs((prev) => [
        ...prev,
        { sender: "ai", text: responseText, time: "Just now" },
      ]);
      setIsAiResponding(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic View by Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Welcome Banner Card */}
          <div className="bg-gradient-to-r from-primary via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-primary/10 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold border border-white/20">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{studentSchool}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Welcome back, {studentName}! 👋
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                  {studentGrade} • {studentTrack}
                </p>
              </div>

              <Button
                asChild
                className="bg-white hover:bg-slate-100 text-primary font-bold rounded-xl shadow-md text-xs px-5 py-5 gap-2"
              >
                <Link href="/curriculum/g11-s1-genmath">
                  <span>Resume General Mathematics</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold">Enrolled Subjects</span>
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span className="text-2xl font-black text-foreground">6</span>
              <p className="text-[11px] text-muted-foreground">DepEd Core &amp; STEM</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold">Quizzes Done</span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-2xl font-black text-foreground">34 / 48</span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">70.8% Completed</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold">DO 015 Transmuted Avg</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <span className="text-2xl font-black text-primary">94.2%</span>
              <p className="text-[11px] text-muted-foreground">Outstanding (DepEd)</p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold">AI Tutor Inquiries</span>
                <Bot className="w-4 h-4 text-teal-500" />
              </div>
              <span className="text-2xl font-black text-foreground">18</span>
              <p className="text-[11px] text-muted-foreground">Taglish &amp; English</p>
            </div>
          </div>

          {/* Active Learning In-Progress Card */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Current In-Progress Subject
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  General Mathematics (Grade 11 • Semester 1)
                </h3>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">
                75% Completed
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[75%]" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>Lesson 5: Rational Equations &amp; Inequalities</span>
                </div>
                <span>•</span>
                <span>Quiz 5 Available</span>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild size="sm" className="rounded-xl text-xs font-bold">
                  <Link href="/curriculum/g11-s1-genmath">
                    Continue Lesson Studio
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Dual Column: Recent Quizzes + Quick AI Socratic Assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Recent Quizzes */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">
                  Recent DepEd Quiz Transmutations
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveTab("quizzes")}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {recentQuizzes.map((quiz, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3 hover:bg-muted/70 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <h5 className="text-xs font-bold text-foreground truncate">
                        {quiz.title}
                      </h5>
                      <p className="text-[11px] text-muted-foreground">
                        {quiz.subject} • {quiz.date}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-primary block">
                        {quiz.transmutedGrade}%
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {quiz.rawScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick AI Assistant Mini Box */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs">
                    <Bot className="w-4 h-4" />
                    <span>Gemini Socratic Assistant</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Taglish / English
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ask any high school concept and receive Socratic reasoning instantly.
                </p>

                {/* Quick Prompts */}
                <div className="space-y-1.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("ai-tutor");
                      handleSendAiMessage("Paano i-solve ang rational inequality?");
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-muted/60 hover:bg-muted text-[11px] font-medium text-foreground border border-border transition-colors block"
                  >
                    💡 Paano i-solve ang rational inequality?
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("ai-tutor");
                      handleSendAiMessage("Explain photosynthesis step-by-step in Taglish");
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-muted/60 hover:bg-muted text-[11px] font-medium text-foreground border border-border transition-colors block"
                  >
                    🌱 Explain photosynthesis step-by-step
                  </button>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("ai-tutor")}
                className="w-full rounded-xl text-xs font-bold gap-2 mt-4"
              >
                <span>Open Full AI Tutor Space</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled Subjects Tab */}
      {activeTab === "subjects" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-foreground">
                Enrolled High School Subjects (Grade 11 STEM)
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full 12-lesson study studios with 24 standardized DepEd quizzes per subject.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() =>
                openUpgradeModal({
                  featureName: "All High School Subjects",
                  reason: "Upgrade to unlock all 130+ DepEd subjects across Junior & Senior High.",
                })
              }
              className="rounded-xl text-xs font-bold gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Unlock More Subjects</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledSubjects.map((sub) => (
              <div
                key={sub.code}
                className="p-5 rounded-3xl bg-card border border-border shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {sub.code}
                    </span>
                    <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                      Avg: {sub.averageScore}%
                    </Badge>
                  </div>

                  <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {sub.name}
                  </h4>

                  <p className="text-xs text-muted-foreground">
                    {sub.currentLesson}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                      <span>Progress</span>
                      <span className="text-foreground">{sub.progress}%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${sub.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {sub.quizzesDone} Quizzes
                  </span>
                  <Button asChild size="sm" className="rounded-xl text-xs font-bold gap-1">
                    <Link href={`/curriculum/${sub.slug}`}>
                      <span>Open Studio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quizzes & Transmutation Tab */}
      {activeTab === "quizzes" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-foreground">
              DepEd DO 015 s. 2026 Quiz &amp; Transmutation Records
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified assessment scores converted to DepEd MATATAG transmutation grades.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground font-bold uppercase tracking-wider text-[11px] border-b border-border">
                <tr>
                  <th className="p-4">Assessment Title</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Raw Score</th>
                  <th className="p-4">Transmuted Grade</th>
                  <th className="p-4">DepEd Descriptor</th>
                  <th className="p-4">Date Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card font-medium text-card-foreground">
                {recentQuizzes.map((q, i) => (
                  <tr key={i} className="hover:bg-muted/40 transition-colors">
                    <td className="p-4 font-bold text-foreground">{q.title}</td>
                    <td className="p-4">{q.subject}</td>
                    <td className="p-4 font-mono">{q.rawScore}</td>
                    <td className="p-4 font-black text-primary text-sm">{q.transmutedGrade}%</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{q.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scorecards & Grades Tab */}
      {activeTab === "scorecards" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-foreground">
              Quarterly Gradebook &amp; DO 015 Breakdown
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Weighted components: Written Work (33%), Performance Tasks (50%), and Quarterly Assessment (17%).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
              <span className="text-xs font-bold text-muted-foreground uppercase">Written Work (WW)</span>
              <span className="text-3xl font-black text-primary block">95.0%</span>
              <p className="text-xs text-muted-foreground">Quizzes, problem sets, and module exercises.</p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
              <span className="text-xs font-bold text-muted-foreground uppercase">Performance Tasks (PT)</span>
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block">93.5%</span>
              <p className="text-xs text-muted-foreground">Laboratory experiments, practical computations.</p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3">
              <span className="text-xs font-bold text-muted-foreground uppercase">Quarterly Assessment (QA)</span>
              <span className="text-3xl font-black text-teal-600 dark:text-teal-400 block">96.0%</span>
              <p className="text-xs text-muted-foreground">1st Periodical Examination.</p>
            </div>
          </div>
        </div>
      )}

      {/* Gemini AI Socratic Tutor Space */}
      {activeTab === "ai-tutor" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-foreground">
                Google Gemini Socratic AI Tutor
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ask any high school concept in Taglish or English for step-by-step guidance.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAiLanguage("taglish")}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  aiLanguage === "taglish"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                🇵🇭 Taglish Mode
              </button>
              <button
                type="button"
                onClick={() => setAiLanguage("english")}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  aiLanguage === "english"
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                🇺🇸 English Mode
              </button>
            </div>
          </div>

          {/* Chat Window */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-4 flex flex-col h-[520px]">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {aiChatLogs.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {msg.sender === "user" ? "JD" : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm max-w-[80%] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted text-card-foreground border border-border"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[10px] opacity-70 block mt-1 text-right">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {isAiResponding && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground italic p-2">
                  <Bot className="w-4 h-4 animate-spin text-primary" />
                  <span>Gemini Socratic AI is thinking...</span>
                </div>
              )}
            </div>

            {/* Message Input Box */}
            <div className="pt-3 border-t border-border flex items-center gap-2">
              <Input
                placeholder="Ask about rational equations, conic sections, biology, or literature..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendAiMessage();
                }}
                className="rounded-xl text-xs h-10"
              />
              <Button
                onClick={() => handleSendAiMessage()}
                className="rounded-xl h-10 px-4 font-bold text-xs gap-1.5 shadow-md shadow-primary/20"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Student Settings Tab */}
      {activeTab === "settings" && (
        <StudentSettingsTab key={user?.id || "guest"} user={user} />
      )}
    </div>
  );
}

interface StudentUserProps {
  id?: string;
  email?: string | null;
  name?: string | null;
  profile?: {
    fullName?: string;
    gradeLevel?: string;
    track?: string;
    school?: string;
    hasOnboarded?: boolean;
  } | null;
}

function StudentSettingsTab({ user }: { user: StudentUserProps | null | undefined }) {
  const queryClient = useQueryClient();
  const [studentFullName, setStudentFullName] = useState(
    user?.profile?.fullName || user?.name || ""
  );
  const [schoolName, setSchoolName] = useState(user?.profile?.school || "");
  const [selectedGrade, setSelectedGrade] = useState(
    user?.profile?.gradeLevel || "Grade 11"
  );
  const [selectedTrack, setSelectedTrack] = useState(
    user?.profile?.track || "STEM Strand"
  );
  const [tutorPersona, setTutorPersona] = useState<
    "socratic" | "detailed" | "exam-prep"
  >("socratic");

  const profileMutation = useMutation({
    mutationFn: async (data: {
      fullName: string;
      school?: string;
      gradeLevel?: string;
      track?: string;
    }) => {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        throw new Error(errorData.error || "Failed to save profile");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Preferences Saved Successfully!", {
        description: "Your student profile and AI preferences have been updated.",
      });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile settings.";
      toast.error("Save Failed", {
        description: msg,
      });
    },
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    profileMutation.mutate({
      fullName: studentFullName,
      school: schoolName,
      gradeLevel: selectedGrade,
      track: selectedTrack,
    });
  };

  return (
    <form
      onSubmit={handleSaveSettings}
      className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6 max-w-3xl"
    >
      <div>
        <h3 className="text-xl font-black text-foreground font-heading">
          Student Profile &amp; AI Preferences
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Customize your Socratic AI tutor persona, grade level, and school details.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">Full Name</label>
          <Input
            value={studentFullName}
            onChange={(e) => setStudentFullName(e.target.value)}
            placeholder="Juan Dela Cruz"
            className="rounded-xl text-xs h-10"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">Registered Email</label>
          <Input
            value={user?.email || "student@highschooltutor.ph"}
            disabled
            className="rounded-xl text-xs bg-muted cursor-not-allowed h-10 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">School / Institution</label>
          <Input
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="e.g. Manila Science High School"
            className="rounded-xl text-xs h-10"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Grade Level</label>
            <select
              value={selectedGrade}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedGrade(val);
                if (val === "Grade 11" || val === "Grade 12") {
                  if (selectedTrack === "JHS Core") setSelectedTrack("STEM Strand");
                } else {
                  setSelectedTrack("JHS Core");
                }
              }}
              className="w-full bg-background text-xs text-foreground p-2.5 rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-primary h-10"
            >
              <optgroup label="Junior High School (Grades 7–10)">
                <option value="Grade 7">Grade 7 (Junior High School)</option>
                <option value="Grade 8">Grade 8 (Junior High School)</option>
                <option value="Grade 9">Grade 9 (Junior High School)</option>
                <option value="Grade 10">Grade 10 (Junior High School)</option>
              </optgroup>
              <optgroup label="Senior High School (Grades 11–12)">
                <option value="Grade 11">Grade 11 (Senior High School)</option>
                <option value="Grade 12">Grade 12 (Senior High School)</option>
              </optgroup>
            </select>
          </div>

          {(selectedGrade === "Grade 11" || selectedGrade === "Grade 12") && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Track / Strand</label>
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="w-full bg-background text-xs text-foreground p-2.5 rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-primary h-10"
              >
                <option value="STEM Strand">STEM (Science, Tech, Engineering, Math)</option>
                <option value="ABM Strand">ABM (Accountancy, Business, Management)</option>
                <option value="HUMSS Strand">HUMSS (Humanities &amp; Social Sciences)</option>
                <option value="GAS Strand">General Academic Strand (GAS)</option>
                <option value="TVL Track">Technical-Vocational-Livelihood (TVL Track)</option>
              </select>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">AI Tutor Persona</label>
          <select
            value={tutorPersona}
            onChange={(e) =>
              setTutorPersona(
                e.target.value as "socratic" | "detailed" | "exam-prep"
              )
            }
            className="w-full bg-background text-xs text-foreground p-2.5 rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-primary h-10"
          >
            <option value="socratic">Socratic (Guides you with hints and questions)</option>
            <option value="detailed">Comprehensive (Full step-by-step breakdown)</option>
            <option value="exam-prep">Exam Reviewer (Focuses on periodic test tips)</option>
          </select>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <Button
            type="submit"
            disabled={profileMutation.isPending}
            className="rounded-xl text-xs font-bold gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{profileMutation.isPending ? "Saving..." : "Save Preferences"}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}

