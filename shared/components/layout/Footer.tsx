"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, GraduationCap } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard, admin, and auth routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <footer className="bg-card text-card-foreground border-t border-border pt-16 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative size-9 overflow-hidden rounded-xl bg-primary/10 p-1 flex items-center justify-center border border-primary/20 shadow-xs">
                <Image
                  src="/logo/highschool-tutor-bg-removed.png"
                  alt="HighSchool Tutor Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-foreground font-heading">
                  HighSchool<span className="text-primary">Tutor</span>
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  DepEd K-12 MATATAG
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
              Standardized Philippine High School curriculum platform covering Grades 7 to 12. Providing 12 sequential lesson modules, 24 verified quizzes, and real-time Socratic AI explanations.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>DepEd DO 015 s. 2026 Ready</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#subjects" className="hover:text-primary transition-colors">
                  Subjects Catalog
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Tracks & Strands */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Academic Strands
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/#categories" className="hover:text-primary transition-colors">
                  Junior High School (Grades 7-10)
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-primary transition-colors">
                  STEM Strand (Senior High)
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-primary transition-colors">
                  ABM Strand (Senior High)
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-primary transition-colors">
                  HUMSS Strand (Senior High)
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-primary transition-colors">
                  SHS Core Curriculum
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Updates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              DepEd Updates
            </h4>
            <p className="text-xs text-muted-foreground">
              Receive newly released DepEd MATATAG lessons and AI practice quizzes directly.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your school email"
                className="w-full bg-muted text-xs text-foreground px-3.5 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} HighSchool Tutor by SGWS. All rights reserved.</p>
          <p className="font-medium">
            Philippine DepEd K-12 MATATAG &amp; DO 015 s. 2026 Aligned • Powered by Google Gemini 2.5 AI
          </p>
        </div>
      </div>
    </footer>
  );
}
