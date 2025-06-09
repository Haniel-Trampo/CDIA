import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  origin: text("origin").notNull(),
  email: text("email"),
  status: text("status").default("novo"),
  professionalType: text("professional_type"),
  maritalStatus: text("marital_status"),
  grossIncome: decimal("gross_income"),
  interestRegions: text("interest_regions").array(),
  interestedProperty: text("interested_property"),
  downPayment: decimal("down_payment"),
  documents: text("documents").array(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  code: text("code"),
  description: text("description"),
  salePrice: decimal("sale_price").notNull(),
  evaluationPrice: decimal("evaluation_price"),
  condominiumFee: decimal("condominium_fee"),
  iptu: decimal("iptu"),
  builder: text("builder"),
  address: text("address").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  garages: integer("garages"),
  squareMeters: decimal("square_meters"),
  amenities: text("amenities").array(),
  images: text("images").array(),
  referencePoints: text("reference_points").array(),
  status: text("status").default("disponivel"),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  leadId: integer("lead_id").references(() => leads.id).notNull(),
  salePrice: decimal("sale_price").notNull(),
  commission: decimal("commission").notNull(),
  saleDate: timestamp("sale_date").notNull(),
  status: text("status").default("em_processo"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leads.id).notNull(),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'user' or 'client'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  messageType: text("message_type").default("text"), // 'text', 'file', 'image'
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
}).extend({
  email: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  professionalType: z.string().nullable().optional(),
  maritalStatus: z.string().nullable().optional(),
  grossIncome: z.string().nullable().optional(),
  interestRegions: z.array(z.string()).nullable().optional(),
  interestedProperty: z.string().nullable().optional(),
  downPayment: z.string().nullable().optional(),
  documents: z.array(z.string()).nullable().optional(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
}).extend({
  code: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  evaluationPrice: z.string().nullable().optional(),
  condominiumFee: z.string().nullable().optional(),
  iptu: z.string().nullable().optional(),
  builder: z.string().nullable().optional(),
  bedrooms: z.number().nullable().optional(),
  bathrooms: z.number().nullable().optional(),
  garages: z.number().nullable().optional(),
  squareMeters: z.string().nullable().optional(),
  amenities: z.array(z.string()).nullable().optional(),
  images: z.array(z.string()).nullable().optional(),
  referencePoints: z.array(z.string()).nullable().optional(),
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Sale = typeof sales.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
