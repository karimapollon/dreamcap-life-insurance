import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table — captures initial lead data from the funnel
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  age: int("age"),
  gender: varchar("gender", { length: 20 }),
  tobacco: varchar("tobacco", { length: 10 }),
  policyType: varchar("policyType", { length: 50 }),
  termLength: int("termLength"),
  coverageAmount: int("coverageAmount"),
  monthlyPremium: varchar("monthlyPremium", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Extended applications table — captures optional extended application data from dashboard
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  fullLegalName: varchar("fullLegalName", { length: 255 }),
  dateOfBirth: varchar("dateOfBirth", { length: 20 }),
  ssn: varchar("ssn", { length: 20 }),
  occupation: varchar("occupation", { length: 255 }),
  annualIncome: varchar("annualIncome", { length: 100 }),
  streetAddress: varchar("streetAddress", { length: 500 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zipCode", { length: 20 }),
  heightFt: int("heightFt"),
  heightIn: int("heightIn"),
  weight: int("weight"),
  medicalConditions: text("medicalConditions"),
  medications: text("medications"),
  familyHistory: text("familyHistory"),
  hospitalized: varchar("hospitalized", { length: 10 }),
  dui: varchar("dui", { length: 10 }),
  primaryBeneficiary: varchar("primaryBeneficiary", { length: 255 }),
  beneficiaryRelationship: varchar("beneficiaryRelationship", { length: 100 }),
  contingentBeneficiary: varchar("contingentBeneficiary", { length: 255 }),
  additionalNotes: text("additionalNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;
