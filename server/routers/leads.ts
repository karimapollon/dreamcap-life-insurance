import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { createLead, createApplication } from "../db";
import { notifyOwner } from "../_core/notification";
import {
  sendLeadNotificationEmail,
  sendApplicationNotificationEmail,
  buildLeadPlainText,
  buildApplicationPlainText,
  type LeadEmailData,
  type ApplicationEmailData,
} from "../email";

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

      // Build structured email data
      const emailData: LeadEmailData = {
        firstName: input.firstName,
        email: input.email,
        phone: input.phone,
        age: input.age,
        gender: input.gender,
        tobacco: input.tobacco,
        policyType: input.policyType,
        termLength: input.termLength,
        coverageAmount: input.coverageAmount,
        monthlyPremium: input.monthlyPremium,
        leadId,
      };

      const emailSubject = `New Lead: ${input.firstName} — ${input.email}`;
      const plainText = buildLeadPlainText(emailData);

      // Send notifications in parallel (don't block response)
      const notificationPromises: Promise<unknown>[] = [];

      // 1. Owner notification (built-in Manus notification — plain text)
      notificationPromises.push(
        notifyOwner({ title: emailSubject, content: plainText }).catch((error) => {
          console.error("[Leads] Failed to send owner notification:", error);
        })
      );

      // 2. Direct email with professional HTML template
      notificationPromises.push(
        sendLeadNotificationEmail(emailData).catch((error) => {
          console.error("[Leads] Failed to send direct email:", error);
        })
      );

      Promise.allSettled(notificationPromises).then((results) => {
        console.log(
          `[Leads] Notification results — Owner: ${results[0].status}, Email: ${results[1].status}`
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

      // Build structured email data with ALL fields including actual SSN
      const emailData: ApplicationEmailData = {
        leadId: input.leadId,
        firstName: input.firstName,
        email: input.email,
        phone: input.phone,
        policyType: input.policyType,
        coverageAmount: input.coverageAmount,
        monthlyPremium: input.monthlyPremium,
        termLength: input.termLength,
        fullLegalName: input.fullLegalName,
        dateOfBirth: input.dateOfBirth,
        ssn: input.ssn,  // Actual SSN included — not masked
        occupation: input.occupation,
        annualIncome: input.annualIncome,
        streetAddress: input.streetAddress,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
        heightFt: input.heightFt,
        heightIn: input.heightIn,
        weight: input.weight,
        medicalConditions: input.medicalConditions,
        medications: input.medications,
        familyHistory: input.familyHistory,
        hospitalized: input.hospitalized,
        dui: input.dui,
        primaryBeneficiary: input.primaryBeneficiary,
        beneficiaryRelationship: input.beneficiaryRelationship,
        contingentBeneficiary: input.contingentBeneficiary,
        additionalNotes: input.additionalNotes,
        applicationId: appId,
      };

      const name = input.fullLegalName || input.firstName || "Client";
      const emailSubject = `Full Application: ${name} — ${input.email || "No email"}`;
      const plainText = buildApplicationPlainText(emailData);

      // Send notifications in parallel
      const notificationPromises: Promise<unknown>[] = [];

      // 1. Owner notification (plain text for Manus notification system)
      notificationPromises.push(
        notifyOwner({ title: emailSubject, content: plainText }).catch((error) => {
          console.error("[Leads] Failed to send application notification:", error);
        })
      );

      // 2. Direct email with professional HTML template
      notificationPromises.push(
        sendApplicationNotificationEmail(emailData).catch((error) => {
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
