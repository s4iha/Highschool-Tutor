"use client";

import * as React from "react";
import {
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useAiPromptsModalStore } from "@/shared/hooks/useAiPromptsModalStore";

interface SamplePrompt {
  id: string;
  name: string;
  template: string;
  category: string;
}

const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: "concept-simplifier",
    name: "Concept Simplifier",
    template: 'Explain [Topic] in simple terms as if I am a 14-year-old.',
    category: "Understanding",
  },
  {
    id: "step-by-step",
    name: "Step-by-Step Breakdown",
    template: 'Break down how [Topic/Formula] works step-by-step.',
    category: "Mechanics",
  },
  {
    id: "real-world-example",
    name: "Real-World Example",
    template: 'Give me two real-life examples of [Topic] in everyday action.',
    category: "Application",
  },
  {
    id: "memory-trick",
    name: "Memory Trick",
    template: 'Give me a mnemonic device or memory trick to easily remember [Topic/Date/Formula].',
    category: "Retention",
  },
  {
    id: "analogy-builder",
    name: "Analogy Builder",
    template: 'Create a simple analogy to help me visualize [Topic].',
    category: "Visualization",
  },
  {
    id: "common-mistakes",
    name: "Common Mistakes",
    template: 'What are the most common mistakes students make when solving questions about [Topic]?',
    category: "Exam Prep",
  },
  {
    id: "self-quiz",
    name: "Self-Quiz",
    template: 'Ask me 3 practice questions about [Topic] one at a time, and tell me if my answers are correct.',
    category: "Testing",
  },
  {
    id: "opposing-views",
    name: "Opposing Views/Context",
    template: 'Why is [Topic/Historical Event] important, and what led to it?',
    category: "Context",
  },
  {
    id: "formula-application",
    name: "Formula Application",
    template: 'Show me how to use the formula for [Topic] with a sample practice problem and solution.',
    category: "Problem Solving",
  },
  {
    id: "summary-takeaways",
    name: "Summary & Takeaways",
    template: 'Give me a 3-bullet-point summary of the core ideas behind [Topic].',
    category: "Review",
  },
];

export function AiPromptsHelpModal() {
  const { isOpen, topic: initialTopic, closeModal } = useAiPromptsModalStore();
  const [topicInput, setTopicInput] = React.useState(initialTopic || "");
  const [prevTopic, setPrevTopic] = React.useState(initialTopic);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (initialTopic !== prevTopic) {
    setPrevTopic(initialTopic);
    setTopicInput(initialTopic || "");
  }

  const handleCopy = (prompt: SamplePrompt) => {
    const activeTopic = topicInput.trim() || "[Topic]";
    const textToCopy = prompt.template.replace(/\[Topic(?:\/Formula|\/Date\/Formula|\/Historical Event)?\]/g, activeTopic);

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(prompt.id);
    toast.success(`Copied "${prompt.name}" prompt!`, {
      description: "Paste this directly into ChatGPT, Claude, Gemini, or Copilot.",
    });

    setTimeout(() => {
      setCopiedId((curr) => (curr === prompt.id ? null : curr));
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-3xl rounded-3xl p-0 bg-card border-border/70 shadow-2xl max-h-[88vh] flex flex-col overflow-hidden gap-0">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md p-5 sm:p-6 pb-4 border-b border-border/60 shrink-0 space-y-3">
          <DialogHeader className="space-y-1.5 text-left pr-8">
            <div className="flex items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs shrink-0">
                <HelpCircle className="size-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-black font-heading text-foreground">
                  Using AI as Your Study Tutor
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Quick 3-step guide and pre-configured prompt templates to paste into your favorite free AI tool.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Dynamic Topic Replacement Bar */}
          <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Target className="size-3.5 text-primary" />
                <span>Customize Your Study Topic:</span>
              </label>
              {topicInput && (
                <button
                  type="button"
                  onClick={() => setTopicInput("")}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Reset Topic
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Rational Functions, Conic Sections, Cell Mitosis..."
                className="text-xs sm:text-sm h-8 bg-background border-border/80 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin">
          {/* STEP 1: Download AI Tool */}
          <div className="p-4 rounded-2xl border border-border/70 bg-card space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-black">
                  1
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  Step 1: Choose your AI tool
                </h4>
              </div>
              <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground">
                100% Free Assistants
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Visit the following free AI providers online so you always have a tutor ready:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <a
                href="https://chatgpt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors text-xs font-semibold text-foreground"
              >
                <span>ChatGPT</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </a>
              <a
                href="https://gemini.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors text-xs font-semibold text-foreground"
              >
                <span>Gemini</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </a>
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors text-xs font-semibold text-foreground"
              >
                <span>Claude</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </a>
              <a
                href="https://copilot.microsoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors text-xs font-semibold text-foreground"
              >
                <span>Copilot</span>
                <ExternalLink className="size-3 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* STEP 2: How to write great prompts */}
          <div className="p-4 rounded-2xl border border-border/70 bg-card space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-black">
                2
              </span>
              <h4 className="text-sm font-bold text-foreground">
                Step 2: How to write great prompts
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              To get the clearest answers, structure your questions using these three quick tips:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <span className="text-xs font-bold text-primary block">🎭 Give it a role</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Tell the AI how to act (e.g., &quot;Act as a high school physics teacher&quot;).
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <span className="text-xs font-bold text-primary block">🎯 Be specific</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  State the exact topic, problem, or detail you need help with.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <span className="text-xs font-bold text-primary block">📏 Set constraints</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Ask for concise explanations, simple terms, or step-by-step breakdowns.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 3: 10 sample prompts to copy and paste */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-black">
                  3
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  Step 3: 10 sample prompts to copy and paste
                </h4>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Tap any prompt to copy instantly
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Copy any of these prompts into your AI tool to dive deeper into your quiz topics:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {SAMPLE_PROMPTS.map((item, index) => {
                const isCopied = copiedId === item.id;
                const activeTopic = topicInput.trim() || "[Topic]";
                const displayPrompt = item.template.replace(/\[Topic(?:\/Formula|\/Date\/Formula|\/Historical Event)?\]/g, activeTopic);

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-primary font-mono">
                          #{index + 1}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {item.name}
                        </span>
                        <Badge variant="outline" className="text-[9px] py-0 px-1.5 text-muted-foreground">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground italic font-mono bg-background/60 p-2 rounded-lg border border-border/40 select-all">
                        &quot;{displayPrompt}&quot;
                      </p>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleCopy(item)}
                      className={`shrink-0 rounded-xl text-xs font-bold gap-1.5 cursor-pointer transition-all ${
                        isCopied
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-20 bg-card/95 backdrop-blur-md p-3.5 sm:px-6 border-t border-border/60 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
            Free online tools: ChatGPT • Gemini • Claude • Copilot
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={closeModal}
            className="rounded-xl text-xs font-semibold ml-auto cursor-pointer"
          >
            Close Guide
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
