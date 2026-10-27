"use client";

import * as React from "react";
import { Send, Bot, Loader2, Lightbulb, HelpCircle, Sparkles } from "lucide-react";
import type { QuizQuestion, TutorMessage } from "../types/curriculum.types";
import { askTutorAction, getAiCreditsStatusAction } from "../actions/curriculum.actions";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { MarkdownRenderer } from "@/shared/components/ui/MarkdownRenderer";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";

interface AITutorDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subjectName: string;
  subjectSlug: string;
  lessonTitle: string;
  currentQuestion: QuizQuestion;
  language: string;
  persona?: "socratic" | "detailed" | "exam-prep";
  questionIndex?: number;
  totalQuestions?: number;
  userSelectedAnswer?: string;
}

export function AITutorDrawer({
  isOpen,
  onOpenChange,
  subjectName,
  subjectSlug,
  lessonTitle,
  currentQuestion,
  language,
  persona = "socratic",
  questionIndex,
  totalQuestions,
  userSelectedAnswer,
}: AITutorDrawerProps) {
  const [customPersona, setCustomPersona] = React.useState<"socratic" | "detailed" | "exam-prep" | null>(null);
  const [customLanguage, setCustomLanguage] = React.useState<string | null>(null);

  const activePersona = customPersona ?? persona;
  const activeLanguage = customLanguage ?? language;

  const [conversation, setConversation] = React.useState<TutorMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [creditsRemaining, setCreditsRemaining] = React.useState<number | null>(null);
  const [isUnlimited, setIsUnlimited] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const questionNumber = questionIndex !== undefined ? questionIndex + 1 : 1;

  // Reset conversation when switching to a different question (React 19 pattern)
  const [prevQuestion, setPrevQuestion] = React.useState(currentQuestion.question);
  if (prevQuestion !== currentQuestion.question) {
    setPrevQuestion(currentQuestion.question);
    setConversation([]);
  }

  const personaLabels: Record<"socratic" | "detailed" | "exam-prep", string> = {
    socratic: "Socratic Guide",
    detailed: "Comprehensive",
    "exam-prep": "Exam Reviewer",
  };

  // Fetch initial AI credit balance on drawer open
  React.useEffect(() => {
    if (isOpen) {
      getAiCreditsStatusAction().then((res) => {
        if (res.success) {
          setCreditsRemaining(res.remaining);
          setIsUnlimited(res.isUnlimited);
        }
      });
    }
  }, [isOpen]);

  // Compute greeting dynamically based on active persona and language
  const isTaglishOrFilipino =
    activeLanguage.toLowerCase().includes("taglish") ||
    activeLanguage.toLowerCase().includes("filipino");

  const greeting = React.useMemo(() => {
    if (activePersona === "detailed") {
      return isTaglishOrFilipino
        ? `Kumusta! Ako ang iyong AI Comprehensive Tutor para sa **Tanong #${questionNumber}** (${lessonTitle}). Handa akong magbigay ng detalyadong step-by-step breakdown sa formula at solusyon ng partikular na tanong na ito!`
        : `Hello! I am your AI Comprehensive Tutor for **Question #${questionNumber}** (${lessonTitle}). I'm here to provide a full step-by-step breakdown of the formula and concept behind this specific question.`;
    }
    if (activePersona === "exam-prep") {
      return isTaglishOrFilipino
        ? `Kumusta! Ako ang iyong AI Exam Reviewer para sa **Tanong #${questionNumber}**. Pag-aralan natin ang elimination tactics at exam pointers para sa problemang ito!`
        : `Hello! I am your AI Exam Reviewer for **Question #${questionNumber}**. Let's examine option elimination tactics and periodic test pointers for this specific problem.`;
    }
    return isTaglishOrFilipino
      ? `Kumusta! Ako ang iyong AI Socratic Tutor para sa **Tanong #${questionNumber}**. Paano kita matutulungang masuri ang tanong na ito nang hindi agad ibinibigay ang sagot? Ano ang unang napapansin mo sa ibinigay na sitwasyon o equation?`
      : `Hello! I am your AI Socratic Tutor for **Question #${questionNumber}**. How can I guide you through analyzing this problem without revealing the answer? What is your initial thought on the given conditions?`;
  }, [activePersona, isTaglishOrFilipino, questionNumber, lessonTitle]);

  const allMessages: TutorMessage[] = React.useMemo(
    () => [{ role: "assistant", content: greeting }, ...conversation],
    [greeting, conversation]
  );

  const scrollToBottom = React.useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // Auto-scroll to bottom of chat on new messages or loading state
  React.useEffect(() => {
    scrollToBottom();
  }, [allMessages, loading, scrollToBottom]);

  // Robust auto-scroll when drawer opens (handling Sheet slide-in transition)
  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      const raf = requestAnimationFrame(() => {
        scrollToBottom();
      });
      const timer1 = setTimeout(() => {
        scrollToBottom();
      }, 100);
      const timer2 = setTimeout(() => {
        scrollToBottom();
      }, 300);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen, scrollToBottom]);

  const handlePersonaChange = (newPersona: "socratic" | "detailed" | "exam-prep") => {
    if (newPersona === activePersona) return;
    setCustomPersona(newPersona);
    setConversation((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `*Mode switched to ${personaLabels[newPersona]}.*`,
      },
    ]);
  };

  const handleLanguageChange = (newLang: string) => {
    if (newLang === activeLanguage) return;
    setCustomLanguage(newLang);
    setConversation((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `*Language switched to ${newLang}. Future replies will be in ${newLang}.*`,
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const userMessage: TutorMessage = { role: "user", content: messageText };
    setConversation((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setLoading(true);

    const historyForAi = [...allMessages, userMessage];

    const res = await askTutorAction({
      subjectSlug,
      lessonTitle,
      question: currentQuestion.question,
      options: currentQuestion.options,
      answer: currentQuestion.answer,
      explanation: currentQuestion.explanation,
      language: activeLanguage,
      persona: activePersona,
      history: historyForAi,
      message: messageText,
      questionIndex,
      totalQuestions,
      userSelectedAnswer,
    });

    if (res.creditsRemaining !== undefined) {
      setCreditsRemaining(res.creditsRemaining);
    }
    if (res.isUnlimited !== undefined) {
      setIsUnlimited(res.isUnlimited);
    }

    if (res.success && res.reply) {
      setConversation((prev) => [...prev, { role: "assistant", content: res.reply! }]);
    } else {
      if (res.error === "TRIAL_EXPIRED") {
        onOpenChange(false);
        useUpgradeModalStore.getState().openUpgradeModal({
          featureName: "AI Tutor",
          reason: "Your 30-day free trial has expired. Upgrade to an Annual or Monthly Pass to continue using the Socratic AI Tutor.",
        });
        setLoading(false);
        return;
      }
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.error || "Sorry, I had trouble answering that. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex h-full flex-col p-0 sm:max-w-md md:max-w-lg">
        {/* Header */}
        <SheetHeader className="border-b border-border/60 p-4 bg-muted/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                <Bot className="size-4" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-base font-bold flex items-center gap-1.5">
                  <span className="truncate">Gemini {personaLabels[activePersona]}</span>
                  <Badge variant="success" className="text-[10px] py-0 px-1.5 shrink-0">Live</Badge>
                </SheetTitle>
                <SheetDescription className="text-xs truncate flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] font-semibold text-primary border-primary/30">
                    Anchored to Q#{questionNumber}{totalQuestions ? ` of ${totalQuestions}` : ""}
                  </Badge>
                  <span className="truncate">{subjectName} • {lessonTitle}</span>
                </SheetDescription>
              </div>
            </div>

            {/* AI Credits Badge */}
            {creditsRemaining !== null && (
              <Badge
                variant="outline"
                className="shrink-0 text-[11px] font-semibold flex items-center gap-1.5 bg-background border-border/80 text-foreground"
              >
                <Sparkles className="size-3 text-amber-500" />
                <span>{isUnlimited ? "Unlimited" : `${creditsRemaining} left`}</span>
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* Mode & Language Control Bar */}
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border/40 bg-muted/10 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Mode:</span>
            <select
              aria-label="Tutor Mode"
              value={activePersona}
              onChange={(e) => handlePersonaChange(e.target.value as "socratic" | "detailed" | "exam-prep")}
              className="bg-background border border-border/70 rounded-md px-2 py-0.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="socratic">Socratic Guide</option>
              <option value="detailed">Comprehensive</option>
              <option value="exam-prep">Exam Reviewer</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-muted-foreground">Lang:</span>
            <select
              aria-label="Tutor Language"
              value={activeLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-background border border-border/70 rounded-md px-2 py-0.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Taglish">Taglish</option>
              <option value="Filipino">Filipino</option>
              <option value="Cebuano">Cebuano</option>
              <option value="Ilocano">Ilocano</option>
              <option value="Hiligaynon">Hiligaynon</option>
              <option value="Bikol">Bikol</option>
              <option value="Waray">Waray</option>
            </select>
          </div>
        </div>

        {/* Anchored Question Context Banner */}
        <div className="bg-muted/30 border-b border-border/50 px-4 py-2.5 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-foreground text-[11px] flex items-center gap-1">
              <HelpCircle className="size-3 text-primary" />
              Question #{questionNumber} Context
            </span>
            {userSelectedAnswer && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                Selected: Option {userSelectedAnswer}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground line-clamp-2 text-[11px] italic font-serif">
            &ldquo;{currentQuestion.question}&rdquo;
          </p>
        </div>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {allMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-sm ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mt-0.5">
                  <Bot className="size-3.5" />
                </div>
              )}
              <div
                className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground font-medium"
                    : "bg-muted/60 text-foreground border border-border/40"
                }`}
              >
                {msg.role === "assistant" ? (
                  <MarkdownRenderer content={msg.content} />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 text-sm items-center text-muted-foreground">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Bot className="size-3.5" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2 bg-muted/40 border border-border/30 text-xs">
                <Loader2 className="size-3 animate-spin text-primary" />
                <span>Analyzing Question #{questionNumber}...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-3 py-2 border-t border-border/40 bg-muted/10">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(`Can you give me a subtle hint to solve Question #${questionNumber}?`)}
              disabled={loading || (creditsRemaining === 0 && !isUnlimited)}
              className="h-7 text-[11px] px-2.5 gap-1 shrink-0"
            >
              <Lightbulb className="size-3 text-amber-500" />
              <span>Hint for Q#{questionNumber}</span>
            </Button>

            {userSelectedAnswer && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickPrompt(`Why might someone pick Option ${userSelectedAnswer}, and what is the misconception?`)}
                disabled={loading || (creditsRemaining === 0 && !isUnlimited)}
                className="h-7 text-[11px] px-2.5 gap-1 shrink-0"
              >
                <HelpCircle className="size-3 text-rose-500" />
                <span>Analyze Option {userSelectedAnswer}</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt("What formula or concept applies to this specific question?")}
              disabled={loading || (creditsRemaining === 0 && !isUnlimited)}
              className="h-7 text-[11px] px-2.5 gap-1 shrink-0"
            >
              <span>📐 Concept/Formula</span>
            </Button>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border/60 p-3 bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <Textarea
              placeholder={
                creditsRemaining === 0 && !isUnlimited
                  ? "Daily AI credits exhausted (20/20). Resets daily at midnight PHT!"
                  : `Ask your tutor anything about Question #${questionNumber}...`
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || (creditsRemaining === 0 && !isUnlimited)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
              className="min-h-[42px] max-h-28 resize-none text-xs"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim() || (creditsRemaining === 0 && !isUnlimited)}
              className="size-[42px] shrink-0"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
