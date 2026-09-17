"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { useAiPromptsModalStore } from "@/shared/hooks/useAiPromptsModalStore";
import { Button } from "@/shared/components/ui/button";

interface AiPromptsFabProps {
  topic?: string;
}

export function AiPromptsFab({ topic }: AiPromptsFabProps) {
  const openModal = useAiPromptsModalStore((s) => s.openModal);

  return (
    <Button
      type="button"
      size="icon"
      onClick={() => openModal(topic)}
      className="fixed bottom-6 right-6 z-40 size-13 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-background/80 cursor-pointer"
      aria-label="AI Study Prompts Help"
      title="AI Study Prompts Help"
    >
      <HelpCircle className="size-6 text-primary-foreground" />
      <span className="sr-only">AI Study Prompts Help</span>
    </Button>
  );
}
