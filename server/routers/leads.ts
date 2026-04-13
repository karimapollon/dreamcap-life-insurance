import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { createLead, createApplication } from "../db";
import { notifyOwner } from "../_core/notification";
import { sendLeadEmail } from "../email";

/**
 * Helper to format policy type label for display
 */
function formatPolicyLabel(policyType?: string, termLength?: number): string {
  if (policyType === "term") return `Term Life (${termLength || 20}-Year)`;
  if (policyType === "whole") return "Whole Life";
  if (policyType === "final" || policyType === "finalExpense") return "Final Expense";
  return policyType || "Not specified";
}

export const leadsRouter = router({
  /**
   * Submit a new lead from the lead capture form
   */
  submitLead: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        age: z.number().optional(),
        gender: z.string().optional(),
        tobacco: z.string().optional(),
        policyType: z.string().optional(),
        termLength: z.number().optional(),
        coverageAmount: z.number().optional(),
        monthlyPremium: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Save lead to database
      const leadId = await createLead({
        firstName: input.firstName,
        email: input.email,
        phone: input.phone,
        age: input.age ?? null,
        gender: input.gender ?? null,
        tobacco: input.tobacco ?? null,
        policyType: input.policyType ?? null,
        termLength: input.termLength ?? null,
        coverageAmount: input.coverageAmount ?? null,
        monthlyPremium: input.monthlyPremium ?? null,
      });

      const policyLabel = formatPolicyLabel(input.policyType, input.termLength);
      const coverageFormatted = input.coverageAmount
        ? `$${input.coverageAmount.toLocaleString()}`
        : "Not specified";

      const emailSubject = `New Lead: ${input.firstName} — ${input.email}`;
      const emailContent = `
NEW LEAD SUBMITTED — DreamCap Financial

Contact Information:
• Name: ${input.firstName}
• Email: ${input.email}
• Phone: ${input.phone}

Quote Details:
• Age: ${input.age || "Not specified"}
• Gender: ${input.gender || "Not specified"}
• Tobacco Use: ${input.tobacco || "No"}
• Policy Type: ${policyLabel}
• Coverage Amount: ${coverageFormatted}
• Estimated Monthly Premium: ${input.monthlyPremium || "Not calculated"}

Lead ID: ${leadId || "N/A"}
Submitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EST

---
This lead was submitted through the DreamCap Financial life insurance quote funnel.
Please follow up within 24 hours.
      `.trim();

      // Send notifications in parallel (don't block on either)
      const notificationPromises: Promise<unknown>[] = [];

      // 1. Send via Manus owner notification (built-in email + in-app)
      notificationPromises.push(
        notifyOwner({ title: emailSubject, content: emailContent }).catch((error) => {
          console.error("[Leads] Failed to send owner notification:", error);
        })
      );

      // 2. Send direct email to karim@dreamcap.financial via SMTP
      notificationPromises.push(
        sendLeadEmail(emailSubject, emailContent).catch((error) => {
          console.error("[Leads] Failed to send direct email:", error);
        })
      );

      // Fire and forget — don't block the lead submission response
      Promise.allSettled(notificationPromises).then((results) => {
        const ownerResult = results[0];
        const emailResult = results[1];
        console.log(
          `[Leads] Notification results — Owner: ${ownerResult.status}, Email: ${emailResult.status}`
        );
      });

      return {
        success: true,
        leadId: leadId,
      };
    }),

  /**
   * Submit extended application data from the dashboard
   */
  submitApplication: publicProcedure
    .input(
      z.object({
        leadId: z.number(),
        // Lead info for context
        firstName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        policyType: z.string().optional(),
        coverageAmount: z.number().optional(),
        monthlyPremium: z.string().optional(),
        termLength: z.number().optional(),
        // Extended application fields
        fullLegalName: z.string().optional(),
        dateOfBirth: z.string().optional(),
        ssn: z.string().optional(),
        occupation: z.string().optional(),
        annualIncome: z.string().optional(),
        streetAddress: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        heightFt: z.number().optional(),
        heightIn: z.number().optional(),
        weight: z.number().optional(),
        medicalConditions: z.string().optional(),
        medications: z.string().optional(),
        familyHistory: z.string().optional(),
        hospitalized: z.string().optional(),
        dui: z.string().optional(),
        primaryBeneficiary: z.string().optional(),
        beneficiaryRelationship: z.string().optional(),
        contingentBeneficiary: z.string().optional(),
        additionalNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Save application to database
      const appId = await createApplication({
        leadId: input.leadId,
        fullLegalName: input.fullLegalName ?? null,
        dateOfBirth: input.dateOfBirth ?? null,
        ssn: input.ssn ?? null,
        occupation: input.occupation ?? null,
        annualIncome: input.annualIncome ?? null,
        streetAddress: input.streetAddress ?? null,
        city: input.city ?? null,
        state: input.state ?? null,
        zipCode: input.zipCode ?? null,
        heightFt: input.heightFt ?? null,
        heightIn: input.heightIn ?? null,
        weight: input.weight ?? null,
        medicalConditions: input.medicalConditions ?? null,
        medications: input.medications ?? null,
        familyHistory: input.familyHistory ?? null,
        hospitalized: input.hospitalized ?? null,
        dui: input.dui ?? null,
        primaryBeneficiary: input.primaryBeneficiary ?? null,
        beneficiaryRelationship: input.beneficiaryRelationship ?? null,
        contingentBeneficiary: input.contingentBeneficiary ?? null,
        additionalNotes: input.additionalNotes ?? null,
      });

      // Build detailed notification for extended application
      const policyLabel = formatPolicyLabel(input.policyType, input.termLength);

      const sections: string[] = [
        `EXTENDED APPLICATION SUBMITTED — DreamCap Financial`,
        ``,
        `Lead Information:`,
        `• Name: ${input.firstName || input.fullLegalName || "N/A"}`,
        `• Email: ${input.email || "N/A"}`,
        `• Phone: ${input.phone || "N/A"}`,
        `• Policy: ${policyLabel}`,
        `• Coverage: ${input.coverageAmount ? `$${input.coverageAmount.toLocaleString()}` : "N/A"}`,
        `• Est. Premium: ${input.monthlyPremium || "N/A"}`,
      ];

      if (input.fullLegalName || input.dateOfBirth || input.occupation || input.annualIncome) {
        sections.push(``, `Personal Information:`);
        if (input.fullLegalName) sections.push(`• Legal Name: ${input.fullLegalName}`);
        if (input.dateOfBirth) sections.push(`• Date of Birth: ${input.dateOfBirth}`);
        if (input.ssn) sections.push(`• SSN: Provided (encrypted)`);
        if (input.occupation) sections.push(`• Occupation: ${input.occupation}`);
        if (input.annualIncome) sections.push(`• Annual Income: ${input.annualIncome}`);
      }

      if (input.streetAddress || input.city || input.state) {
        sections.push(``, `Address:`);
        const addr = [input.streetAddress, input.city, input.state, input.zipCode].filter(Boolean).join(", ");
        sections.push(`• ${addr}`);
      }

      if (input.heightFt || input.weight || input.medicalConditions || input.medications) {
        sections.push(``, `Health Information:`);
        if (input.heightFt) sections.push(`• Height: ${input.heightFt}'${input.heightIn || 0}"`);
        if (input.weight) sections.push(`• Weight: ${input.weight} lbs`);
        if (input.medicalConditions && input.medicalConditions !== "None") sections.push(`• Medical Conditions: ${input.medicalConditions}`);
        if (input.medications && input.medications !== "None") sections.push(`• Medications: ${input.medications}`);
        if (input.familyHistory && input.familyHistory !== "None") sections.push(`• Family History: ${input.familyHistory}`);
        if (input.hospitalized) sections.push(`• Hospitalized (5yr): ${input.hospitalized}`);
        if (input.dui) sections.push(`• DUI/DWI (5yr): ${input.dui}`);
      }

      if (input.primaryBeneficiary) {
        sections.push(``, `Beneficiary Information:`);
        sections.push(`• Primary: ${input.primaryBeneficiary} (${input.beneficiaryRelationship || "N/A"})`);
        if (input.contingentBeneficiary) sections.push(`• Contingent: ${input.contingentBeneficiary}`);
      }

      if (input.additionalNotes) {
        sections.push(``, `Additional Notes:`, input.additionalNotes);
      }

      sections.push(
        ``,
        `Application ID: ${appId || "N/A"}`,
        `Lead ID: ${input.leadId}`,
        `Submitted: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EST`,
        ``,
        `---`,
        `This extended application was submitted through the DreamCap Financial dashboard.`,
        `Please review and follow up with the client.`
      );

      const emailSubject = `Extended Application: ${input.firstName || input.fullLegalName || "Client"} — ${input.email || "No email"}`;
      const emailBody = sections.join("\n");

      // Send notifications in parallel
      const notificationPromises: Promise<unknown>[] = [];

      notificationPromises.push(
        notifyOwner({ title: emailSubject, content: emailBody }).catch((error) => {
          console.error("[Leads] Failed to send application notification:", error);
        })
      );

      notificationPromises.push(
        sendLeadEmail(emailSubject, emailBody).catch((error) => {
          console.error("[Leads] Failed to send application email:", error);
        })
      );

      Promise.allSettled(notificationPromises).then((results) => {
        console.log(
          `[Leads] Application notification results — Owner: ${results[0].status}, Email: ${results[1].status}`
        );
      });

      return {
        success: true,
        applicationId: appId,
      };
    }),
});
