import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans, Source_Sans_3 } from "next/font/google";
import { Navbar } from "@/shared/components/layout/Navbar";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";
import { cn } from "@/lib/utils";

const sourceSans3Heading = Source_Sans_3({subsets:['latin'],variable:'--font-heading'});

const ibmPlexSans = IBM_Plex_Sans({subsets:['latin'],variable:'--font-sans'});

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", ibmPlexSans.variable, sourceSans3Heading.variable)}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border/40 bg-card/40 py-8 text-center text-xs text-muted-foreground">
              <div className="container mx-auto px-4">
                <p className="font-medium text-foreground/80">
                  HighSchool Tutor • Philippine DepEd K-12 Curriculum & MATATAG Aligned
                </p>
                <p className="mt-1">
                  Powered by Google Gemini 2.5 AI • PostgreSQL Prisma Infrastructure
                </p>
              </div>
            </footer>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
