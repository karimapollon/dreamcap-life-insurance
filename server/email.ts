import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = "karim@dreamcap.financial";
const SENDER_NAME = "DreamCap Financial";

/**
 * Get the SMTP transporter.
 */
function getTransporter() {
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

  return null;
}

// ─── Shared HTML helpers ───────────────────────────────────────────────

const COLORS = {
  primary: "#1B5E9E",
  primaryDark: "#0F3A5F",
  gold: "#D4AF37",
  goldLight: "#F4C430",
  bg: "#f8f9fa",
  white: "#ffffff",
  text: "#333333",
  textLight: "#666666",
  border: "#e5e7eb",
  sectionBg: "#f0f4f8",
};

function row(label: string, value: string | number | null | undefined, fallback = "—"): string {
  const display = value != null && value !== "" ? String(value) : fallback;
  return `
    <tr>
      <td style="padding: 8px 12px; font-size: 13px; color: ${COLORS.textLight}; white-space: nowrap; vertical-align: top; border-bottom: 1px solid ${COLORS.border};">${label}</td>
      <td style="padding: 8px 12px; font-size: 13px; color: ${COLORS.text}; font-weight: 500; border-bottom: 1px solid ${COLORS.border};">${display}</td>
    </tr>`;
}

function sectionHeader(title: string, emoji: string): string {
  return `
    <tr>
      <td colspan="2" style="padding: 16px 12px 8px 12px; font-size: 14px; font-weight: 700; color: ${COLORS.primary}; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid ${COLORS.gold};">
        ${emoji} ${title}
      </td>
    </tr>`;
}

function wrapEmail(subject: string, badgeText: string, badgeColor: string, tableRows: string, footerNote: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.bg}; padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark}); padding: 28px 32px; border-radius: 12px 12px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 22px; color: ${COLORS.gold}; font-weight: 700; letter-spacing: 0.3px;">DreamCap Financial<sup style="font-size: 10px;">®</sup></h1>
                    <p style="margin: 6px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px;">Lead Management System</p>
                  </td>
                  <td align="right" valign="top">
                    <span style="display: inline-block; background: ${badgeColor}; color: white; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">${badgeText}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Subject line -->
          <tr>
            <td style="background: ${COLORS.white}; padding: 20px 32px 12px 32px; border-left: 1px solid ${COLORS.border}; border-right: 1px solid ${COLORS.border};">
              <h2 style="margin: 0; font-size: 18px; color: ${COLORS.text}; font-weight: 600;">${subject}</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: ${COLORS.textLight};">Received on ${new Date().toLocaleString("en-US", { timeZone: "America/New_York", weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })} EST</p>
            </td>
          </tr>

          <!-- Data table -->
          <tr>
            <td style="background: ${COLORS.white}; padding: 0 32px 24px 32px; border-left: 1px solid ${COLORS.border}; border-right: 1px solid ${COLORS.border};">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid ${COLORS.border}; border-radius: 8px; overflow: hidden;">
                ${tableRows}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: ${COLORS.sectionBg}; padding: 20px 32px; border: 1px solid ${COLORS.border}; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="margin: 0; font-size: 12px; color: ${COLORS.textLight}; line-height: 1.6;">
                ${footerNote}
              </p>
              <p style="margin: 10px 0 0 0; font-size: 11px; color: #9ca3af;">
                This is an automated notification from the DreamCap Financial lead generation system. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Lead notification email ───────────────────────────────────────────

export interface LeadEmailData {
  firstName: string;
  email: string;
  phone: string;
  age?: number | null;
  gender?: string | null;
  tobacco?: string | null;
  policyType?: string | null;
  termLength?: number | null;
  coverageAmount?: number | null;
  monthlyPremium?: string | null;
  leadId?: number | null;
}

function formatPolicyLabel(policyType?: string | null, termLength?: number | null): string {
  if (policyType === "term") return `Term Life (${termLength || 20}-Year)`;
  if (policyType === "whole") return "Whole Life";
  if (policyType === "final" || policyType === "finalExpense") return "Final Expense";
  return policyType || "Not specified";
}

export function buildLeadEmailHtml(data: LeadEmailData): string {
  const policyLabel = formatPolicyLabel(data.policyType, data.termLength);
  const coverage = data.coverageAmount ? `$${data.coverageAmount.toLocaleString()}` : "—";

  const rows = [
    sectionHeader("Contact Information", "📋"),
    row("Full Name", data.firstName),
    row("Email Address", data.email),
    row("Phone Number", data.phone),
    sectionHeader("Quote Details", "💰"),
    row("Age", data.age),
    row("Gender", data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1) : null),
    row("Tobacco Use", data.tobacco ? data.tobacco.charAt(0).toUpperCase() + data.tobacco.slice(1) : null),
    row("Policy Type", policyLabel),
    row("Coverage Amount", coverage),
    row("Est. Monthly Premium", data.monthlyPremium),
    sectionHeader("System Info", "🔖"),
    row("Lead ID", data.leadId),
  ].join("");

  return wrapEmail(
    `New Lead: ${data.firstName}`,
    "New Lead",
    "#22c55e",
    rows,
    `<strong>Action Required:</strong> Please follow up with this lead within 24 hours. The client has completed the quote funnel and is expecting a call from a licensed advisor.`
  );
}

