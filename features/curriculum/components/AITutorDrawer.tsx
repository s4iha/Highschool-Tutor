"use client";

import * as React from "react";
import { Send, Bot, User, Loader2, Lightbulb, HelpCircle, Sparkles, AlertCircle } from "lucide-react";
import type { QuizQuestion, TutorMessage } from "../types/curriculum.types";
import { askTutorAction, getAiCreditsStatusAction } from "../actions/curriculum.actions";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { MarkdownRenderer } from "@/shared/components/ui/MarkdownRenderer";

interface AITutorDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subjectName: string;
  subjectSlug: string;
  lessonTitle: string;
  currentQuestion: QuizQuestion;
  language: string;
  persona?: "socratic" | "detailed" | "exam-prep";
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
        ? `Kumusta! Ako ang iyong AI Comprehensive Tutor para sa **${subjectName}**. Handa akong magbigay ng detalyadong step-by-step na paliwanag para sa **${lessonTitle}**!`
        : `Hello! I am your AI Comprehensive Tutor for **${subjectName}**. I'm here to provide full step-by-step explanations and breakdowns for **${lessonTitle}**.`;
    }
    if (activePersona === "exam-prep") {
      return isTaglishOrFilipino
        ? `Kumusta! Ako ang iyong AI Exam Reviewer para sa **${subjectName}**. Narito ako upang magbahagi ng mga periodic test strategies, option elimination tips, at exam pointers para sa **${lessonTitle}**!`
        : `Hello! I am your AI Exam Reviewer for **${subjectName}**. I'm ready to share test-taking tactics, option elimination tips, and periodic exam pointers for **${lessonTitle}**.`;
    }
    return isTaglishOrFilipino
      ? `Kumusta! Ako ang iyong AI Socratic Tutor para sa **${subjectName}**. Paano kita matutulungan sa pagsusuri ng tanong na ito gamit ang gabay at pahiwatig tungkol sa **${lessonTitle}**?`
      : `Hello! I am your AI Socratic Tutor for **${subjectName}**. How can I help you understand this question about **${lessonTitle}**?`;
  }, [activePersona, isTaglishOrFilipino, subjectName, lessonTitle]);

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
                <SheetDescription className="text-xs truncate">
                  {subjectName} • {lessonTitle}
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
            <button
              type="button"
              onClick={() => handleLanguageChange("Taglish")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                activeLanguage.toLowerCase().includes("taglish")
                  ? "bg-indigo-600 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              🇵🇭 Taglish
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange("English")}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                !activeLanguage.toLowerCase().includes("taglish")
                  ? "bg-indigo-600 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* Conversation Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Question Preview */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs space-y-1.5">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase text-[10px] tracking-wider">
              Active Question Context
            </span>
            <MarkdownRenderer
              content={currentQuestion.question}
              className="text-foreground font-medium text-xs line-clamp-3"
            />
          </div>

          {/* Messages */}
          {allMessages.map((msg, idx) => {
            const isBot = msg.role === "assistant";
            return (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${
                  isBot ? "items-start" : "items-start flex-row-reverse"
                }`}
              >
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                    isBot
                      ? "bg-indigo-600 text-white"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {isBot ? <Bot className="size-3.5" /> : <User className="size-3.5" />}
                </div>

                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[85%] leading-relaxed ${
                    isBot
                      ? "bg-muted/70 text-foreground border border-border/40"
                      : "bg-indigo-600 text-white font-medium whitespace-pre-wrap"
                  }`}
                >
                  {isBot ? (
                    <MarkdownRenderer content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            );
          })}

          {creditsRemaining === 0 && !isUnlimited && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs flex items-start gap-2.5 text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Daily Free AI Credits Exhausted</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  You have used all 20 free credits for today. Resets daily at midnight PHT! Upgrade for unlimited AI tutoring.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pl-10">
              <Loader2 className="size-3.5 animate-spin text-indigo-500" />
              <span>{personaLabels[activePersona]} is thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="border-t border-border/40 bg-muted/10 p-3">
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt("Can you give me a hint without telling me the exact answer?")}
              disabled={loading || (creditsRemaining === 0 && !isUnlimited)}
              className="h-7 text-[11px] px-2.5 gap-1"
            >
              <Lightbulb className="size-3 text-amber-500" />
              <span>Give me a hint</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt("Can you explain this in Taglish?")}
              disabled={loading || (creditsRemaining === 0 && !isUnlimited)}
              className="h-7 text-[11px] px-2.5 gap-1"
            >
              <span>🇵🇭 Explain in Taglish</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt("Why are the other options incorrect?")}
              disabled={loading || (creditsRemaining === 0 && !isUnlimited)}
              className="h-7 text-[11px] px-2.5 gap-1"
            >
              <HelpCircle className="size-3 text-indigo-500" />
              <span>Break down options</span>
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
                  : "Ask your tutor anything about this question..."
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
