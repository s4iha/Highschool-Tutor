"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOnboardingModalStore } from "@/shared/hooks/useOnboardingModalStore";
import { useUser, UserData } from "@/features/auth/hooks/useUser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { GraduationCap } from "lucide-react";

interface OnboardingFormProps {
  user: UserData | null;
  onClose: () => void;
}

function OnboardingForm({ user, onClose }: OnboardingFormProps) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState(
    user?.profile?.fullName?.trim() || user?.name?.trim() || ""
  );
  const [gradeLevel, setGradeLevel] = useState(
    user?.profile?.gradeLevel?.trim() || "Grade 11"
  );
  const [track, setTrack] = useState(
    user?.profile?.track?.trim() || "STEM Strand"
  );
  const [termPreference, setTermPreference] = useState(
    user?.profile?.termPreference?.trim() || "Trimester 1"
  );

  const mutation = useMutation({
    mutationFn: async (data: { fullName: string; gradeLevel: string; track: string; termPreference: string }) => {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = (await res.json()) as { error?: string };
        throw new Error(error.error || "Failed to save profile");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile Setup Complete!", {
        description: "Welcome to your HighSchool Tutor learning journey.",
      });
      onClose();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error("Setup Failed", {
        description: msg,
      });
    },
  });

  const isSeniorHigh = gradeLevel === "Grade 11" || gradeLevel === "Grade 12";

  const handleGradeChange = (newGrade: string) => {
    setGradeLevel(newGrade);
    if (newGrade === "Grade 11" || newGrade === "Grade 12") {
      if (track === "JHS Core") {
        setTrack("STEM Strand");
      }
      if (!termPreference.startsWith("Semester")) {
        setTermPreference("Semester 1");
      }
    } else {
      setTrack("JHS Core");
      if (!termPreference.startsWith("Trimester")) {
        setTermPreference("Trimester 1");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please provide your full name");
      return;
    }
    const finalTrack = isSeniorHigh ? track : "JHS Core";
    mutation.mutate({ fullName: fullName.trim(), gradeLevel, track: finalTrack, termPreference });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Full Name
        </label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Juan Dela Cruz"
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Grade Level
        </label>
        <select
          value={gradeLevel}
          onChange={(e) => handleGradeChange(e.target.value)}
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          <optgroup label="Junior High School (Grades 7–10)">
            <option value="Grade 7">Grade 7 (Junior High School)</option>
            <option value="Grade 8">Grade 8 (Junior High School)</option>
            <option value="Grade 9">Grade 9 (Junior High School)</option>
            <option value="Grade 10">Grade 10 (Junior High School)</option>
          </optgroup>
          <optgroup label="Senior High School (Grades 11–12)">
            <option value="Grade 11">Grade 11 (Senior High School)</option>
            <option value="Grade 12">Grade 12 (Senior High School)</option>
          </optgroup>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          {isSeniorHigh ? "Current Semester" : "Current Trimester / Grading Period"}
        </label>
        <select
          value={termPreference}
          onChange={(e) => setTermPreference(e.target.value)}
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          {isSeniorHigh ? (
            <>
              <option value="Semester 1">Semester 1 (First Half of School Year)</option>
              <option value="Semester 2">Semester 2 (Second Half of School Year)</option>
            </>
          ) : (
            <>
              <option value="Trimester 1">Trimester 1 (First Grading Period)</option>
              <option value="Trimester 2">Trimester 2 (Second Grading Period)</option>
              <option value="Trimester 3">Trimester 3 (Third Grading Period)</option>
            </>
          )}
        </select>
      </div>

      {isSeniorHigh && (
        <div className="space-y-1.5 animate-in fade-in-50 duration-200">
          <label className="text-xs font-semibold text-foreground">
            Senior High Track / Strand
          </label>
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          >
            <option value="STEM Strand">STEM Strand (Science, Tech, Engineering, Math)</option>
            <option value="ABM Strand">ABM Strand (Accountancy, Business, Management)</option>
            <option value="HUMSS Strand">HUMSS Strand (Humanities &amp; Social Sciences)</option>
            <option value="GAS Strand">General Academic Strand (GAS)</option>
            <option value="TVL Track">Technical-Vocational-Livelihood (TVL Track)</option>
          </select>
        </div>
      )}

      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full mt-2 h-11 rounded-xl text-sm font-semibold"
      >
        {mutation.isPending ? "Saving Profile..." : "Get Started"}
      </Button>
    </form>
  );
}

export function OnboardingModal() {
  const { isOpen, closeOnboardingModal } = useOnboardingModalStore();
  const { user } = useUser();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md rounded-3xl p-6"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2 text-center items-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs mb-1">
            <GraduationCap className="size-6" />
          </div>
          <DialogTitle className="text-xl font-bold font-heading">
            Welcome! Set Up Your Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure your academic level so we can personalize your DepEd curriculum and AI tutoring.
          </DialogDescription>
        </DialogHeader>

        {isOpen && (
          <OnboardingForm
            key={user?.id || "guest"}
            user={user}
            onClose={closeOnboardingModal}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
