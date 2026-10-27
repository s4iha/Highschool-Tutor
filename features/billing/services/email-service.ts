/**
 * Modular Transactional Email Service
 * 
 * Provides automated email delivery for trial expiration notices and billing reminders.
 * In production with RESEND_API_KEY set, it delivers via Resend HTTP API.
 * In local/dev environments without an API key, it falls back gracefully to a console logger.
 */

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface TrialReminderEmailParams {
  recipientEmail: string;
  recipientName?: string;
  daysRemaining: number;
  upgradeUrl?: string;
}

const DEFAULT_FROM = process.env.EMAIL_FROM || "HighSchool Tutor <notifications@highschooltutor.ph>";

/**
 * Sends a generic transactional email using Resend API or dev console logger.
 */
export async function sendTransactionalEmail(payload: SendEmailPayload): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = payload.from || DEFAULT_FROM;

  // Fallback to development logger if no API key configured
  if (!apiKey || apiKey.trim() === "") {
    const mockId = `mock-email-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    console.log(`[EmailService:MockDelivery] Message dispatched to ${payload.to}`);
    console.log(`  Subject: ${payload.subject}`);
    console.log(`  From: ${from}`);
    console.log(`  Mock Message ID: ${mockId}`);
    return {
      success: true,
      messageId: mockId,
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text || payload.subject,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.message || `HTTP ${response.status} ${response.statusText}`;
      console.error("[EmailService:ResendError]", errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }

    return {
      success: true,
      messageId: data?.id || `resend-${Date.now()}`,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Network error dispatching email";
    console.error("[EmailService:Exception]", errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * Dispatches a formatted 7-day trial expiration reminder notice.
 */
export async function sendTrialReminderEmail(params: TrialReminderEmailParams): Promise<EmailSendResult> {
  const { recipientEmail, recipientName, daysRemaining, upgradeUrl = "https://highschooltutor.ph/pricing" } = params;
  const displayName = recipientName?.trim() || "High School Scholar";

  const subject = `Your HighSchool Tutor Trial Ends in ${daysRemaining} Days — Keep Your Unlimited AI Tutoring`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 24px; margin: 0;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="background-color: #047857; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">HighSchool Tutor</h1>
            <p style="color: #a7f3d0; margin: 6px 0 0; font-size: 13px;">Philippine DepEd K-12 MATATAG AI Tutoring</p>
          </div>
          
          <div style="padding: 32px 28px;">
            <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 0;">Hello, ${displayName}!</h2>
            
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              We hope you are mastering your lessons and acing your practice quizzes! This is a friendly reminder that your 
              <strong>30-Day Free Trial</strong> will conclude in exactly <strong>${daysRemaining} days</strong>.
            </p>

            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 24px 0;">
              <h3 style="font-size: 14px; font-weight: 700; color: #166534; margin: 0 0 8px;">What happens when your trial ends?</h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #166534; line-height: 1.6;">
                <li>Lesson reading materials and all curriculum modules will be locked.</li>
                <li>Exam Mode, Study Mode, and practice quizzes will require an active pass.</li>
                <li>Unlimited Socratic AI Tutoring in 10 Philippine dialects will pause.</li>
              </ul>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              To ensure uninterrupted access throughout your entire school year, you can upgrade to our 
              <strong>Annual Unlimited Pass</strong> and save <strong>₱1,089</strong> compared to monthly billing.
            </p>

            <div style="text-align: center; margin: 32px 0 24px;">
              <a href="${upgradeUrl}" style="background-color: #047857; color: #ffffff; padding: 12px 32px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(4, 120, 87, 0.2);">
                Upgrade Your Pass Now &rarr;
              </a>
            </div>

            <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
              Have questions? Reply directly to this email or reach our support team anytime.
            </p>
          </div>

          <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
            &copy; ${new Date().getFullYear()} HighSchool Tutor. All rights reserved.<br />
            DepEd Order No. 015, s. 2026 MATATAG Aligned Learning.
          </div>
        </div>
      </body>
    </html>
  `;

  return sendTransactionalEmail({
    to: recipientEmail,
    subject,
    html,
    text: `Hello ${displayName},\n\nYour 30-Day Free Trial for HighSchool Tutor will expire in ${daysRemaining} days.\n\nTo keep full access to all DepEd MATATAG lessons, quizzes, and AI tutoring, upgrade your pass at: ${upgradeUrl}\n\nThank you,\nHighSchool Tutor Team`,
  });
}
