"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface AuthPageProps {
  type: "login" | "register";
}

export function AuthPage({ type }: AuthPageProps) {
  const isLogin = type === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication demo response with Sonner toast
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        isLogin ? "Welcome back! Redirecting..." : "Account created! Welcome aboard!",
        {
          description: `Signed in as ${email || "student@highschooltutor.ph"}`,
        }
      );
    }, 600);
  };

  return (
    <div className="flex min-h-screen w-full bg-background md:p-4 lg:p-6 items-center justify-center">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-[2rem] bg-card border border-border/40 shadow-2xl h-[85vh] min-h-[640px]">
        {/* Left Form Section */}
        <div className="flex w-full flex-col justify-between p-8 md:w-1/2 lg:p-12 relative overflow-y-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative size-10 overflow-hidden rounded-xl bg-primary/10 p-1 flex items-center justify-center border border-primary/20 shadow-xs group-hover:border-primary/40 transition-colors">
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
                <span className="font-heading font-bold text-base tracking-tight text-foreground leading-tight">
                  HighSchool <span className="text-primary">Tutor</span>
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  MATATAG DepEd K-12
                </span>
              </div>
            </Link>
            <div className="text-xs">
              <span className="text-muted-foreground mr-1">
                {isLogin ? "New here?" : "Have an account?"}
              </span>
              <Link
                href={isLogin ? "/register" : "/login"}
                className="font-medium text-foreground underline-offset-4 hover:underline border rounded-full px-3.5 py-1 ml-1 border-border/60 shadow-xs hover:border-primary/50 transition-colors"
              >
                {isLogin ? "Register" : "Log In"}
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm flex-1 flex flex-col justify-center my-6">
            <div className="flex flex-col items-center space-y-2 text-center mb-6">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
                <Sparkles className="size-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-heading">
                {isLogin ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-xs text-muted-foreground max-w-xs">
                {isLogin
                  ? "Access your DepEd lessons, AI tutor drills, and review quizzes."
                  : "Join thousands of JHS & SHS students mastering Philippine curriculum."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground ml-0.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.edu.ph"
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 pl-9 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between ml-0.5">
                  <label className="text-xs font-semibold text-foreground">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() =>
                        toast.info("Password Reset", {
                          description:
                            "Password reset link would be sent to your registered email.",
                        })
                      }
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 pl-9 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    defaultChecked
                    className="h-4 w-4 rounded border-border text-primary accent-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Remember me for 30 days
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-11 w-full mt-3 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md shadow-primary/20"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <span>{isLogin ? "Sign In to Learning Portal" : "Get Started for Free"}</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t border-border/40">
            <span>© 2026 HighSchool Tutor</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              <span>DepEd MATATAG Ready</span>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative hidden w-1/2 md:block rounded-[1.5rem] overflow-hidden m-3 ml-0 shadow-inner bg-muted">
          <Image
            src="/images/auth-bg.jpg"
            alt="HighSchool Tutor Learning Environment"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex flex-col justify-end p-8 text-foreground">
            <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold backdrop-blur-md mb-2 border border-primary/30">
              <Sparkles className="size-3.5" />
              Next-Gen Philippine EdTech
            </span>
            <h3 className="text-xl font-bold font-heading">
              Socratic AI Tutoring for DepEd High Schools
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Tailored explanations, practice quizzes, and multi-dialect tutoring in English, Filipino, Taglish, and Cebuano.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
