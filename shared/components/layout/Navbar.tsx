"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Crown,
  Sparkles,
  Layers,
  BookOpen,
  Bot,
  Info,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { ThemeToggle } from "./ThemeToggle";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
import { Button } from "@/shared/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { openUpgradeModal } = useUpgradeModalStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide Navbar on authentication, dashboard, and admin pages
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  const links = [
    { href: "/how-it-works", label: "How It Works", icon: Sparkles },
    { href: "/#categories", label: "Curriculum Strands", icon: Layers },
    { href: "/#subjects", label: "Subjects Catalog", icon: BookOpen },
    { href: "/#demo", label: "AI Demo", icon: Bot },
    { href: "/#about", label: "About", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 relative">
        {/* Left: Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 group"
          >
            <div className="relative size-9 overflow-hidden rounded-xl bg-primary/10 p-1 flex items-center justify-center border border-primary/20 shadow-xs group-hover:border-primary/40 transition-colors">
              <Image
                src="/logo/highschool-tutor-bg-removed.png"
                alt="HighSchool Tutor Logo"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground font-heading">
                HighSchool<span className="text-primary">Tutor</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                DepEd K-12 MATATAG
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href) && link.href !== "/";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-3.5 text-primary" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Desktop Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              openUpgradeModal({
                featureName: "All High School Subjects",
                reason:
                  "Upgrade to Premium to unlock all 130+ DepEd subjects and unlimited AI tutoring.",
              })
            }
            className="hidden sm:inline-flex gap-1.5 rounded-xl text-xs border-primary/30 text-primary hover:bg-primary/10"
          >
            <Crown className="size-3.5" />
            <span>Upgrade</span>
          </Button>

          <ThemeToggle />

          <Link
            href="/login"
            className="hidden sm:inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Sign In
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="inline-flex lg:hidden items-center justify-center size-9 rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-background/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                pathname === "/"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Sparkles className="size-4 text-primary" />
              <span>Home</span>
            </Link>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href) && link.href !== "/";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 text-primary" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMobileMenuOpen(false);
                openUpgradeModal({
                  featureName: "All High School Subjects",
                  reason:
                    "Upgrade to Premium to unlock all 130+ DepEd subjects and unlimited AI tutoring.",
                });
              }}
              className="w-full justify-center gap-2 rounded-xl text-xs border-primary/30 text-primary hover:bg-primary/10 py-2.5 h-auto"
            >
              <Crown className="size-4" />
              <span>Upgrade to Premium</span>
            </Button>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