export function buildLeadPlainText(data: LeadEmailData): string {
  const policyLabel = formatPolicyLabel(data.policyType, data.termLength);
  const coverage = data.coverageAmount ? `$${data.coverageAmount.toLocaleString()}` : "N/A";
  return `
NEW LEAD — DreamCap Financial
==============================

CONTACT INFORMATION
  Name:           ${data.firstName}
  Email:          ${data.email}
  Phone:          ${data.phone}

QUOTE DETAILS
  Age:            ${data.age || "N/A"}
  Gender:         ${data.gender || "N/A"}
  Tobacco Use:    ${data.tobacco || "No"}
  Policy Type:    ${policyLabel}
  Coverage:       ${coverage}
  Est. Premium:   ${data.monthlyPremium || "N/A"}

SYSTEM
  Lead ID:        ${data.leadId || "N/A"}
  Submitted:      ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EST

Please follow up within 24 hours.
  `.trim();
}

// ─── Application notification email ────────────────────────────────────

export interface ApplicationEmailData {
  leadId: number;
  firstName?: string | null;
  email?: string | null;
  phone?: string | null;
  policyType?: string | null;
  coverageAmount?: number | null;
  monthlyPremium?: string | null;
  termLength?: number | null;
  fullLegalName?: string | null;
  dateOfBirth?: string | null;
  ssn?: string | null;
  occupation?: string | null;
  annualIncome?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  heightFt?: number | null;
  heightIn?: number | null;
  weight?: number | null;
  medicalConditions?: string | null;
  medications?: string | null;
  familyHistory?: string | null;
  hospitalized?: string | null;
  dui?: string | null;
  primaryBeneficiary?: string | null;
  beneficiaryRelationship?: string | null;
  contingentBeneficiary?: string | null;
  additionalNotes?: string | null;
  applicationId?: number | null;
}

export function buildApplicationEmailHtml(data: ApplicationEmailData): string {
  const policyLabel = formatPolicyLabel(data.policyType, data.termLength);
  const coverage = data.coverageAmount ? `$${data.coverageAmount.toLocaleString()}` : "—";
  const name = data.fullLegalName || data.firstName || "Client";
  const address = [data.streetAddress, data.city, data.state, data.zipCode].filter(Boolean).join(", ");
  const height = data.heightFt ? `${data.heightFt}'${data.heightIn || 0}"` : "—";

  const rows = [
    // Contact
    sectionHeader("Contact Information", "📋"),
    row("Full Name", data.firstName),
    row("Email Address", data.email),
    row("Phone Number", data.phone),

    // Policy
    sectionHeader("Policy Details", "💰"),
    row("Policy Type", policyLabel),
    row("Coverage Amount", coverage),
    row("Est. Monthly Premium", data.monthlyPremium),

    // Personal
    sectionHeader("Personal Information", "👤"),
    row("Full Legal Name", data.fullLegalName),
    row("Date of Birth", data.dateOfBirth),
    row("Social Security Number", data.ssn || "Not provided"),
    row("Occupation", data.occupation),
    row("Annual Income", data.annualIncome),

    // Address
    sectionHeader("Address", "🏠"),
    row("Street Address", data.streetAddress),
    row("City", data.city),
    row("State", data.state),
    row("ZIP Code", data.zipCode),

    // Health
    sectionHeader("Health Information", "🏥"),
    row("Height", height),
    row("Weight", data.weight ? `${data.weight} lbs` : null),
    row("Medical Conditions", data.medicalConditions || "None reported"),
    row("Current Medications", data.medications || "None reported"),
    row("Family Medical History", data.familyHistory || "None reported"),
    row("Hospitalized (past 5 yrs)", data.hospitalized),
    row("DUI/DWI (past 5 yrs)", data.dui),

    // Beneficiary
    sectionHeader("Beneficiary Information", "👨‍👩‍👧‍👦"),
    row("Primary Beneficiary", data.primaryBeneficiary),
    row("Relationship", data.beneficiaryRelationship),
    row("Contingent Beneficiary", data.contingentBeneficiary || "Not specified"),

    // Notes
    ...(data.additionalNotes ? [
      sectionHeader("Additional Notes", "📝"),
      `<tr><td colspan="2" style="padding: 12px; font-size: 13px; color: ${COLORS.text}; line-height: 1.6; border-bottom: 1px solid ${COLORS.border};">${data.additionalNotes}</td></tr>`,
    ] : []),

    // System
    sectionHeader("System Info", "🔖"),
    row("Application ID", data.applicationId),
    row("Lead ID", data.leadId),
  ].join("");

  return wrapEmail(
    `Full Application: ${name}`,
    "Full Application",
    "#f59e0b",
    rows,
    `<strong>Action Required:</strong> This client has submitted a complete application with all personal details including SSN. Please review all information carefully and begin the policy underwriting process.`
  );
}

