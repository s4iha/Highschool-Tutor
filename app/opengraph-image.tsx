import { ImageResponse } from "next/og";

export const alt = "HighSchool Tutor DepEd K-12 AI Learning Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #070D1E 0%, #0F172A 50%, #1E293B 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#FFFFFF",
          border: "2px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Brand Logo & Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
              }}
            >
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: "900",
                  color: "#FFFFFF",
                }}
              >
                H
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  letterSpacing: "-0.5px",
                  color: "#FFFFFF",
                }}
              >
                HighSchool Tutor
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#94A3B8",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Philippine K-12 Classroom Study Companion
              </span>
            </div>
          </div>

          {/* DepEd Standards Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: "9999px",
                background: "rgba(56, 189, 248, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                color: "#38BDF8",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "0.2px",
              }}
            >
              DepEd MATATAG
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: "9999px",
                background: "rgba(37, 99, 235, 0.16)",
                border: "1px solid rgba(37, 99, 235, 0.4)",
                color: "#60A5FA",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "0.2px",
              }}
            >
              DO 015 s. 2026
            </div>
          </div>
        </div>

        {/* Central Headline & Value Proposition */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "960px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: "900",
              lineHeight: "1.1",
              letterSpacing: "-1.5px",
              color: "#F8FAFC",
            }}
          >
            DepEd K-12 AI Learning Platform
          </div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: "400",
              lineHeight: "1.5",
              color: "#CBD5E1",
            }}
          >
            Master Junior and Senior High School subjects with 130+ DepEd-aligned modules,
            24 practice quizzes per lesson, and real-time Google Gemini Socratic tutoring.
          </div>
        </div>

        {/* Bottom Feature Tags & Canonical URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          {/* Feature Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontSize: "13px",
                fontWeight: "600",
                color: "#E2E8F0",
              }}
            >
              Grades 7–12
            </div>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontSize: "13px",
                fontWeight: "600",
                color: "#E2E8F0",
              }}
            >
              130+ Core & Applied Subjects
            </div>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontSize: "13px",
                fontWeight: "600",
                color: "#E2E8F0",
              }}
            >
              Socratic &apos;Bakit Mali Ito?&apos; AI
            </div>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontSize: "13px",
                fontWeight: "600",
                color: "#E2E8F0",
              }}
            >
              Multi-Dialect Support
            </div>
          </div>

          {/* Canonical Domain */}
          <div
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#38BDF8",
              letterSpacing: "0.5px",
            }}
          >
            highschool-tutor.sgws.tech
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
