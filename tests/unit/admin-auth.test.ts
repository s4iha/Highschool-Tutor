import bcrypt from "bcryptjs";
import { AppRole } from "@prisma/client";

describe("Admin Authentication & Role Verification", () => {
  const defaultAdminPassword = "Admin2026!";

  it("should successfully verify password with bcrypt", async () => {
    const passwordHash = await bcrypt.hash(defaultAdminPassword, 10);
    const isValid = await bcrypt.compare(defaultAdminPassword, passwordHash);
    expect(isValid).toBe(true);

    const isInvalid = await bcrypt.compare("WrongPassword", passwordHash);
    expect(isInvalid).toBe(false);
  });

  it("should verify admin role enum exists and equals ADMIN", () => {
    expect(AppRole.ADMIN).toBe("ADMIN");
    expect(AppRole.STUDENT).toBe("STUDENT");
  });

  it("should validate that admin credentials meet security length standards", () => {
    expect(defaultAdminPassword.length).toBeGreaterThanOrEqual(8);
    expect(/[A-Z]/.test(defaultAdminPassword)).toBe(true);
    expect(/[0-9]/.test(defaultAdminPassword)).toBe(true);
    expect(/[^A-Za-z0-9]/.test(defaultAdminPassword)).toBe(true);
  });

  describe("Role Priority Resolution", () => {
    const resolveRole = (roles?: { role: string }[]) => {
      const isAdmin = roles?.some((r) => r.role === "ADMIN");
      return isAdmin ? "ADMIN" : roles?.[0]?.role || "STUDENT";
    };

    it("should prioritize ADMIN role when user has both STUDENT and ADMIN roles", () => {
      const roles = [{ role: "STUDENT" }, { role: "ADMIN" }];
      expect(resolveRole(roles)).toBe("ADMIN");
    });

    it("should resolve ADMIN when user has single ADMIN role", () => {
      const roles = [{ role: "ADMIN" }];
      expect(resolveRole(roles)).toBe("ADMIN");
    });

    it("should resolve STUDENT when user only has STUDENT role", () => {
      const roles = [{ role: "STUDENT" }];
      expect(resolveRole(roles)).toBe("STUDENT");
    });

    it("should default to STUDENT when user has empty roles", () => {
      expect(resolveRole([])).toBe("STUDENT");
      expect(resolveRole(undefined)).toBe("STUDENT");
    });
  });
});
