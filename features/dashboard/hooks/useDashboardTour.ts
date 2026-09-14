"use client";

import { useEffect, useCallback, useRef } from "react";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import { completeTourAction } from "../actions/dashboard.actions";
import type { UserData } from "@/features/auth/hooks/useUser";

interface UseDashboardTourProps {
  user: UserData | null;
  onTourComplete?: () => void;
}

export function useDashboardTour({ user, onTourComplete }: UseDashboardTourProps) {
  const isTourRunning = useRef(false);

  const startTour = useCallback(() => {
    if (typeof window === "undefined" || isTourRunning.current) return;

    const steps: DriveStep[] = [
      {
        element: '[data-tour="sidebar-dashboard"]',
        popover: {
          title: "Dashboard Overview",
          description:
            "This is your primary learning hub. Monitor your real-time academic mastery, overall quiz completion, and DepEd DO 015 s. 2026 transmutation ratings.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="sidebar-subjects"]',
        popover: {
          title: "Enrolled Subjects",
          description:
            "Browse and launch your DepEd curriculum subjects. You can access up to 3 trial subjects with unlimited lessons on our free tier.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="sidebar-ai-tutor"]',
        popover: {
          title: "Gemini Socratic AI Tutor",
          description:
            "Need help? Consult your DepEd-aligned AI Tutor. It uses Socratic questioning in English or Taglish to guide you to the answer without spoiling it.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="sidebar-settings"]',
        popover: {
          title: "Profile & Preferences",
          description:
            "Manage your grade level, academic track/strand, school information, and subscription passes anytime.",
          side: "right",
          align: "start",
        },
      },
      {
        element: '[data-tour="metrics-grid"]',
        popover: {
          title: "Real-Time Mastery & Credits",
          description:
            "Keep track of enrolled subjects, completed quiz competencies, transmuted averages, and your daily free AI credits.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="active-learning"]',
        popover: {
          title: "Resume Active Learning",
          description:
            "Quickly jump back into the exact lesson module you last practiced, complete with your latest progress.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: '[data-tour="recent-tests"]',
        popover: {
          title: "DepEd Transmutation Table",
          description:
            "Your practice test attempts are recorded with official DepEd MATATAG transmutation grades (where 60% raw = 75% passing).",
          side: "top",
          align: "start",
        },
      },
    ];

    // Filter out steps whose DOM elements might not be present
    const availableSteps = steps.filter((s) => {
      if (typeof s.element === "string") {
        return !!document.querySelector(s.element);
      }
      return true;
    });

    if (availableSteps.length === 0) return;

    isTourRunning.current = true;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "Finish Tour ✓",
      steps: availableSteps,
      onDestroyStarted: () => {
        isTourRunning.current = false;
        try {
          localStorage.setItem("highschool_tutor_tour_completed", "true");
        } catch {
          // ignore localStorage failure
        }
        completeTourAction().catch((err) => {
          console.error("Failed to complete tour on server:", err);
        });
        if (onTourComplete) {
          onTourComplete();
        }
        driverObj.destroy();
      },
    });

    driverObj.drive();
  }, [onTourComplete]);

  // Automatically launch tour if user has onboarded profile but hasn't completed tour
  useEffect(() => {
    if (!user || user.role === "ADMIN") return;
    if (!user.profile?.hasOnboarded) return;

    // Check if tour was already finished on server or localStorage
    if (user.profile?.hasCompletedTour) return;

    const isLocalTourDone =
      typeof window !== "undefined" &&
      localStorage.getItem("highschool_tutor_tour_completed") === "true";

    if (isLocalTourDone) return;

    // Delay slightly to allow DOM and layout to mount smoothly
    const timer = setTimeout(() => {
      startTour();
    }, 1200);

    return () => clearTimeout(timer);
  }, [user, startTour]);

  return { startTour };
}
