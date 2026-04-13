import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = "karim@dreamcap.financial";
const SENDER_NAME = "DreamCap Financial";

/**
 * Get the SMTP transporter.
 * 
 * Supports configuration via environment variables:
 * - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS for custom SMTP
 * - RESEND_API_KEY for Resend email service
 * 
 * Falls back to a direct-send approach if no SMTP is configured.
 */
function getTransporter() {
  // Option 1: Custom SMTP configuration
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Option 2: Resend API (uses SMTP interface)
  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });
  }

  // No email transport configured
  return null;
}

/**
 * Send a lead notification email to karim@dreamcap.financial
 */
export async function sendLeadEmail(subject: string, textContent: string): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn("[Email] No SMTP/email service configured. Lead notification email not sent.");
    console.warn("[Email] Set SMTP_HOST/SMTP_USER/SMTP_PASS or RESEND_API_KEY to enable email delivery.");
    return false;
  }

  const fromAddress = process.env.SMTP_FROM || process.env.RESEND_FROM || "noreply@dreamcap.financial";

  try {
    await transporter.sendMail({
      from: `"${SENDER_NAME}" <${fromAddress}>`,
      to: RECIPIENT_EMAIL,
      subject,
      text: textContent,
      html: formatEmailHtml(subject, textContent),
    });
    console.log(`[Email] Lead notification sent to ${RECIPIENT_EMAIL}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send lead notification:", error);
    return false;
  }
}

/**
 * Format plain text content into a simple HTML email
 */
function formatEmailHtml(subject: string, textContent: string): string {
  const lines = textContent.split("\n").map((line) => {
    if (line.startsWith("•")) {
      return `<li style="margin: 4px 0; color: #333;">${line.replace("• ", "")}</li>`;
    }
    if (line.includes("---")) {
      return `<hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />`;
    }
    if (line.trim() === "") {
      return "<br />";
    }
    // Section headers (all caps or ending with colon)
    if (line.endsWith(":") || line === line.toUpperCase()) {
      return `<h3 style="color: #1B5E9E; margin: 16px 0 8px 0; font-size: 14px; font-weight: 600;">${line}</h3>`;
    }
    return `<p style="margin: 2px 0; color: #333; font-size: 14px;">${line}</p>`;
  });

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #1B5E9E, #0F3A5F); padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 20px;">DreamCap Financial</h1>
        <h2 style="color: white; margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">${subject}</h2>
      </div>
      <div style="background: white; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        ${lines.join("\n")}
      </div>
      <p style="text-align: center; color: #9ca3af; font-size: 11px; margin-top: 16px;">
        This is an automated notification from the DreamCap Financial lead generation funnel.
      </p>
    </div>
  `;
}
