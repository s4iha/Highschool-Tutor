"use client";

import * as React from "react";
import {
  AnnouncementItem,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "../../hooks/useAdminPortal";
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

interface AnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement: AnnouncementItem | null;
}

function AnnouncementModalForm({
  announcement,
  onClose,
}: {
  announcement: AnnouncementItem | null;
  onClose: () => void;
}) {
  const [title, setTitle] = React.useState(announcement?.title || "");
  const [body, setBody] = React.useState(announcement?.body || "");
  const [type, setType] = React.useState<"INFO" | "WARNING" | "PROMO" | "MAINTENANCE">(
    announcement?.type || "INFO"
  );
  const [targetAudience, setTargetAudience] = React.useState<"ALL" | "PREMIUM" | "TRIAL">(
    announcement?.targetAudience || "ALL"
  );
  const [isActive, setIsActive] = React.useState(announcement?.isActive ?? true);
  const [error, setError] = React.useState("");

  const createMutation = useCreateAnnouncementMutation();
  const updateMutation = useUpdateAnnouncementMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (!body.trim() || body.length < 5) {
      setError("Body message must be at least 5 characters.");
      return;
    }

    if (announcement) {
      updateMutation.mutate(
        {
          id: announcement.id,
          data: {
            title: title.trim(),
            body: body.trim(),
            type,
            targetAudience,
            isActive,
            publishedAt: isActive ? new Date().toISOString() : null,
          },
        },
        {
          onSuccess: onClose,
        }
      );
    } else {
      createMutation.mutate(
        {
          title: title.trim(),
          body: body.trim(),
          type,
          targetAudience,
          isActive,
          publishedAt: isActive ? new Date().toISOString() : null,
        },
        {
          onSuccess: onClose,
        }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="text-base font-bold font-heading">
          {announcement ? "Edit Announcement" : "Create Platform Announcement"}
        </DialogTitle>
        <DialogDescription className="text-xs">
          Broadcast notifications, promos, or maintenance notices to enrolled high school students.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-4">
        {error && (
          <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Announcement Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Midterm Practice Exam Window Open"
            maxLength={120}
            className="text-xs rounded-xl"
          />
        </div>

        {/* Type & Audience Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Notice Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="INFO">Information</option>
              <option value="WARNING">Warning</option>
              <option value="PROMO">Promotion / Discount</option>
              <option value="MAINTENANCE">Scheduled Maintenance</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Target Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as typeof targetAudience)}
              className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All Students</option>
              <option value="PREMIUM">Premium Pass Holders</option>
              <option value="TRIAL">Free Tier Students</option>
            </select>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Notice Content
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the full announcement message here..."
            rows={4}
            className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-foreground">
              Publish Immediately
            </div>
            <div className="text-[11px] text-muted-foreground">
              Visible to students on their dashboard banner.
            </div>
          </div>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="size-4 rounded text-primary focus:ring-primary"
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border/40">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="rounded-xl text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="rounded-xl text-xs"
        >
          {isPending
            ? "Saving..."
            : announcement
            ? "Update Announcement"
            : "Publish Announcement"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AnnouncementModal({
  open,
  onOpenChange,
  announcement,
}: AnnouncementModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        {open && (
          <AnnouncementModalForm
            key={announcement?.id || "new"}
            announcement={announcement}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
