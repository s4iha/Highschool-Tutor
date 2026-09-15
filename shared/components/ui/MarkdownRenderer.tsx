"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content?: string | null;
  className?: string;
  inline?: boolean;
}

export function MarkdownRenderer({ content, className, inline = false }: MarkdownRendererProps) {
  if (!content) return null;

  if (inline) {
    return (
      <span className={cn("prose-sm dark:prose-invert max-w-none break-words leading-relaxed inline", className)}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            p: ({ children }) => <span className="inline leading-relaxed">{children}</span>,
            strong: ({ children }) => <strong className="font-bold text-inherit">{children}</strong>,
            em: ({ children }) => <em className="italic text-inherit">{children}</em>,
            code: ({ children }) => (
              <code className="rounded bg-muted/80 px-1 py-0.5 text-[11px] font-mono text-foreground border border-border/40">
                {children}
              </code>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </span>
    );
  }

  return (
    <div className={cn("prose-sm dark:prose-invert max-w-none break-words leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-inherit">{children}</strong>,
          em: ({ children }) => <em className="italic text-inherit">{children}</em>,
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <pre className="my-2 overflow-x-auto rounded-lg bg-muted/90 p-2.5 text-xs font-mono text-foreground border border-border/50">
                  <code>{children}</code>
                </pre>
              );
            }
            return (
              <code className="rounded bg-muted/80 px-1 py-0.5 text-[11px] font-mono text-foreground border border-border/40">
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-primary/50 pl-3 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          h1: ({ children }) => <h1 className="text-base font-bold my-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm font-bold my-1.5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs font-semibold my-1">{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
