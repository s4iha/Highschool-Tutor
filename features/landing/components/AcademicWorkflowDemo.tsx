"use client";

import React, { useState } from "react";
import {
  Bot,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Check,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

interface DemoQuestion {
  id: number;
  question: string;
  options: { key: string; text: string }[];
  correct: string;
  explanation: {
    socraticHint: string;
    taglishExplanation: string;
    takeaway: string;
  };
}

interface DemoStudent {
  name: string;
  lrn: string;
  gradeLevel: string;
  subject: string;
  quizzesDone: string;
  averageScore: string;
  status: string;
  lastActive: string;
}

interface DemoSubjectData {
  questions: DemoQuestion[];
  classAverage: string;
  gradebook: DemoStudent[];
  diagnosticInsight: {
    topicRecap: string;
    description: string;
  };
}

const DEMO_SUBJECT_DATA: Record<string, DemoSubjectData> = {
  "General Mathematics": {
    classAverage: "89.2% (DepEd Outstanding)",
    questions: [
      {
        id: 1,
        question: "Which of the following functions represents a rational function according to DepEd General Mathematics standards?",
        options: [
          { key: "A", text: "f(x) = (2x + 1) / (x - 3), where x ≠ 3" },
          { key: "B", text: "f(x) = √(x + 4) / 2" },
          { key: "C", text: "f(x) = 2^x + 5" },
          { key: "D", text: "f(x) = log(x - 2)" },
        ],
        correct: "A",
        explanation: {
          socraticHint: "A rational function is defined as f(x) = p(x)/q(x) where both p(x) and q(x) are polynomials and q(x) ≠ 0.",
          taglishExplanation: "Ang rational function ay quotient ng dalawang polynomial expressions. Sa Option A, ang 2x + 1 at x - 3 ay parehong polynomials. Ang Option B naman ay radical function dahil may square root.",
          takeaway: "Tandaan: Ang exponent ng variable sa polynomial ay dapat non-negative integers lamang.",
        },
      },
      {
        id: 2,
        question: "Solve for x in the rational equation: (x + 2) / (x - 1) = 2",
        options: [
          { key: "A", text: "x = 3" },
          { key: "B", text: "x = 4" },
          { key: "C", text: "x = 2" },
          { key: "D", text: "x = -4" },
        ],
        correct: "B",
        explanation: {
          socraticHint: "Cross-multiply: (x + 2) = 2(x - 1) and simplify.",
          taglishExplanation: "Multiply both sides by (x - 1): x + 2 = 2x - 2. Ilipat ang x sa kanan at -2 sa kaliwa: 2 + 2 = 2x - x, kaya x = 4. Check domain: 4 - 1 = 3 ≠ 0, kaya valid root!",
          takeaway: "Laging i-check ang extraneous roots sa rational equations.",
        },
      },
    ],
    gradebook: [
      {
        name: "Juan Dela Cruz",
        lrn: "109283746501",
        gradeLevel: "Grade 11 - STEM A",
        subject: "General Mathematics",
        quizzesDone: "22 / 24",
        averageScore: "94.5%",
        status: "PASSED (Outstanding)",
        lastActive: "15 mins ago",
      },
      {
        name: "Maria Santos",
        lrn: "109283746502",
        gradeLevel: "Grade 11 - STEM A",
        subject: "General Mathematics",
        quizzesDone: "20 / 24",
        averageScore: "89.0%",
        status: "PASSED (Very Satisfactory)",
        lastActive: "1 hour ago",
      },
      {
        name: "Angelo Reyes",
        lrn: "109283746503",
        gradeLevel: "Grade 11 - STEM A",
        subject: "General Mathematics",
        quizzesDone: "18 / 24",
        averageScore: "76.5%",
        status: "NEEDS REVIEW (Fairly Satisfactory)",
        lastActive: "Yesterday",
      },
    ],
    diagnosticInsight: {
      topicRecap: "Rational Inequalities (Lesson 4) and Inverse Functions (Lesson 8)",
      description: "Across 24 quizzes in General Mathematics, 38% of Grade 11 students requested Socratic explanations on Rational Inequalities (Lesson 4) and Inverse Functions (Lesson 8). Recommending a focused recap before the 1st Periodic Examination.",
    },
  },
  "Earth and Life Science": {
    classAverage: "90.8% (DepEd Outstanding)",
    questions: [
      {
        id: 1,
        question: "According to the Law of Superposition in historical geology, what can be inferred about undisturbed sedimentary rock strata?",
        options: [
          { key: "A", text: "The youngest rock layer is located at the top, while the oldest is at the bottom." },
          { key: "B", text: "The oldest rock layer is always found at the top due to tectonic uplift." },
          { key: "C", text: "Rock layers have identical ages regardless of depth." },
          { key: "D", text: "Igneous intrusions are always older than the sedimentary rocks they cut through." },
        ],
        correct: "A",
        explanation: {
          socraticHint: "Think about how sediments settle over time: newer layers are continuously deposited on top of previously settled layers.",
          taglishExplanation: "Sa Law of Superposition ni Nicolas Steno, dahil natural na nagpapatong-patong ang sediments mula sa ilalim pataas, ang pinakailalim ang pinakamatanda (oldest) at ang pinakataas ang pinakabata (youngest) hangga't walang tectonic folding.",
          takeaway: "Prinsipyo ng Relative Dating: Bottom layer = oldest, top layer = youngest (undisturbed).",
        },
      },
      {
        id: 2,
        question: "During cellular respiration in living cells, which organelle is responsible for generating the majority of ATP through the electron transport chain?",
        options: [
          { key: "A", text: "Ribosome" },
          { key: "B", text: "Mitochondria" },
          { key: "C", text: "Endoplasmic Reticulum" },
          { key: "D", text: "Golgi Apparatus" },
        ],
        correct: "B",
        explanation: {
          socraticHint: "Known as the 'powerhouse of the cell,' this double-membraned organelle carries out oxidative phosphorylation.",
          taglishExplanation: "Ang Mitochondria ang tinaguriang 'powerhouse ng cell.' Dito nagaganap ang Krebs cycle at Oxidative Phosphorylation sa cristae, kung saan nagagawa ang halos 32-34 ATP per glucose molecule!",
          takeaway: "Mitochondria = site of aerobic respiration and cellular ATP production.",
        },
      },
    ],
    gradebook: [
      {
        name: "Bea Alcantara",
        lrn: "109283746504",
        gradeLevel: "Grade 11 - HUMSS B",
        subject: "Earth and Life Science",
        quizzesDone: "23 / 24",
        averageScore: "96.0%",
        status: "PASSED (Outstanding)",
        lastActive: "10 mins ago",
      },
      {
        name: "Joshua Dizon",
        lrn: "109283746505",
        gradeLevel: "Grade 11 - HUMSS B",
        subject: "Earth and Life Science",
        quizzesDone: "21 / 24",
        averageScore: "88.5%",
        status: "PASSED (Very Satisfactory)",
        lastActive: "2 hours ago",
      },
      {
        name: "Alyssa Mendoza",
        lrn: "109283746506",
        gradeLevel: "Grade 11 - HUMSS B",
        subject: "Earth and Life Science",
        quizzesDone: "17 / 24",
        averageScore: "74.0%",
        status: "NEEDS REVIEW (Did Not Meet Expectations)",
        lastActive: "Yesterday",
      },
    ],
    diagnosticInsight: {
      topicRecap: "Relative vs. Absolute Geologic Dating (Lesson 3) and Calvin Cycle Stages (Lesson 7)",
      description: "Across 24 quizzes in Earth and Life Science, 41% of Grade 11 students flagged difficulty distinguishing between Relative vs. Absolute Geologic Dating (Lesson 3) and Calvin Cycle Stages (Lesson 7). Recommended targeted drill session scheduled.",
    },
  },
  "Pre-Calculus": {
    classAverage: "88.5% (DepEd Very Satisfactory)",
    questions: [
      {
        id: 1,
        question: "What is the standard equation of a parabola opening upward with its vertex at the origin (0, 0) and focal distance p > 0?",
        options: [
          { key: "A", text: "x² = 4py" },
          { key: "B", text: "y² = 4px" },
          { key: "C", text: "x² = -4py" },
          { key: "D", text: "x² + y² = p²" },
        ],
        correct: "A",
        explanation: {
          socraticHint: "Recall the geometric definition of a parabola: when opening vertically upward along the y-axis, the squared term is x.",
          taglishExplanation: "Kapag ang parabola ay patayo at bumubukas paitaas (opening upward) na ang vertex ay nasa origin, ang equation ay x² = 4py kung saan p > 0. Kung y² = 4px naman, ito ay bumubukas sa kanan.",
          takeaway: "Vertical axis of symmetry: x² = 4py (upward kung p > 0, downward kung p < 0).",
        },
      },
      {
        id: 2,
        question: "Evaluate the exact value of sin(π/6) + cos(π/3) according to circular functions on the unit circle.",
        options: [
          { key: "A", text: "1/2" },
          { key: "B", text: "1" },
          { key: "C", text: "√3 / 2" },
          { key: "D", text: "√2" },
        ],
        correct: "B",
        explanation: {
          socraticHint: "Recall the special angles in radians: π/6 = 30° and π/3 = 60°.",
          taglishExplanation: "Ang π/6 radians ay katumbas ng 30°, kaya sin(30°) = 1/2. Ang π/3 radians naman ay 60°, kaya cos(60°) = 1/2. Kapag pinag-add: 1/2 + 1/2 = 1. Sakto at malinis!",
          takeaway: "Co-function identity: sin(θ) = cos(90° - θ), kaya sin(30°) = cos(60°) = 1/2.",
        },
      },
    ],
    gradebook: [
      {
        name: "Gabriel Tan",
        lrn: "109283746507",
        gradeLevel: "Grade 11 - STEM 1",
        subject: "Pre-Calculus",
        quizzesDone: "24 / 24",
        averageScore: "98.0%",
        status: "PASSED (Outstanding)",
        lastActive: "5 mins ago",
      },
      {
        name: "Chloe Lim",
        lrn: "109283746508",
        gradeLevel: "Grade 11 - STEM 1",
        subject: "Pre-Calculus",
        quizzesDone: "21 / 24",
        averageScore: "91.5%",
        status: "PASSED (Outstanding)",
        lastActive: "40 mins ago",
      },
      {
        name: "Kenneth Soriano",
        lrn: "109283746509",
        gradeLevel: "Grade 11 - STEM 1",
        subject: "Pre-Calculus",
        quizzesDone: "16 / 24",
        averageScore: "73.5%",
        status: "NEEDS REVIEW (Did Not Meet Expectations)",
        lastActive: "Yesterday",
      },
    ],
    diagnosticInsight: {
      topicRecap: "Hyperbola Asymptote Equations (Lesson 5) and Sum-to-Product Trigonometric Identities (Lesson 8)",
      description: "Across 24 quizzes in Pre-Calculus, STEM educators observed high error rates in Hyperbola Asymptote Equations (Lesson 5) and Sum-to-Product Trigonometric Identities (Lesson 8). 32 students received automated targeted practice sessions.",
    },
  },
  "Grade 10 Science": {
    classAverage: "88.8% (DepEd Very Satisfactory)",
    questions: [
      {
        id: 1,
        question: "What geologic feature or event is typically produced at a convergent plate boundary where two oceanic plates collide?",
        options: [
          { key: "A", text: "Island arc and deep ocean trench (subduction zone)" },
          { key: "B", text: "Mid-ocean ridge and rift valley" },
          { key: "C", text: "Transform fault line like the San Andreas Fault" },
          { key: "D", text: "Continental mountain range without volcanism" },
        ],
        correct: "A",
        explanation: {
          socraticHint: "When denser oceanic crust subducts under another oceanic plate, magma rises through the seafloor over time.",
          taglishExplanation: "Sa oceanic-oceanic convergence, ang mas matandang dense plate ay lulubog (subduct) sa trench. Ang natutunaw na magma ay aangat upang bumuo ng volcanic island arc, katulad ng kapuluan ng Pilipinas!",
          takeaway: "Oceanic-Oceanic Convergence = Deep-Sea Trench + Volcanic Island Arc (e.g., Philippine Mobile Belt).",
        },
      },
      {
        id: 2,
        question: "Which of the following electromagnetic waves has the shortest wavelength and highest frequency in the electromagnetic spectrum?",
        options: [
          { key: "A", text: "Radio waves" },
          { key: "B", text: "Visible light" },
          { key: "C", text: "Ultraviolet rays" },
          { key: "D", text: "Gamma rays" },
        ],
        correct: "D",
        explanation: {
          socraticHint: "Energy is directly proportional to frequency and inversely proportional to wavelength (E = hf = hc/λ).",
          taglishExplanation: "Sa EM Spectrum, habang umiikli ang wavelength, tumataas ang frequency at energy. Ang Gamma rays ang may pinakamaikling wavelength (< 10 picometers) at pinakamataas na frequency, kaya ito ang pinaka-penetrating ionizing radiation.",
          takeaway: "EM Spectrum Order (Lowest to Highest Frequency): Radio < Microwave < Infrared < Visible < UV < X-ray < Gamma.",
        },
      },
    ],
    gradebook: [
      {
        name: "Patricia Bautista",
        lrn: "109283746510",
        gradeLevel: "Grade 10 - Aguinaldo",
        subject: "Grade 10 Science",
        quizzesDone: "23 / 24",
        averageScore: "95.5%",
        status: "PASSED (Outstanding)",
        lastActive: "12 mins ago",
      },
      {
        name: "Samantha Cruz",
        lrn: "109283746511",
        gradeLevel: "Grade 10 - Aguinaldo",
        subject: "Grade 10 Science",
        quizzesDone: "19 / 24",
        averageScore: "86.0%",
        status: "PASSED (Very Satisfactory)",
        lastActive: "3 hours ago",
      },
      {
        name: "John Paul Ramos",
        lrn: "109283746512",
        gradeLevel: "Grade 10 - Aguinaldo",
        subject: "Grade 10 Science",
        quizzesDone: "15 / 24",
        averageScore: "75.0%",
        status: "PASSED (Fairly Satisfactory)",
        lastActive: "Yesterday",
      },
    ],
    diagnosticInsight: {
      topicRecap: "Divergent vs. Transform Plate Motion (Lesson 2) and Ray Diagrams in Concave Mirrors (Lesson 6)",
      description: "Across 24 quizzes in Grade 10 Science, 35% of learners needed additional Socratic breakdown on Divergent vs. Transform Plate Motion (Lesson 2) and Ray Diagrams in Concave Mirrors (Lesson 6). DO 015 automated remediation modules deployed.",
    },
  },
};

export function AcademicWorkflowDemo() {
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<"student" | "admin">("student");
  const [selectedSubject, setSelectedSubject] = useState("General Mathematics");
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeAiExplanation, setActiveAiExplanation] = useState<number | null>(null);

  // Active Subject Content
  const activeSubjectData = DEMO_SUBJECT_DATA[selectedSubject] ?? DEMO_SUBJECT_DATA["General Mathematics"];

  // High School Subjects for Demo
  const demoSubjects = [
    { name: "General Mathematics", grade: "Grade 11 • Core", lessons: 8, quizzes: 24 },
    { name: "Earth and Life Science", grade: "Grade 11 • Core", lessons: 8, quizzes: 24 },
    { name: "Pre-Calculus", grade: "Grade 11 • STEM", lessons: 8, quizzes: 24 },
    { name: "Grade 10 Science", grade: "Grade 10 • Junior High", lessons: 8, quizzes: 24 },
  ];

  const handleSelectAnswer = (questionId: number, optionKey: string) => {
    if (!quizSubmitted) {
      setSelectedQuizAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
    }
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    setActiveAiExplanation(activeSubjectData.questions[0]?.id ?? 1);
  };

  return (
    <section id="demo" className="py-16 lg:py-24 bg-card/60 relative border-y border-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-8 bg-primary/40" />
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
            <span>INTERACTIVE LEARNING PIPELINE</span>
          </div>
          <div className="h-px w-8 bg-primary/40" />
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Experience the HighSchool Tutor Workflow
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base font-normal">
            Test our interactive quiz engine with instant Gemini AI Socratic reasoning, or inspect the DepEd DO 015 s. 2026 gradebook analytics.
          </p>
        </div>

        {/* Outer Demo Window */}
        <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
          {/* Top Window Toolbar */}
          <div className="bg-muted/80 px-4 sm:px-6 py-3.5 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-destructive/70 inline-block" />
              <span className="w-3 h-3 rounded-full bg-warning/70 inline-block" />
              <span className="w-3 h-3 rounded-full bg-success/70 inline-block" />
              <span className="text-xs font-bold text-muted-foreground ml-2">
                HighSchool Tutor • Live Demo Environment
              </span>
            </div>

            {/* Workflow Mode Tabs */}
            <div className="flex items-center bg-card p-1 rounded-xl border border-border shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveWorkflowTab("student")}
                className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeWorkflowTab === "student"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Student Study &amp; AI Quiz
              </button>
              <button
                type="button"
                onClick={() => setActiveWorkflowTab("admin")}
                className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeWorkflowTab === "admin"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Teacher &amp; DepEd Gradebook
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            {activeWorkflowTab === "student" ? (
              <div className="space-y-6">
                {/* Subject Selector Pills */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-bold text-muted-foreground mr-2">
                    Active Subject:
                  </span>
                  {demoSubjects.map((sub) => (
                    <button
                      key={sub.name}
                      type="button"
                      onClick={() => {
                        setSelectedSubject(sub.name);
                        setQuizSubmitted(false);
                        setSelectedQuizAnswers({});
                        setActiveAiExplanation(null);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedSubject === sub.name
                          ? "bg-primary/15 border-primary/40 text-primary shadow-xs"
                          : "bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {sub.name} ({sub.grade})
                    </button>
                  ))}
                </div>

                {/* Question List */}
                <div className="space-y-5">
                  {activeSubjectData.questions.map((q, qIndex) => {
                    const selected = selectedQuizAnswers[q.id];
                    const isCorrect = selected === q.correct;
                    const isExplaining = activeAiExplanation === q.id;

                    return (
                      <div
                        key={q.id}
                        className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-4"
                      >
                        {/* Question Title */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                              Assessment Question {qIndex + 1} of {activeSubjectData.questions.length}
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-foreground">
                              {q.question}
                            </h4>
                          </div>

                          {/* Instant AI Explanation Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setActiveAiExplanation(isExplaining ? null : q.id)
                            }
                            className="text-xs font-bold gap-1.5 rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                          >
                            <Bot className="w-3.5 h-3.5" />
                            <span>{isExplaining ? "Hide AI Reasoning" : "Ask AI Tutor"}</span>
                          </Button>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt) => {
                            const isOptSelected = selected === opt.key;
                            let btnStyle = "bg-muted/40 border-border text-foreground hover:bg-muted";

                            if (quizSubmitted) {
                              if (opt.key === q.correct) {
                                btnStyle = "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold";
                              } else if (isOptSelected && !isCorrect) {
                                btnStyle = "bg-destructive/15 border-destructive/40 text-destructive font-bold";
                              }
                            } else if (isOptSelected) {
                              btnStyle = "bg-primary/15 border-primary/40 text-primary font-bold shadow-xs";
                            }

                            return (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() => handleSelectAnswer(q.id, opt.key)}
                                className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-lg bg-card border border-border flex items-center justify-center font-bold text-xs shrink-0">
                                    {opt.key}
                                  </span>
                                  <span>{opt.text}</span>
                                </div>
                                {quizSubmitted && opt.key === q.correct && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}
                                {quizSubmitted && isOptSelected && !isCorrect && (
                                  <XCircle className="w-4 h-4 text-destructive shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* AI Socratic Explanation Drawer */}
                        {isExplaining && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-primary/5 border border-primary/20 space-y-2.5 text-xs animate-in fade-in duration-200">
                            <div className="flex items-center gap-2 text-primary font-bold">
                              <Bot className="w-4 h-4" />
                              <span>Google Gemini Socratic Explanation (Taglish &amp; English):</span>
                            </div>
                            <div className="text-card-foreground leading-relaxed">
                              <strong>💡 Socratic Hint:</strong> {q.explanation.socraticHint}
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 leading-relaxed">
                              <strong>🇵🇭 Taglish Breakdown:</strong> {q.explanation.taglishExplanation}
                            </div>
                            <div className="text-muted-foreground pt-1">
                              <strong>📌 Key Takeaway:</strong> {q.explanation.takeaway}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit / Reset Actions */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedQuizAnswers({});
                      setActiveAiExplanation(null);
                    }}
                    className="rounded-xl gap-1.5 text-xs font-bold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Quiz</span>
                  </Button>

                  {!quizSubmitted ? (
                    <Button
                      onClick={handleSubmitQuiz}
                      className="rounded-xl px-6 font-bold text-xs gap-2 shadow-lg shadow-primary/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Submit &amp; Transmute Score</span>
                    </Button>
                  ) : (
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                      ✓ Quiz Saved &amp; Transmuted via DepEd DO 015 s. 2026 Pipeline
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Teacher / Admin Gradebook View */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-foreground">
                      Teacher &amp; School Head Performance Dashboard
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Monitor student mastery across <strong>{selectedSubject}</strong>, inspect individual quiz progress, and export quarterly transmutation sheets.
                    </p>
                  </div>
                  <Badge variant="secondary" className="px-3.5 py-1.5 font-bold text-xs bg-primary/10 text-primary">
                    Class Average: {activeSubjectData.classAverage}
                  </Badge>
                </div>

                {/* Gradebook Table */}
                <div className="overflow-x-auto rounded-2xl border border-border shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted text-muted-foreground font-bold uppercase tracking-wider text-[11px] border-b border-border">
                      <tr>
                        <th className="p-4">Student Name</th>
                        <th className="p-4">DepEd LRN</th>
                        <th className="p-4">Grade &amp; Section</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Quizzes Completed</th>
                        <th className="p-4">DepEd DO 015 Score</th>
                        <th className="p-4">Mastery Status</th>
                        <th className="p-4">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card font-medium text-card-foreground">
                      {activeSubjectData.gradebook.map((st, sIdx) => (
                        <tr key={sIdx} className="hover:bg-muted/40 transition-colors">
                          <td className="p-4 font-bold text-foreground">{st.name}</td>
                          <td className="p-4 text-muted-foreground font-mono">{st.lrn}</td>
                          <td className="p-4">{st.gradeLevel}</td>
                          <td className="p-4">{st.subject}</td>
                          <td className="p-4 font-bold text-foreground">{st.quizzesDone}</td>
                          <td className="p-4">
                            <span className="text-sm font-black text-primary">
                              {st.averageScore}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                st.status.includes("PASSED")
                                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                                  : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                              }`}
                            >
                              {st.status}
                            </span>
                          </td>
                          <td className="p-4 text-muted-foreground">{st.lastActive}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* AI Academic Diagnostic Callout */}
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
                  <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-950 dark:text-amber-100 mb-1">
                      AI Diagnostic Insight for High School Educators:
                    </h4>
                    <p className="leading-relaxed">
                      {activeSubjectData.diagnosticInsight.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
