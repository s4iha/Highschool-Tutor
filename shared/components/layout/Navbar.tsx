"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, Sparkles, GraduationCap } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();

  // Hide Navbar on authentication pages
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

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
            <Image 
              src="/logo/highschool-tutor-bg-removed.png" 
              alt="HighSchool Tutor Logo" 
              width={36} 
              height={36} 
              className="object-contain"
            />
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
          <ThemeToggle />
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
