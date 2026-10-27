import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Sans_3, Inter } from "next/font/google";
import { Navbar } from "@/shared/components/layout/Navbar";
import { Footer } from "@/shared/components/layout/Footer";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/shared/components/ui/sonner";
import { UpgradeModal } from "@/shared/components/ui/UpgradeModal";
import { PaymentCelebrationDialog } from "@/features/billing/components/PaymentCelebrationDialog";
import { ReferralTracker } from "@/shared/components/marketing/ReferralTracker";
import { OnboardingModal } from "@/features/auth/components/OnboardingModal";
import {
  JsonLd,
  buildOrganizationSchema,
  buildWebSiteSchema,
  getSiteUrl,
} from "@/features/seo";
import "./globals.css";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

const sourceSans3Heading = Source_Sans_3({ subsets: ["latin"], variable: "--font-heading" });

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HighSchool Tutor - DepEd K-12 AI Learning Platform",
    template: "%s • HighSchool Tutor",
  },
  description:
    "Master Junior and Senior High School subjects with DepEd-aligned quizzes and real-time Google Gemini Socratic tutoring.",
  icons: {
    icon: "/logo/highschool-tutor-logo-favicon-squared.png",
    shortcut: "/logo/highschool-tutor-logo-favicon-squared.png",
    apple: "/logo/highschool-tutor-logo-favicon-squared.png",
  },
  openGraph: {
    type: "website",
    siteName: "HighSchool Tutor",
    locale: "en_PH",
    url: siteUrl,
    title: "HighSchool Tutor - DepEd K-12 AI Learning Platform",
    description:
      "Master Junior and Senior High School subjects with DepEd-aligned quizzes and real-time Google Gemini Socratic tutoring.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "HighSchool Tutor DepEd K-12 AI Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HighSchool Tutor - DepEd K-12 AI Learning Platform",
    description:
      "Master Junior and Senior High School subjects with DepEd-aligned quizzes and real-time Google Gemini Socratic tutoring.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = buildOrganizationSchema();
  const websiteSchema = buildWebSiteSchema();

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        sourceSans3Heading.variable
      )}
    >
      <head>
        <JsonLd schema={orgSchema} />
        <JsonLd schema={websiteSchema} />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <Toaster position="bottom-right" closeButton />
            <ReferralTracker />
            <UpgradeModal />
            <PaymentCelebrationDialog />
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
