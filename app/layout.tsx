import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Sans_3, Inter } from "next/font/google";
import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/shared/components/ui/sonner";
import { UpgradeModal } from "@/shared/components/ui/UpgradeModal";
import { OnboardingModal } from "@/features/auth/components/OnboardingModal";
import "./globals.css";
import { cn } from "@/lib/utils";

const sourceSans3Heading = Source_Sans_3({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HighSchool Tutor - DepEd K-12 AI Learning Platform",
  description: "Master Junior and Senior High School subjects with DepEd-aligned quizzes and real-time Google Gemini Socratic tutoring.",
  icons: {
    icon: "/logo/highschool-tutor-logo-favicon-squared.png",
    shortcut: "/logo/highschool-tutor-logo-favicon-squared.png",
    apple: "/logo/highschool-tutor-logo-favicon-squared.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable, sourceSans3Heading.variable)}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <Toaster position="bottom-right" closeButton />
            <UpgradeModal />
            <OnboardingModal />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
