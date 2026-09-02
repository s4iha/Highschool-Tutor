"use client";

import * as React from "react";
import { Languages, Loader2 } from "lucide-react";
import { DIALECTS } from "../utils/curriculum-data";

interface TranslationControlsProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  isTranslating: boolean;
}

export function TranslationControls({
  currentLanguage,
  onLanguageChange,
  isTranslating,
}: TranslationControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative inline-flex items-center">
        <Languages className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
        <select
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={isTranslating}
          aria-label="Select translation dialect"
          className="h-8 rounded-lg border border-input bg-background pl-8 pr-3 text-xs font-medium text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer disabled:opacity-50"
        >
          {DIALECTS.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {isTranslating && (
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground animate-pulse">
          <Loader2 className="size-3 animate-spin text-indigo-500" />
          <span>Translating...</span>
        </span>
      )}
    </div>
  );
}
