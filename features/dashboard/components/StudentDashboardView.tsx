"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  ArrowRight,
  Layers,
  ChevronRight,
  Crown,
  GraduationCap,
  TrendingUp,
  Save,
  Sun,
  Moon,
  Monitor,
  Palette,
  User as UserIcon,
  Check,
  LayoutGrid,
  List,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { useDashboardStore, DashboardTab } from "../hooks/useDashboardStore";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
import { useUser } from "@/features/auth/hooks/useUser";
import { useDashboardData } from "../hooks/useDashboardData";
import { useDashboardTour } from "../hooks/useDashboardTour";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";
import { getUserQuizAttemptsAction } from "@/features/curriculum/actions/curriculum.actions";
import { useAiPromptsModalStore } from "@/shared/hooks/useAiPromptsModalStore";
import { AiPromptsHelpModal } from "@/shared/components/ui/AiPromptsHelpModal";
import { AiPromptsFab } from "@/shared/components/ui/AiPromptsFab";

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

  const subjectsViewMode = store.subjectsViewMode || "grid";
  const setSubjectsViewMode = store.setSubjectsViewMode;

  const emptySubscribe = () => () => {};
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const effectiveViewMode = isMounted ? subjectsViewMode : "grid";

  // Query real user quiz attempts from PostgreSQL
  const { data: userAttemptsData } = useQuery({
    queryKey: ["user-quiz-attempts", user?.id],
    queryFn: async () => {
      const res = await getUserQuizAttemptsAction(20);
      return res.success ? res.attempts : [];
    },
    enabled: !!user?.id,
  });

  // Dynamic Student Profile Data from database
  const studentName =
    user?.profile?.fullName?.trim() ||
    user?.name?.trim() ||
    "Student";
  const studentGrade = user?.profile?.gradeLevel?.trim() || "Grade 11";
  const studentTrack = user?.profile?.track?.trim() || "STEM Strand";
  const studentSchool = user?.profile?.school?.trim() || "DepEd High School";

  const openPromptsModal = useAiPromptsModalStore((s) => s.openModal);







  const queryClient = useQueryClient();

  // Load real-time aggregated dashboard data
  const { data: dashboardData } = useDashboardData(!!user?.id);
  const metrics = dashboardData?.metrics;
  const activeLearning = dashboardData?.activeLearning;

  const dynamicEnrolledSubjects = React.useMemo(() => {
    return (dashboardData?.enrolledSubjects || []).map((sub) => ({
      code: sub.code,
      name: sub.name,
      grade: `${sub.grade} • ${sub.term}`,
      slug: sub.slug,
      progress: sub.progressPercent,
      currentLesson:
        sub.completedLessons > 0
          ? `Lesson ${sub.completedLessons} completed`
          : "Lesson 1: Not started",
      quizzesDone: `${sub.completedLessons} of ${sub.totalLessons}`,
      averageScore: sub.lastScorePercent ?? 0,
      status:
        (sub.lastScorePercent ?? 0) >= 75
          ? "Mastered"
          : sub.completedLessons > 0
          ? "Needs Review"
          : "Not Started",
    }));
  }, [dashboardData?.enrolledSubjects]);

  // Hook for Driver.js Onboarding Tour
  useDashboardTour({
    user,
    onTourComplete: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });



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

              {activeLearning ? (
                <Button
                  asChild
                  className="bg-white hover:bg-slate-100 text-primary font-bold rounded-xl shadow-md text-xs px-5 py-5 gap-2"
                >
                  <Link href={`/curriculum/${activeLearning.subjectSlug}`}>
                    <span>Resume {activeLearning.subjectName}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-white hover:bg-slate-100 text-primary font-bold rounded-xl shadow-md text-xs px-5 py-5 gap-2"
                >
                  <Link href="/curriculum">
                    <BookOpen className="w-4 h-4" />
                    <span>Explore Curriculum</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div data-tour="metrics-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold">Enrolled Subjects</span>
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span className="text-2xl font-black text-foreground">
                {metrics?.enrolledCount ?? 0}
              </span>
              <p className="text-[11px] text-muted-foreground">
                {(metrics?.enrolledCount ?? 0) > 0 ? "DepEd Trial Subjects" : "No subjects added yet"}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold">Practice Tests Taken</span>
                <Award className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-2xl font-black text-foreground">
                {metrics?.completedQuizzesCount ?? 0} / {metrics?.totalQuizzesCount ?? 12}
              </span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {metrics?.totalQuizzesCount
                  ? `${Math.round(((metrics.completedQuizzesCount || 0) / metrics.totalQuizzesCount) * 100)}% Completed`
                  : "0% Completed"}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold">DO 015 Transmuted Avg</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <span className="text-2xl font-black text-primary">
                {metrics?.transmutedAverage !== null && metrics?.transmutedAverage !== undefined
                  ? `${metrics.transmutedAverage}%`
                  : "—"}
              </span>
              <p className="text-[11px] text-muted-foreground">
                {metrics?.transmutedRemarks ?? "No evaluations yet"}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold">Enrolled Subjects</span>
                <BookOpen className="w-4 h-4 text-teal-500" />
              </div>
              <span className="text-2xl font-black text-foreground">
                {dynamicEnrolledSubjects.length}
              </span>
              <p className="text-[11px] text-muted-foreground">
                Active DepEd Courses
              </p>
            </div>
          </div>

          {/* Active Learning In-Progress Card */}
          {activeLearning ? (
            <div data-tour="active-learning" className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Current In-Progress Subject
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    {activeLearning.subjectName} ({activeLearning.subjectGrade} • {activeLearning.subjectTerm})
                  </h3>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">
                  {activeLearning.progressPercent}% Completed
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeLearning.progressPercent}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Layers className="w-4 h-4 text-primary" />
                    <span>{activeLearning.lessonTitle}</span>
                  </div>
                  <span>•</span>
                  <span>Quiz {activeLearning.lessonNumber} Available</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild size="sm" className="rounded-xl text-xs font-bold">
                    <Link href={`/curriculum/${activeLearning.subjectSlug}`}>
                      Continue Lesson Studio
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div data-tour="active-learning" className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Start Your Learning Journey
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  No Active Subject Yet
                </h3>
                <p className="text-xs text-muted-foreground">
                  Pick any DepEd MATATAG subject from our curriculum catalog to begin lessons and practice tests.
                </p>
              </div>
              <Button asChild className="rounded-xl text-xs font-bold gap-2 shrink-0">
                <Link href="/curriculum">
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Subjects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          )}

          {/* Dual Column: Recent Quizzes + Quick AI Socratic Assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Recent Quizzes */}
            <div data-tour="recent-tests" className="lg:col-span-7 p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">
                  Recent Practice Test Transmutations
                </h4>
                {userAttemptsData && userAttemptsData.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("subjects")}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View All &rarr;
                  </button>
                )}
              </div>

              {userAttemptsData && userAttemptsData.length > 0 ? (
                <div className="space-y-3">
                  {userAttemptsData.slice(0, 3).map((quiz, i) => (
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
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl bg-muted/20 border border-dashed border-border/80">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground/60 mb-3">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-foreground">No practice tests yet</h5>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    Complete a quiz to see your official DepEd DO 015 s. 2026 grade transmutations here.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("subjects")}
                    className="mt-4 rounded-xl text-xs font-bold gap-1.5 shadow-xs"
                  >
                    <span>Take Your First Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Right: AI Study Prompts & Guide Card */}
            <div data-tour="ai-tutor-box" className="lg:col-span-5 p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>AI Study Tutor Guide</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    10 Ready Prompts
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-foreground">
                  Using AI as Your Study Tutor
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Turn ChatGPT, Claude, or Gemini into your personal high school tutor with structured prompts.
                </p>

                {/* Quick Prompts */}
                <div className="space-y-1.5 pt-2">
                  <button
                    type="button"
                    onClick={() => openPromptsModal(activeLearning?.lessonTitle || "Rational Functions")}
                    className="w-full text-left p-2.5 rounded-xl bg-muted/60 hover:bg-muted text-[11px] font-medium text-foreground border border-border transition-colors block cursor-pointer"
                  >
                    💡 &quot;Explain [Topic] in simple terms as if I am 14...&quot;
                  </button>
                  <button
                    type="button"
                    onClick={() => openPromptsModal(activeLearning?.lessonTitle || "Rational Functions")}
                    className="w-full text-left p-2.5 rounded-xl bg-muted/60 hover:bg-muted text-[11px] font-medium text-foreground border border-border transition-colors block cursor-pointer"
                  >
                    🔍 &quot;Break down how [Topic] works step-by-step...&quot;
                  </button>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => openPromptsModal(activeLearning?.lessonTitle)}
                className="w-full rounded-xl text-xs font-bold gap-2 mt-4 cursor-pointer"
              >
                <span>Open 10 Copy-and-Paste Prompts</span>
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
                Enrolled High School Subjects ({studentGrade} • {studentTrack})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Full 12-lesson study studios with 24 standardized practice tests per subject.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* View Mode Toggle: Cards vs List */}
              <div className="flex items-center p-1 rounded-xl bg-muted border border-border">
                <button
                  type="button"
                  onClick={() => setSubjectsViewMode("grid")}
                  aria-label="Grid card view"
                  title="Grid Card View"
                  className={cn(
                    "p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                    effectiveViewMode === "grid"
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubjectsViewMode("list")}
                  aria-label="Compact list view"
                  title="Compact List View"
                  className={cn(
                    "p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                    effectiveViewMode === "list"
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">List</span>
                </button>
              </div>

              <Button
                size="sm"
                onClick={() =>
                  openUpgradeModal({
                    featureName: "All High School Subjects",
                    reason: "Upgrade to unlock all DepEd subjects across Junior & Senior High.",
                  })
                }
                className="rounded-xl text-xs font-bold gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Unlock More Subjects</span>
              </Button>
            </div>
          </div>

          {/* Render Empty State vs List View vs Card Grid */}
          {dynamicEnrolledSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-card border border-border shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-1">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-foreground">No Enrolled Subjects Yet</h4>
              <p className="text-xs text-muted-foreground max-w-md">
                As a free learner, you can explore lessons across DepEd MATATAG subjects. Browse our complete curriculum catalog and jump directly into your first study module!
              </p>
              <Button asChild className="rounded-xl text-xs font-bold gap-2 mt-2">
                <Link href="/curriculum">
                  <span>Explore Curriculum Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          ) : effectiveViewMode === "list" ? (
            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/70 text-muted-foreground font-bold uppercase tracking-wider text-[11px] border-b border-border">
                  <tr>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Current Module / Lesson</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4">Average</th>
                    <th className="p-4">Practice Tests</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-medium text-card-foreground">
                  {dynamicEnrolledSubjects.map((sub) => (
                    <tr key={sub.code} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-foreground text-sm">{sub.name}</span>
                      </td>
                      <td className="p-4 text-muted-foreground max-w-xs truncate">
                        {sub.currentLesson}
                      </td>
                      <td className="p-4">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span>{sub.progress}%</span>
                          </div>
                          <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-500"
                              style={{ width: `${sub.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary font-bold">
                          {sub.averageScore}%
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground font-medium">
                        {sub.quizzesDone}
                      </td>
                      <td className="p-4 text-right">
                        <Button asChild size="sm" className="rounded-xl text-xs font-bold gap-1">
                          <Link href={`/curriculum/${sub.slug}`}>
                            <span>Open Studio</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dynamicEnrolledSubjects.map((sub) => (
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
                      {sub.quizzesDone} Practice Tests
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
          )}
        </div>
      )}

      {/* Student Settings Tab */}
      {activeTab === "settings" && (
        <StudentSettingsTab key={user?.id || "guest"} user={user} />
      )}

      {/* Pre-configured AI Study Prompts Help Modal & Floating Action Button */}
      <AiPromptsHelpModal />
      <AiPromptsFab topic={activeLearning?.lessonTitle} />
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
    tutoringPersona?: string | null;
    termPreference?: string | null;
    hasOnboarded?: boolean;
  } | null;
}

function StudentSettingsTab({ user }: { user: StudentUserProps | null | undefined }) {
  const queryClient = useQueryClient();
  const [studentFullName, setStudentFullName] = useState(
    user?.profile?.fullName?.trim() || user?.name?.trim() || ""
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
  >((user?.profile?.tutoringPersona as "socratic" | "detailed" | "exam-prep") || "socratic");

  const { theme, setTheme } = useTheme();
  const [activeSettingsSection, setActiveSettingsSection] = useState<"profile" | "preferences">("preferences");

  const profileMutation = useMutation({
    mutationFn: async (data: {
      fullName: string;
      school?: string;
      gradeLevel?: string;
      track?: string;
      tutoringPersona?: "socratic" | "detailed" | "exam-prep";
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
      tutoringPersona: tutorPersona,
    });
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6 max-w-3xl">
      <div>
        <h3 className="text-xl font-black text-foreground font-heading">
          Student Preferences &amp; Settings
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure your interface theme, learning preferences, and academic profile.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveSettingsSection("preferences")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSettingsSection === "preferences"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Preferences &amp; Theme</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSettingsSection("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSettingsSection === "profile"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Student Profile</span>
        </button>
      </div>

      {activeSettingsSection === "preferences" ? (
        /* PREFERENCES & THEME TAB */
        <div className="space-y-6">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-bold text-foreground">Theme &amp; Display Preference</h4>
              <p className="text-xs text-muted-foreground">
                Customize your visual study workspace. Select Light mode for daytime focus, Dark mode for low-light evening studying, or synchronize automatically with your device settings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Light Mode Card */}
              <div
                onClick={() => {
                  setTheme("light");
                  toast.success("Theme changed to Light Mode");
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2.5 ${
                  theme === "light"
                    ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                    : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
                }`}
              >
                <div className="size-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-2xs">
                  <Sun className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">Light Mode</span>
                  <span className="text-[10px] text-muted-foreground">Clean, bright daytime paper style</span>
                </div>
                {theme === "light" && (
                  <Badge variant="outline" className="text-[10px] text-primary border-primary/30 mt-1 bg-primary/10">
                    <Check className="size-3 mr-1" /> Active
                  </Badge>
                )}
              </div>

              {/* Dark Mode Card */}
              <div
                onClick={() => {
                  setTheme("dark");
                  toast.success("Theme changed to Dark Mode");
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2.5 ${
                  theme === "dark"
                    ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                    : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
                }`}
              >
                <div className="size-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-2xs">
                  <Moon className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">Dark Mode</span>
                  <span className="text-[10px] text-muted-foreground">Reduced eye strain for nighttime study</span>
                </div>
                {theme === "dark" && (
                  <Badge variant="outline" className="text-[10px] text-primary border-primary/30 mt-1 bg-primary/10">
                    <Check className="size-3 mr-1" /> Active
                  </Badge>
                )}
              </div>

              {/* System Default Mode Card */}
              <div
                onClick={() => {
                  setTheme("system");
                  toast.success("Theme set to System Default");
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2.5 ${
                  theme === "system"
                    ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                    : "border-border/60 bg-muted/20 hover:border-border hover:bg-muted/40"
                }`}
              >
                <div className="size-11 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20 shadow-2xs">
                  <Monitor className="size-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">System Default</span>
                  <span className="text-[10px] text-muted-foreground">Automatically match your operating system</span>
                </div>
                {theme === "system" && (
                  <Badge variant="outline" className="text-[10px] text-primary border-primary/30 mt-1 bg-primary/10">
                    <Check className="size-3 mr-1" /> Active
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-3">
            <div>
              <h4 className="text-sm font-bold text-foreground">Curriculum Standards &amp; Study Defaults</h4>
              <p className="text-xs text-muted-foreground">
                Official DepEd curriculum standards and study preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-xs font-bold text-foreground">Curriculum Framework</span>
                <p className="text-[11px] text-muted-foreground">
                  DepEd K-12 MATATAG Standards with 75% Transmutation Scale.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-xs font-bold text-foreground">Grade Transmutation Formula</span>
                <p className="text-[11px] text-muted-foreground">
                  DepEd Order No. 015, s. 2026 Standard (Active).
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STUDENT PROFILE TAB */
        <form onSubmit={handleSaveSettings} className="space-y-4">
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
        </form>
      )}
    </div>
  );
}

