import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createLead: vi.fn().mockResolvedValue(42),
  createApplication: vi.fn().mockResolvedValue(101),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getLeadById: vi.fn(),
}));

// Mock the notification function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock the email function
vi.mock("./email", () => ({
  sendLeadEmail: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("leads.submitLead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts valid lead data and returns success with leadId", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.submitLead({
      firstName: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      age: 35,
      gender: "male",
      tobacco: "No",
      policyType: "term",
      termLength: 20,
      coverageAmount: 250000,
      monthlyPremium: "$29.70/mo",
    });

    expect(result.success).toBe(true);
    expect(result.leadId).toBe(42);
  });

  it("accepts minimal required fields (name, email, phone)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.submitLead({
      firstName: "Jane",
      email: "jane@example.com",
      phone: "555-0000",
    });

    expect(result.success).toBe(true);
    expect(result.leadId).toBe(42);
  });

  it("rejects submission with missing firstName", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submitLead({
        firstName: "",
        email: "test@example.com",
        phone: "555-0000",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submitLead({
        firstName: "Test",
        email: "not-an-email",
        phone: "555-0000",
      })
    ).rejects.toThrow();
  });

  it("rejects submission with missing phone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submitLead({
        firstName: "Test",
        email: "test@example.com",
        phone: "",
      })
    ).rejects.toThrow();
  });

  it("calls createLead with correct data", async () => {
    const { createLead } = await import("./db");
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.leads.submitLead({
      firstName: "Alice",
      email: "alice@example.com",
      phone: "555-1234",
      age: 45,
      gender: "female",
      tobacco: "Yes",
      policyType: "whole",
      coverageAmount: 100000,
      monthlyPremium: "$207.00/mo",
    });

    expect(createLead).toHaveBeenCalledWith({
      firstName: "Alice",
      email: "alice@example.com",
      phone: "555-1234",
      age: 45,
      gender: "female",
      tobacco: "Yes",
      policyType: "whole",
      termLength: null,
      coverageAmount: 100000,
      monthlyPremium: "$207.00/mo",
    });
  });

  it("calls notifyOwner with lead details", async () => {
    const { notifyOwner } = await import("./_core/notification");
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.leads.submitLead({
      firstName: "Bob",
      email: "bob@example.com",
      phone: "555-9999",
      age: 30,
      policyType: "term",
      termLength: 20,
      coverageAmount: 500000,
    });

    // Wait for the async notification promises to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("Bob"),
        content: expect.stringContaining("bob@example.com"),
      })
    );
  });

  it("calls sendLeadEmail for direct email delivery", async () => {
    const { sendLeadEmail } = await import("./email");
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.leads.submitLead({
      firstName: "Carol",
      email: "carol@example.com",
      phone: "555-8888",
    });

    // Wait for the async notification promises to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(sendLeadEmail).toHaveBeenCalledWith(
      expect.stringContaining("Carol"),
      expect.stringContaining("carol@example.com")
    );
  });
});

describe("leads.submitApplication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts valid application data and returns success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.submitApplication({
      leadId: 42,
      firstName: "John Doe",
      email: "john@example.com",
      phone: "555-1234",
      policyType: "term",
      coverageAmount: 250000,
      monthlyPremium: "$29.70/mo",
      termLength: 20,
      fullLegalName: "John Michael Doe",
      dateOfBirth: "1990-05-15",
      occupation: "Software Engineer",
      annualIncome: "$120,000",
      streetAddress: "123 Main St",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      heightFt: 5,
      heightIn: 10,
      weight: 170,
      primaryBeneficiary: "Jane Doe",
      beneficiaryRelationship: "spouse",
    });

    expect(result.success).toBe(true);
    expect(result.applicationId).toBe(101);
  });

  it("accepts minimal application with only leadId", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.submitApplication({
      leadId: 0,
    });

    expect(result.success).toBe(true);
    expect(result.applicationId).toBe(101);
  });

  it("calls createApplication with correct mapped fields", async () => {
    const { createApplication } = await import("./db");
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.leads.submitApplication({
      leadId: 42,
      fullLegalName: "Test User",
      ssn: "123-45-6789",
      heightFt: 6,
      heightIn: 0,
      weight: 180,
      medicalConditions: "None",
      hospitalized: "no",
      dui: "no",
      primaryBeneficiary: "Spouse Name",
      beneficiaryRelationship: "spouse",
      contingentBeneficiary: "Parent Name",
      additionalNotes: "Please call after 5pm",
    });

    expect(createApplication).toHaveBeenCalledWith(
      expect.objectContaining({
        leadId: 42,
        fullLegalName: "Test User",
        ssn: "123-45-6789",
        heightFt: 6,
        heightIn: 0,
        weight: 180,
        medicalConditions: "None",
        hospitalized: "no",
        dui: "no",
        primaryBeneficiary: "Spouse Name",
        beneficiaryRelationship: "spouse",
        contingentBeneficiary: "Parent Name",
        additionalNotes: "Please call after 5pm",
      })
    );
  });

  it("sends notification and email for extended application", async () => {
    const { notifyOwner } = await import("./_core/notification");
    const { sendLeadEmail } = await import("./email");
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.leads.submitApplication({
      leadId: 42,
      firstName: "Dave",
      email: "dave@example.com",
      phone: "555-7777",
      policyType: "whole",
      coverageAmount: 100000,
      fullLegalName: "David Smith",
    });

    // Wait for the async notification promises to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("Dave"),
        content: expect.stringContaining("dave@example.com"),
      })
    );

    expect(sendLeadEmail).toHaveBeenCalledWith(
      expect.stringContaining("Dave"),
      expect.stringContaining("dave@example.com")
    );
  });

  it("rejects application with missing leadId", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submitApplication({} as any)
    ).rejects.toThrow();
  });

  it("handles final expense policy type label correctly", async () => {
    const { notifyOwner } = await import("./_core/notification");
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await caller.leads.submitLead({
      firstName: "Elder",
      email: "elder@example.com",
      phone: "555-0001",
      policyType: "final",
      coverageAmount: 15000,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(notifyOwner).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Final Expense"),
      })
    );
  });
});
