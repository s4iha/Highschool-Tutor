import { isDisposableEmail, DISPOSABLE_EMAIL_DOMAINS } from "@/features/auth/utils/disposable-domains";

describe("Disposable Email Detection", () => {
  it("should contain at least 50 known temporary email domains in blocklist", () => {
    expect(DISPOSABLE_EMAIL_DOMAINS.size).toBeGreaterThanOrEqual(50);
  });

  it("should block common throwaway email addresses", () => {
    const disposableAddresses = [
      "user@mailinator.com",
      "test@10minutemail.com",
      "fake@guerrillamail.com",
      "anon@yopmail.com",
      "spam@trashmail.com",
      "student@temp-mail.org",
      "john@sharklasers.com",
      "throw@throwawaymail.com",
      "burner@dropmail.me",
    ];

    for (const email of disposableAddresses) {
      expect(isDisposableEmail(email)).toBe(true);
    }
  });

  it("should block case-insensitive disposable emails", () => {
    expect(isDisposableEmail("Student@MAILINATOR.COM")).toBe(true);
    expect(isDisposableEmail("Test@YopMail.Com ")).toBe(true);
  });

  it("should allow legitimate educational and personal email domains", () => {
    const legitimateEmails = [
      "juan.delacruz@gmail.com",
      "maria.santos@yahoo.com",
      "student@outlook.com",
      "teacher@deped.gov.ph",
      "student@up.edu.ph",
      "learner@ust.edu.ph",
      "stem.student@ateneo.edu",
      "highschool@dlsu.edu.ph",
    ];

    for (const email of legitimateEmails) {
      expect(isDisposableEmail(email)).toBe(false);
    }
  });

  it("should safely handle invalid or falsy email values", () => {
    expect(isDisposableEmail("")).toBe(false);
    expect(isDisposableEmail(null as unknown as string)).toBe(false);
    expect(isDisposableEmail(undefined as unknown as string)).toBe(false);
    expect(isDisposableEmail("invalid-email-without-at")).toBe(false);
    expect(isDisposableEmail("multiple@@domain.com")).toBe(false);
  });
});
