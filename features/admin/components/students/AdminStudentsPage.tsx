"use client";

import * as React from "react";
import {
  Search,
  Filter,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  ArrowUpDown,
} from "lucide-react";
import {
  useAdminStudentsQuery,
  useUpdateSubscriptionMutation,
  StudentItem,
} from "../../hooks/useAdminPortal";
import { StudentDetailSheet } from "./StudentDetailSheet";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function AdminStudentsPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<"name" | "date" | "grade">("date");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [page, setPage] = React.useState(1);

  // Selected student for detail sheet
  const [selectedStudent, setSelectedStudent] = React.useState<StudentItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const {
    data: studentsData,
    isLoading: studentsLoading,
    refetch,
    isRefetching,
  } = useAdminStudentsQuery({
    page,
    search,
    status: statusFilter,
  });

  const updateSubscription = useUpdateSubscriptionMutation();

  const studentsList = studentsData?.students;

  // Client-side sorting on page items
  const sortedStudents = React.useMemo(() => {
    if (!studentsList) return [];
    const list = [...studentsList];

    return list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortBy === "grade") {
        cmp = (a.gradeLevel || "").localeCompare(b.gradeLevel || "");
      } else {
        cmp = new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [studentsList, sortBy, sortOrder]);

  const toggleSort = (field: "name" | "date" | "grade") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleOpenDetail = (student: StudentItem) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
            Enrolled & Subscribed Students
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Search students, track free tier guardrails, and grant or revoke subscription passes.
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
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search student by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 text-xs rounded-xl"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="size-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by Subscription Status"
              className="h-9 rounded-xl border border-input bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Active Subscribed</option>
              <option value="TRIAL">Free Trial Tier</option>
              <option value="PENDING">Pending Verification</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label="Sort By"
              className="h-9 rounded-xl border border-input bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date">Sort: Registration Date</option>
              <option value="name">Sort: Student Name</option>
              <option value="grade">Sort: Grade Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border/60">
              <tr>
                <th
                  onClick={() => toggleSort("name")}
                  className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Student & Email</span>
                    {sortBy === "name" && (
                      <span className="text-[10px]">{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("grade")}
                  className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>School & Grade</span>
                    {sortBy === "grade" && (
                      <span className="text-[10px]">{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </div>
                </th>
                <th className="py-3.5 px-4">Subscription Plan</th>
                <th className="py-3.5 px-4 text-center">Trial Subjects</th>
                <th className="py-3.5 px-4 text-center">Quiz Drills</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {studentsLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-4 px-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : sortedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No students found matching your search.
                  </td>
                </tr>
              ) : (
                sortedStudents.map((student) => {
                  const isActive = student.subscriptionStatus === "ACTIVE";
                  const isPending = student.subscriptionStatus === "PENDING";

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground">{student.name}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {student.email}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <GraduationCap className="size-3.5 text-primary shrink-0" />
                          <span>{student.gradeLevel || "Grade 7–12"}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                          {student.school || "DepEd High School"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={
                              isActive
                                ? "default"
                                : isPending
                                ? "warning"
                                : "secondary"
                            }
                            className={`text-[10px] ${
                              isActive ? "bg-success text-success-foreground hover:bg-success" : ""
                            }`}
                          >
                            {student.subscriptionStatus}
                          </Badge>
                          {student.plan !== "NONE" && (
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              ({student.plan})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-medium">
                          {student.trialSubjectsCount} / 3
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        {student.quizAttemptsCount}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetail(student)}
                            className="h-7 px-2.5 text-[11px] rounded-lg gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
                            title="View student profile"
                          >
                            <Eye className="size-3.5" />
                            <span>Details</span>
                          </Button>

                          {isActive ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateSubscription.mutate({
                                  userId: student.id,
                                  status: "EXPIRED",
                                })
                              }
                              disabled={updateSubscription.isPending}
                              className="h-7 min-w-[72px] text-[11px] rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive justify-center cursor-pointer"
                            >
                              Expire
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateSubscription.mutate({
                                  userId: student.id,
                                  status: "ACTIVE",
                                  plan: "ANNUAL",
                                })
                              }
                              disabled={updateSubscription.isPending}
                              className="h-7 min-w-[72px] text-[11px] rounded-lg text-primary border-primary/30 hover:bg-primary/10 hover:text-primary justify-center cursor-pointer"
                            >
                              <span>Activate</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {studentsData?.pagination && studentsData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-muted/20">
            <div className="text-xs text-muted-foreground">
              Showing page <strong className="text-foreground">{studentsData.pagination.page}</strong> of{" "}
              <strong className="text-foreground">{studentsData.pagination.totalPages}</strong> (
              {studentsData.pagination.total} students)
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-7 px-2.5 rounded-lg text-xs gap-1"
              >
                <ChevronLeft className="size-3.5" />
                <span>Prev</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) =>
                    Math.min(studentsData.pagination.totalPages, p + 1)
                  )
                }
                disabled={page >= studentsData.pagination.totalPages}
                className="h-7 px-2.5 rounded-lg text-xs gap-1"
              >
                <span>Next</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Student Detail Drawer */}
      <StudentDetailSheet
        student={selectedStudent}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
