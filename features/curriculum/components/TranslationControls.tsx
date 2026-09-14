"use client";

import * as React from "react";
import { Languages, Loader2 } from "lucide-react";
import { DIALECTS } from "../utils/curriculum-data";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";

interface TranslationControlsProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  isTranslating: boolean;
  isPremium?: boolean;
}

export function TranslationControls({
  currentLanguage,
  onLanguageChange,
  isTranslating,
  isPremium = false,
}: TranslationControlsProps) {
  const { openUpgradeModal } = useUpgradeModalStore();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    const isFree = selected === "English" || selected === "Taglish";

    if (!isPremium && !isFree) {
      openUpgradeModal({
        featureName: "10 Philippine Mother-Tongue Dialects",
        reason: `Unlock Socratic tutoring in ${selected} (plus Cebuano, Ilocano, Hiligaynon, Bicolano, Waray, Kapampangan, Pangasinense) with a HighSchool Tutor Pass!`,
      });
      return;
    }

    onLanguageChange(selected);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative inline-flex items-center">
        <Languages className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
        <select
          value={currentLanguage}
          onChange={handleSelectChange}
          disabled={isTranslating}
          aria-label="Select translation dialect"
          className="h-8 rounded-lg border border-input bg-background pl-8 pr-3 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer disabled:opacity-50"
        >
          {DIALECTS.map((lang) => {
            const isFree = lang === "English" || lang === "Taglish";
            const isLocked = !isPremium && !isFree;
            return (
              <option key={lang} value={lang}>
                {lang} {isLocked ? "🔒 (Pass required)" : ""}
              </option>
            );
          })}
        </select>
      </div>

      {isTranslating && (
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground animate-pulse">
          <Loader2 className="size-3 animate-spin text-primary" />
          <span>Translating...</span>
        </span>
      )}
    </div>
  );
}
