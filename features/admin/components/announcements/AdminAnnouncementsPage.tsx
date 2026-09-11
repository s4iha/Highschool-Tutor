"use client";

import * as React from "react";
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Filter,
  AlertTriangle,
  Sparkles,
  Wrench,
  Info,
  RefreshCw,
} from "lucide-react";
import {
  useAdminAnnouncementsQuery,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  AnnouncementItem,
} from "../../hooks/useAdminPortal";
import { AnnouncementModal } from "./AnnouncementModal";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function AdminAnnouncementsPage() {
  const [typeFilter, setTypeFilter] = React.useState("ALL_TYPES");
  const [audienceFilter, setAudienceFilter] = React.useState("ALL_AUDIENCES");
  const [activeOnly, setActiveOnly] = React.useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = React.useState<AnnouncementItem | null>(null);

  const {
    data: announcements,
    isLoading,
    refetch,
    isRefetching,
  } = useAdminAnnouncementsQuery({
    type: typeFilter,
    audience: audienceFilter,
    activeOnly,
  });

  const updateMutation = useUpdateAnnouncementMutation();
  const deleteMutation = useDeleteAnnouncementMutation();

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: AnnouncementItem) => {
    setEditingAnnouncement(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete announcement "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (item: AnnouncementItem) => {
    updateMutation.mutate({
      id: item.id,
      data: {
        isActive: !item.isActive,
        publishedAt: !item.isActive ? new Date().toISOString() : null,
      },
    });
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "WARNING":
        return (
          <Badge variant="warning" className="text-[10px] gap-1">
            <AlertTriangle className="size-3" />
            <span>Warning</span>
          </Badge>
        );
      case "PROMO":
        return (
          <Badge className="text-[10px] gap-1 bg-purple-500/10 text-purple-600 border border-purple-500/20 hover:bg-purple-500/20">
            <Sparkles className="size-3" />
            <span>Promo</span>
          </Badge>
        );
      case "MAINTENANCE":
        return (
          <Badge variant="destructive" className="text-[10px] gap-1">
            <Wrench className="size-3" />
            <span>Maintenance</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px] gap-1">
            <Info className="size-3" />
            <span>Info</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 text-xs font-semibold border border-purple-500/20">
              <Megaphone className="size-3.5" />
              Notifications & Broadcasts
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">In-App Banners</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Platform Announcements
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Publish system-wide notifications, exam schedules, and promo alerts to high school students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-1.5 rounded-xl text-xs"
          >
            <RefreshCw className={`size-3.5 ${isRefetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={handleCreate}
            className="rounded-xl text-xs gap-1.5 font-semibold"
          >
            <Plus className="size-3.5" />
            <span>New Announcement</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/60">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <span>Filter by:</span>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by Notice Type"
            className="h-8 rounded-xl border border-input bg-card px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ALL_TYPES">All Types</option>
            <option value="INFO">Information</option>
            <option value="WARNING">Warning</option>
            <option value="PROMO">Promotion</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            aria-label="Filter by Target Audience"
            className="h-8 rounded-xl border border-input bg-card px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ALL_AUDIENCES">All Audiences</option>
            <option value="ALL">Public (All Users)</option>
            <option value="PREMIUM">Premium Pass Holders</option>
            <option value="TRIAL">Free Tier Users</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
            className="size-3.5 rounded text-primary focus:ring-primary"
          />
          <span>Active Banners Only</span>
        </label>
      </div>

      {/* Announcements Table */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border/60">
              <tr>
                <th className="py-3.5 px-4">Title & Notice</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Audience</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-4 px-4">
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : !announcements || announcements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="space-y-2">
                      <Megaphone className="size-8 mx-auto text-muted-foreground/50" />
                      <p className="text-xs">No announcements found matching the filters.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCreate}
                        className="rounded-xl text-xs gap-1"
                      >
                        <Plus className="size-3.5" />
                        <span>Create One Now</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-foreground truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1">
                        {item.body}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getTypeBadge(item.type)}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {item.targetAudience}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        disabled={updateMutation.isPending}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                          item.isActive
                            ? "bg-success/10 text-success border border-success/30 hover:bg-success/20"
                            : "bg-muted text-muted-foreground border border-border/60 hover:bg-muted/80"
                        }`}
                        title="Click to toggle active status"
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            item.isActive ? "bg-success" : "bg-muted-foreground"
                          }`}
                        />
                        <span>{item.isActive ? "Active" : "Draft"}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString("en-PH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          className="size-7 rounded-lg"
                          title="Edit announcement"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={deleteMutation.isPending}
                          className="size-7 rounded-lg text-destructive hover:text-destructive"
                          title="Delete announcement"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      <AnnouncementModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        announcement={editingAnnouncement}
      />
    </div>
  );
}
