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
});
