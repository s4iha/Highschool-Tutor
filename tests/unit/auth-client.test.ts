import fs from "fs";
import path from "path";

describe("Better Auth Client Configuration (US9)", () => {
  const authClientPath = path.resolve(__dirname, "../../features/auth/lib/auth-client.ts");

  it("should not import or register sentinelClient from @better-auth/infra/client", () => {
    const content = fs.readFileSync(authClientPath, "utf-8");
    expect(content).not.toContain("sentinelClient");
    expect(content).not.toContain("@better-auth/infra");
  });

  it("should initialize createAuthClient with clean configuration", () => {
    const content = fs.readFileSync(authClientPath, "utf-8");
    expect(content).toContain("export const authClient = createAuthClient({});");
    expect(content).toContain("export const { signIn, signOut, signUp, useSession } = authClient;");
  });
});
