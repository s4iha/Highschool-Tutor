"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface AuthPageProps {
  type: "login" | "register";
}

export function AuthPage({ type }: AuthPageProps) {
  const isLogin = type === "login";

  return (
    <div className="flex min-h-screen w-full bg-background md:p-4 lg:p-6 items-center justify-center">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-[2rem] bg-card border border-border/40 shadow-2xl h-[85vh] min-h-[600px]">
        {/* Left Form Section */}
        <div className="flex w-full flex-col justify-between p-8 md:w-1/2 lg:p-12 relative">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-sm">
                <GraduationCap className="size-4" />
              </div>
            </Link>
            <div className="text-sm">
              <span className="text-muted-foreground mr-1">
                {isLogin ? "New to Tutor?" : "Already have an account?"}
              </span>
              <Link
                href={isLogin ? "/register" : "/login"}
                className="font-medium text-foreground underline-offset-4 hover:underline border rounded-full px-4 py-1.5 ml-2 border-border/60 shadow-sm"
              >
                {isLogin ? "Register" : "Log In"}
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm flex-1 flex flex-col justify-center mt-8">
            <div className="flex flex-col items-center space-y-2 text-center mb-8">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground border border-border/40 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isLogin ? "Login to your account" : "Create an account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? "Enter your details to login."
                  : "Enter your details to register."}
              </p>
            </div>

            <form className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="work@example.com"
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-semibold text-foreground">Password</label>
                  {isLogin && (
                    <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 accent-indigo-600"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              )}

              <button
                type="button"
                className="inline-flex h-10 w-full mt-4 items-center justify-center rounded-md bg-indigo-600 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-md shadow-indigo-500/20"
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </form>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-8">
            <span>© 2026 HighSchool Tutor</span>
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              <span>ENG </span>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="relative hidden w-1/2 md:block rounded-[1.5rem] overflow-hidden m-4 ml-0 shadow-inner">
          <Image
            src="/images/auth-bg.jpg"
            alt="Beautiful 3D Abstract Background"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
          />
        </div>
      </div>
    </div>
  );
}
