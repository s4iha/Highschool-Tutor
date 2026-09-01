"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sparkles, GraduationCap, Flame, ShieldCheck } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Badge } from "@/shared/components/ui/badge";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Subjects Catalog", icon: BookOpen },
    { href: "/curriculum/genmath", label: "General Math", icon: Sparkles },
    { href: "/curriculum/earthsci", label: "Earth Science", icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground">
                HighSchool<span className="text-indigo-600 dark:text-indigo-400">Tutor</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                DepEd K-12 AI Platform
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden sm:flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
            <Flame className="size-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>DepEd MATATAG Aligned</span>
          </Badge>

          <Badge variant="success" className="flex items-center gap-1 font-mono text-[11px]">
            <ShieldCheck className="size-3.5" />
            <span>Gemini 2.5 AI Active</span>
          </Badge>
        </div>
      </div>
    </header>
  );
}
