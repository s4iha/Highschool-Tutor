"use client";

import * as React from "react";
import {
  GraduationCap,
  School,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Award,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/components/ui/sheet";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  StudentItem,
  useUpdateSubscriptionMutation,
  useAdminSettingsQuery,
} from "../../hooks/useAdminPortal";

interface StudentDetailSheetProps {
  student: StudentItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailSheet({
  student,
  open,
  onOpenChange,
}: StudentDetailSheetProps) {
  const updateSubscription = useUpdateSubscriptionMutation();
  const { data: settings } = useAdminSettingsQuery();
  const annualPrice = settings?.annualPricePhp ?? 1499;
  const monthlyPrice = settings?.monthlyPricePhp ?? 199;

  if (!student) return null;

  const isActive = student.subscriptionStatus === "ACTIVE";
  const isPending = student.subscriptionStatus === "PENDING";

  const handleActivate = (plan: "ANNUAL" | "MONTHLY") => {
    updateSubscription.mutate({
      userId: student.id,
      status: "ACTIVE",
      plan,
    });
  };

  const handleExpire = () => {
    updateSubscription.mutate({
      userId: student.id,
      status: "EXPIRED",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md w-full">
        <SheetHeader className="text-left pb-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
              {student.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <SheetTitle className="text-lg font-bold font-heading">
                {student.name}
              </SheetTitle>
              <SheetDescription className="text-xs font-mono">
                {student.email}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Subscription Status Card */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Subscription Status
              </span>
              <Badge
                variant={
                  isActive ? "default" : isPending ? "warning" : "secondary"
                }
                className={isActive ? "bg-success text-success-foreground" : ""}
              >
                {student.subscriptionStatus}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40">
              <span className="text-muted-foreground">Current Plan:</span>
              <span className="font-semibold font-mono">
                {student.plan !== "NONE" ? student.plan : "Free Tier"}
              </span>
            </div>
          </div>

          {/* Academic Profile */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Academic Information
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border/40">
                <GraduationCap className="size-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] text-muted-foreground">Grade Level</div>
                  <div className="font-semibold text-foreground truncate">
                    {student.gradeLevel || "Not Specified"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border/40">
                <School className="size-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] text-muted-foreground">High School</div>
                  <div className="font-semibold text-foreground truncate">
                    {student.school || "DepEd Public / Private High School"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border/40">
                <Calendar className="size-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] text-muted-foreground">Registered Date</div>
                  <div className="font-semibold text-foreground truncate">
                    {new Date(student.joinedAt).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage & Guardrails */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Learning Activity & Guardrails
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-card border border-border/40 text-center">
                <BookOpen className="size-4 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold font-mono">
                  {student.trialSubjectsCount} / 3
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Trial Subjects
                </div>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border/40 text-center">
                <Award className="size-4 text-emerald-500 mx-auto mb-1" />
                <div className="text-lg font-bold font-mono">
                  {student.quizAttemptsCount}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Quiz Drills
                </div>
              </div>
            </div>
          </div>

          {/* Admin Direct Actions */}
          <div className="space-y-3 pt-4 border-t border-border/40">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Administrative Actions
            </h4>
            <div className="flex flex-col gap-2">
              {isActive ? (
                <Button
                  variant="outline"
                  onClick={handleExpire}
                  disabled={updateSubscription.isPending}
                  className="rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10 text-xs w-full justify-center"
                >
                  <XCircle className="size-4 mr-1.5" />
                  <span>Expire Subscription</span>
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => handleActivate("ANNUAL")}
                    disabled={updateSubscription.isPending}
                    className="rounded-xl text-xs w-full justify-center gap-1.5"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Activate Annual Pass (₱{annualPrice.toLocaleString()})</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleActivate("MONTHLY")}
                    disabled={updateSubscription.isPending}
                    className="rounded-xl text-xs w-full justify-center gap-1.5"
                  >
                    <Clock className="size-4" />
                    <span>Activate Monthly Pass (₱{monthlyPrice.toLocaleString()})</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
