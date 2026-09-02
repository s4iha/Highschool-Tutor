"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, Lock, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useOnboardingModalStore } from "@/shared/hooks/useOnboardingModalStore";
import { authClient } from "@/features/auth/lib/auth-client";

interface AuthPageProps {
  type: "login" | "register";
}

function AuthPageContent({ type }: AuthPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { openOnboardingModal } = useOnboardingModalStore();

  const isLogin = type === "login";

  useEffect(() => {
    const authError = searchParams.get("error");
    if (authError) {
      toast.error("Authentication Notice", {
        description: decodeURIComponent(authError),
      });
    }
  }, [searchParams]);

  const authMutation = useMutation({
    mutationFn: async () => {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Authentication failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(
        isLogin ? "Welcome back! Redirecting..." : "Account created! Welcome aboard!",
        {
          description: `Signed in as ${email}`,
        }
      );
      if (!data.user?.hasOnboarded) {
        openOnboardingModal();
      }
      router.push(callbackUrl);
      router.refresh();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Please check your credentials.";
      toast.error(isLogin ? "Sign In Failed" : "Registration Failed", {
        description: msg,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authMutation.mutate();
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch (err: unknown) {
      setIsGoogleLoading(false);
      const msg = err instanceof Error ? err.message : "Failed to authenticate with Google.";
      toast.error("Google Sign-In Failed", {
        description: msg,
      });
    }
  };

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden bg-background flex items-center justify-center p-2 sm:p-4 md:p-6 select-none">
      <div className="flex w-full max-w-5xl h-full max-h-[92vh] sm:max-h-[86vh] overflow-hidden rounded-3xl bg-card border border-border/40 shadow-2xl">
        {/* Left Form Section */}
        <div className="flex w-full flex-col justify-between p-5 sm:p-7 md:p-9 md:w-1/2 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative size-9 overflow-hidden rounded-xl bg-primary/10 p-1 flex items-center justify-center border border-primary/20 shadow-xs group-hover:border-primary/40 transition-colors">
                <Image
                  src="/logo/highschool-tutor-bg-removed.png"
                  alt="HighSchool Tutor Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm tracking-tight text-foreground leading-tight">
                  HighSchool <span className="text-primary">Tutor</span>
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
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
                className="font-medium text-foreground underline-offset-4 hover:underline border rounded-full px-3 py-0.5 ml-1 border-border/60 shadow-xs hover:border-primary/50 transition-colors text-xs"
              >
                {isLogin ? "Register" : "Log In"}
              </Link>
            </div>
          </div>

          {/* Form Content */}
          <div className="mx-auto w-full max-w-sm flex flex-col justify-center my-auto py-2">
            <div className="flex flex-col items-center text-center mb-4 space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading mt-4">
                {isLogin ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-xs text-muted-foreground max-w-xs">
                {isLogin
                  ? "Access your DepEd lessons, AI tutor drills, and review quizzes."
                  : "Join thousands of JHS & SHS students mastering Philippine curriculum."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground ml-0.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.edu.ph"
                    className="flex h-9 sm:h-10 w-full rounded-xl border border-input bg-background px-3 py-1.5 pl-9 text-xs sm:text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
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
                      className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="flex h-9 sm:h-10 w-full rounded-xl border border-input bg-background px-3 py-1.5 pl-9 pr-10 text-xs sm:text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center space-x-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="remember"
                    defaultChecked
                    className="h-3.5 w-3.5 rounded border-border text-primary accent-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="text-[11px] font-medium text-muted-foreground"
                  >
                    Remember me for 30 days
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={authMutation.isPending || isGoogleLoading}
                className="inline-flex h-9 sm:h-10 w-full mt-2 items-center justify-center gap-2 rounded-xl bg-primary text-xs sm:text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md shadow-primary/20"
              >
                {authMutation.isPending ? (
                  "Processing..."
                ) : (
                  <>
                    <span>{isLogin ? "Login" : "Sign Up"}</span>
                  </>
                )}
              </button>

              <div className="relative my-2 sm:my-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-card px-2 text-muted-foreground font-semibold">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || authMutation.isPending}
                className="inline-flex h-9 sm:h-10 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background text-xs sm:text-sm font-semibold text-foreground transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none shadow-xs"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                <span>{isGoogleLoading ? "Connecting..." : "Google"}</span>
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
            <span>© 2026 HighSchool Tutor</span>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              <span>DepEd MATATAG Ready</span>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative hidden w-1/2 md:block rounded-[1.5rem] overflow-hidden m-2.5 ml-0 shadow-inner bg-muted">
          <Image
            src="/images/auth-bg.jpg"
            alt="HighSchool Tutor Learning Environment"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-foreground">
            <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold backdrop-blur-md mb-2 border border-primary/30">
              <GraduationCap className="size-3.5" />
              Next-Gen Philippine EdTech
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-heading">
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

export function AuthPage({ type }: AuthPageProps) {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-background" />}>
      <AuthPageContent type={type} />
    </Suspense>
  );
}
