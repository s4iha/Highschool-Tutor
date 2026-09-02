"use client";

import * as React from "react";
import { Send, Bot, User, Loader2, Lightbulb, HelpCircle } from "lucide-react";
import type { QuizQuestion, TutorMessage } from "../types/curriculum.types";
import { askTutorAction } from "../actions/curriculum.actions";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";

interface AITutorDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  subjectName: string;
  subjectSlug: string;
  lessonTitle: string;
  currentQuestion: QuizQuestion;
  language: string;
}

export function AITutorDrawer({
  isOpen,
  onOpenChange,
  subjectName,
  subjectSlug,
  lessonTitle,
  currentQuestion,
  language,
}: AITutorDrawerProps) {
  const [messages, setMessages] = React.useState<TutorMessage[]>([
    {
      role: "assistant",
      content: `Kumusta! I am your AI Socratic Tutor for **${subjectName}**. How can I help you understand this question about **${lessonTitle}**?`,
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const userMessage: TutorMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setLoading(true);

    const res = await askTutorAction({
      subjectSlug,
      lessonTitle,
      question: currentQuestion.question,
      options: currentQuestion.options,
      answer: currentQuestion.answer,
      explanation: currentQuestion.explanation,
      language,
      history: messages,
      message: messageText,
    });

    if (res.success && res.reply) {
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply! }]);
    } else {
      setMessages((prev) => [
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
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <Bot className="size-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-bold flex items-center gap-1.5">
                <span>Gemini Socratic Tutor</span>
                <Badge variant="success" className="text-[10px] py-0 px-1.5">Live</Badge>
              </SheetTitle>
              <SheetDescription className="text-xs">
                {subjectName} • {lessonTitle}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Conversation Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Question Preview */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs space-y-1.5">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase text-[10px] tracking-wider">
              Active Question Context
            </span>
            <p className="text-foreground font-medium line-clamp-3">
              {currentQuestion.question}
            </p>
          </div>

          {/* Messages */}
          {messages.map((msg, idx) => {
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
                  className={`rounded-2xl px-4 py-2.5 max-w-[82%] leading-relaxed whitespace-pre-wrap ${
                    isBot
                      ? "bg-muted/70 text-foreground border border-border/40"
                      : "bg-indigo-600 text-white font-medium"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pl-10">
              <Loader2 className="size-3.5 animate-spin text-indigo-500" />
              <span>Tutor is thinking...</span>
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
              disabled={loading}
              className="h-7 text-[11px] px-2.5 gap-1"
            >
              <Lightbulb className="size-3 text-amber-500" />
              <span>Give me a hint</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt("Can you explain this in Taglish?")}
              disabled={loading}
              className="h-7 text-[11px] px-2.5 gap-1"
            >
              <span>🇵🇭 Explain in Taglish</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt("Why are the other options incorrect?")}
              disabled={loading}
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
              placeholder="Ask your tutor anything about this question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
              disabled={loading || !input.trim()}
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
