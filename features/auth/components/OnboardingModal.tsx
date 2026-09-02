"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOnboardingModalStore } from "@/shared/hooks/useOnboardingModalStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Sparkles, GraduationCap } from "lucide-react";

export function OnboardingModal() {
  const { isOpen, closeOnboardingModal } = useOnboardingModalStore();
  const [fullName, setFullName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("Grade 11");
  const [track, setTrack] = useState("STEM Strand");

  const mutation = useMutation({
    mutationFn: async (data: { fullName: string; gradeLevel: string; track: string }) => {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save profile");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Profile Setup Complete!", {
        description: "Welcome to your HighSchool Tutor learning journey.",
      });
      closeOnboardingModal();
    },
    onError: (err: any) => {
      toast.error("Setup Failed", {
        description: err.message || "Something went wrong.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please provide your full name");
      return;
    }
    mutation.mutate({ fullName, gradeLevel, track });
  };

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
              onChange={(e) => setGradeLevel(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
            >
              <option value="Grade 7">Grade 7 (Junior High School)</option>
              <option value="Grade 8">Grade 8 (Junior High School)</option>
              <option value="Grade 9">Grade 9 (Junior High School)</option>
              <option value="Grade 10">Grade 10 (Junior High School)</option>
              <option value="Grade 11">Grade 11 (Senior High School)</option>
              <option value="Grade 12">Grade 12 (Senior High School)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Curriculum Track / Strand
            </label>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
            >
              <option value="JHS Core">Junior High Core Curriculum</option>
              <option value="STEM Strand">STEM Strand (Science, Tech, Engineering, Math)</option>
              <option value="ABM Strand">ABM Strand (Accountancy, Business, Management)</option>
              <option value="HUMSS Strand">HUMSS Strand (Humanities & Social Sciences)</option>
              <option value="GAS Strand">General Academic Strand (GAS)</option>
              <option value="TVL Track">Technical-Vocational-Livelihood (TVL)</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full mt-2 h-11 rounded-xl text-sm font-semibold"
          >
            {mutation.isPending ? "Saving Profile..." : "Get Started"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