export function buildApplicationPlainText(data: ApplicationEmailData): string {
  const policyLabel = formatPolicyLabel(data.policyType, data.termLength);
  const coverage = data.coverageAmount ? `$${data.coverageAmount.toLocaleString()}` : "N/A";
  const name = data.fullLegalName || data.firstName || "Client";
  const address = [data.streetAddress, data.city, data.state, data.zipCode].filter(Boolean).join(", ");
  const height = data.heightFt ? `${data.heightFt}'${data.heightIn || 0}"` : "N/A";

  return `
FULL APPLICATION — DreamCap Financial
=======================================

CONTACT INFORMATION
  Name:               ${data.firstName || "N/A"}
  Email:              ${data.email || "N/A"}
  Phone:              ${data.phone || "N/A"}

POLICY DETAILS
  Policy Type:        ${policyLabel}
  Coverage:           ${coverage}
  Est. Premium:       ${data.monthlyPremium || "N/A"}

PERSONAL INFORMATION
  Legal Name:         ${data.fullLegalName || "N/A"}
  Date of Birth:      ${data.dateOfBirth || "N/A"}
  SSN:                ${data.ssn || "Not provided"}
  Occupation:         ${data.occupation || "N/A"}
  Annual Income:      ${data.annualIncome || "N/A"}

ADDRESS
  Full Address:       ${address || "N/A"}

HEALTH INFORMATION
  Height:             ${height}
  Weight:             ${data.weight ? `${data.weight} lbs` : "N/A"}
  Medical Conditions: ${data.medicalConditions || "None reported"}
  Medications:        ${data.medications || "None reported"}
  Family History:     ${data.familyHistory || "None reported"}
  Hospitalized (5yr): ${data.hospitalized || "N/A"}
  DUI/DWI (5yr):      ${data.dui || "N/A"}

BENEFICIARY
  Primary:            ${data.primaryBeneficiary || "N/A"} (${data.beneficiaryRelationship || "N/A"})
  Contingent:         ${data.contingentBeneficiary || "Not specified"}
${data.additionalNotes ? `\nADDITIONAL NOTES\n  ${data.additionalNotes}` : ""}

SYSTEM
  Application ID:     ${data.applicationId || "N/A"}
  Lead ID:            ${data.leadId}
  Submitted:          ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EST

Please review and begin the underwriting process.
  `.trim();
}

// ─── Send functions ────────────────────────────────────────────────────

/**
 * Send a lead notification email with professional HTML formatting
 */
export async function sendLeadNotificationEmail(data: LeadEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email] No SMTP/email service configured. Lead notification email not sent.");
    console.warn("[Email] Set SMTP_HOST/SMTP_USER/SMTP_PASS or RESEND_API_KEY to enable email delivery.");
    return false;
  }

  const fromAddress = process.env.SMTP_FROM || process.env.RESEND_FROM || "noreply@dreamcap.financial";
  const subject = `New Lead: ${data.firstName} — ${data.email}`;

  try {
    await transporter.sendMail({
      from: `"${SENDER_NAME}" <${fromAddress}>`,
      to: RECIPIENT_EMAIL,
      subject,
      text: buildLeadPlainText(data),
      html: buildLeadEmailHtml(data),
    });
    console.log(`[Email] Lead notification sent to ${RECIPIENT_EMAIL}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send lead notification:", error);
    return false;
  }
}

/**
 * Send an application notification email with professional HTML formatting
 */
export async function sendApplicationNotificationEmail(data: ApplicationEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email] No SMTP/email service configured. Application notification email not sent.");
    console.warn("[Email] Set SMTP_HOST/SMTP_USER/SMTP_PASS or RESEND_API_KEY to enable email delivery.");
    return false;
  }

  const fromAddress = process.env.SMTP_FROM || process.env.RESEND_FROM || "noreply@dreamcap.financial";
  const name = data.fullLegalName || data.firstName || "Client";
  const subject = `Full Application: ${name} — ${data.email || "No email"}`;

  try {
    await transporter.sendMail({
      from: `"${SENDER_NAME}" <${fromAddress}>`,
      to: RECIPIENT_EMAIL,
      subject,
      text: buildApplicationPlainText(data),
      html: buildApplicationEmailHtml(data),
    });
    console.log(`[Email] Application notification sent to ${RECIPIENT_EMAIL}`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send application notification:", error);
    return false;
  }
}

/**
 * @deprecated Use sendLeadNotificationEmail or sendApplicationNotificationEmail instead
 */
export async function sendLeadEmail(subject: string, textContent: string): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email] No SMTP/email service configured.");
    return false;
  }
  const fromAddress = process.env.SMTP_FROM || process.env.RESEND_FROM || "noreply@dreamcap.financial";
  try {
    await transporter.sendMail({
      from: `"${SENDER_NAME}" <${fromAddress}>`,
      to: RECIPIENT_EMAIL,
      subject,
      text: textContent,
    });
    return true;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}
