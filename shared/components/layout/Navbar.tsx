"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, Shield, Crown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { ThemeToggle } from "./ThemeToggle";
import { useUpgradeModalStore } from "@/shared/hooks/useUpgradeModalStore";
import { Button } from "@/shared/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { openUpgradeModal } = useUpgradeModalStore();

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
    { href: "/#subjects", label: "Subjects Catalog", icon: BookOpen },
    { href: "/dashboard", label: "Student Dashboard", icon: BookOpen },
    { href: "/admin", label: "Admin Portal", icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
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

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
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
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              openUpgradeModal({
                featureName: "All High School Subjects",
                reason: "Upgrade to Premium to unlock all 130+ DepEd subjects and unlimited AI tutoring.",
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
            className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
