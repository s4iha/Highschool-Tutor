import { ensureSubjectEnrolledAction } from "@/features/curriculum/actions/curriculum.actions";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/auth/lib/session";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    trialSubject: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    subscription: {
      findFirst: jest.fn(),
    },
    adminConfig: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("@/features/auth/lib/session", () => ({
  getCurrentUser: jest.fn(),
}));

describe("Auto-Enrollment & Subject Tier Limit Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return enrolled false if user is an unauthenticated guest", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue(null);

    const res = await ensureSubjectEnrolledAction("g7-t1-math");
    expect(res.success).toBe(true);
    expect(res.enrolled).toBe(false);
  });

  it("should return enrolled true without creating a new record if already enrolled", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue({ id: "user-123" });
    (prisma.trialSubject.findUnique as jest.Mock).mockResolvedValue({
      id: "trial-1",
      userId: "user-123",
      subjectSlug: "g7-t1-math",
    });

    const res = await ensureSubjectEnrolledAction("g7-t1-math");
    expect(res.success).toBe(true);
    expect(res.enrolled).toBe(true);
    expect(prisma.trialSubject.create).not.toHaveBeenCalled();
  });

  it("should auto-enroll subject if free user has slots remaining", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue({ id: "user-123" });
    (prisma.trialSubject.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.subscription.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.trialSubject.findMany as jest.Mock).mockResolvedValue([
      { subjectSlug: "g7-t1-eng" },
    ]);
    (prisma.adminConfig.findFirst as jest.Mock).mockResolvedValue({ maxTrialSubjects: 3 });
    (prisma.trialSubject.create as jest.Mock).mockResolvedValue({
      id: "trial-2",
      userId: "user-123",
      subjectSlug: "g7-t1-math",
    });

    const res = await ensureSubjectEnrolledAction("g7-t1-math");
    expect(res.success).toBe(true);
    expect(res.enrolled).toBe(true);
    expect(prisma.trialSubject.create).toHaveBeenCalledWith({
      data: {
        userId: "user-123",
        subjectSlug: "g7-t1-math",
        subjectLabel: "Mathematics",
      },
    });
  });

  it("should block enrollment when a free user has reached the 3 trial subjects limit", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue({ id: "user-123" });
    (prisma.trialSubject.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.subscription.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.trialSubject.findMany as jest.Mock).mockResolvedValue([
      { subjectSlug: "g7-t1-eng" },
      { subjectSlug: "g7-t1-sci" },
      { subjectSlug: "g7-t1-math" },
    ]);
    (prisma.adminConfig.findFirst as jest.Mock).mockResolvedValue({ maxTrialSubjects: 3 });

    const res = await ensureSubjectEnrolledAction("g7-t1-fil");
    expect(res.success).toBe(false);
    expect(res.enrolled).toBe(false);
    expect(res.error).toContain("Free tier limit reached");
    expect(prisma.trialSubject.create).not.toHaveBeenCalled();
  });

  it("should allow enrollment beyond 3 subjects if user is an active subscriber", async () => {
    (getCurrentUser as jest.Mock).mockResolvedValue({ id: "user-premium" });
    (prisma.trialSubject.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.subscription.findFirst as jest.Mock).mockResolvedValue({
      id: "sub-1",
      userId: "user-premium",
      status: "ACTIVE",
    });
    (prisma.trialSubject.findMany as jest.Mock).mockResolvedValue([
      { subjectSlug: "g7-t1-eng" },
      { subjectSlug: "g7-t1-sci" },
      { subjectSlug: "g7-t1-math" },
      { subjectSlug: "g7-t1-fil" },
    ]);
    (prisma.adminConfig.findFirst as jest.Mock).mockResolvedValue({ maxTrialSubjects: 3 });
    (prisma.trialSubject.create as jest.Mock).mockResolvedValue({
      id: "trial-5",
      userId: "user-premium",
      subjectSlug: "g8-t1-math",
    });

    const res = await ensureSubjectEnrolledAction("g8-t1-math");
    expect(res.success).toBe(true);
    expect(res.enrolled).toBe(true);
    expect(prisma.trialSubject.create).toHaveBeenCalled();
  });
});
