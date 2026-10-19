"use client";

import * as React from "react";
import { UserPlus, Mail, User, GraduationCap, Crown } from "lucide-react";
import { useEnrollStudentMutation } from "../../hooks/useAdminPortal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { toast } from "sonner";

interface AdminEnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminEnrollStudentModal({
  isOpen,
  onClose,
}: AdminEnrollStudentModalProps) {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [gradeLevel, setGradeLevel] = React.useState("Grade 11");
  const [plan, setPlan] = React.useState<"MONTHLY" | "ANNUAL" | "TRIAL_30">("MONTHLY");

  const enrollMutation = useEnrollStudentMutation();

  const resetForm = () => {
    setEmail("");
    setName("");
    setGradeLevel("Grade 11");
    setPlan("MONTHLY");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Valid email address is required");
      return;
    }

    try {
      await enrollMutation.mutateAsync({
        email: email.trim().toLowerCase(),
        name: name.trim() || undefined,
        gradeLevel,
        plan,
      });
      handleClose();
    } catch {
      // Error handled by mutation onError
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-3xl p-6">
        <DialogHeader className="space-y-2">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserPlus className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground font-heading">
            Manually Enroll Student
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Activate subscription access or grant a 30-day full trial using the student&apos;s email. If the account does not exist, it will be automatically provisioned.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="size-3.5 text-muted-foreground" />
              <span>Student Email Address *</span>
            </label>
            <Input
              type="email"
              required
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl text-sm"
              disabled={enrollMutation.isPending}
            />
          </div>

          {/* Optional Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="size-3.5 text-muted-foreground" />
              <span>Full Name (Optional)</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Maria Clara Santos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl text-sm"
              disabled={enrollMutation.isPending}
            />
          </div>

          {/* Grade Level Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-muted-foreground" />
              <span>Grade Level</span>
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
              disabled={enrollMutation.isPending}
            >
              <optgroup label="Junior High School">
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
              </optgroup>
              <optgroup label="Senior High School">
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </optgroup>
            </select>
          </div>

          {/* Plan Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Crown className="size-3.5 text-primary" />
              <span>Subscription Plan to Grant</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  plan === "MONTHLY"
                    ? "border-primary bg-primary/5 text-foreground font-semibold"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    value="MONTHLY"
                    checked={plan === "MONTHLY"}
                    onChange={() => setPlan("MONTHLY")}
                    className="text-primary"
                  />
                  <span>Monthly Pass (30 Days Active)</span>
                </div>
                <span className="font-mono text-primary font-bold">₱299</span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  plan === "ANNUAL"
                    ? "border-primary bg-primary/5 text-foreground font-semibold"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    value="ANNUAL"
                    checked={plan === "ANNUAL"}
                    onChange={() => setPlan("ANNUAL")}
                    className="text-primary"
                  />
                  <span>Annual Pass (Full School Year)</span>
                </div>
                <span className="font-mono text-primary font-bold">₱1,499</span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  plan === "TRIAL_30"
                    ? "border-primary bg-primary/5 text-foreground font-semibold"
                    : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="plan"
                    value="TRIAL_30"
                    checked={plan === "TRIAL_30"}
                    onChange={() => setPlan("TRIAL_30")}
                    className="text-primary"
                  />
                  <span>30-Day Full Access Free Trial</span>
                </div>
                <span className="font-mono text-emerald-600 font-bold">Free Trial</span>
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={enrollMutation.isPending}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={enrollMutation.isPending}
              className="rounded-xl text-xs font-semibold gap-1.5"
            >
              <UserPlus className="size-3.5" />
              <span>{enrollMutation.isPending ? "Enrolling..." : "Enroll Student"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
